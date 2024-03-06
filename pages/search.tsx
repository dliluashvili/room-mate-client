import React, { useEffect, useState } from "react";
import { ISearchItems } from "../services/profile/profile.http";
import { useCheckAuth } from "../components/hooks/useCheckAuth";
import ProfileCard from "../components/pages/profile/profileCard";
import { useRouter } from "next/router";
import PayModal from "../components/pages/payModal";
import { useTypedSelector } from "../components/hooks/useTypeSelector";
import useTranslation from "next-translate/useTranslation";
import axios from "axios";
import { BASE_URL_GRAPHQL } from "../services/api";
import Pagination from "../components/common/pagination";
import { LangEnum } from "../graphql";
import NewHeader from "../components/NewHeader";
import NewFooter from "../components/NewFooter";
import Loader from "../components/common/loader";
import UserFilter from "../components/UserFilter";
import { Button } from "../@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../@/components/ui/sheet";

const Search = () => {
  useCheckAuth();

  const [searchResults, setSearchResults] = useState<ISearchItems[]>([]);
  const [pageInfo, setPageInfo] = useState<any>(null);
  const [openPayModal, setOpenPayModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filterData, setFilterData] = useState([]);
  const [search, setSearch] = useState(false);

  const { user } = useTypedSelector((state) => state.profile);

  let { t } = useTranslation("common");

  const router = useRouter();

  const getSearchResults = async () => {
    const token = localStorage.getItem("token");
    const query = `
            query FilterUsers($pagination: Pagination, $lang: LangEnum, $input: [FilterInput!]) {
              filterUsers(pagination: $pagination, lang: $lang, input: $input) {
                pageInfo {
                    hasNextPage
                    hasPrevious
                    offset
                    limit
                    total
                    page
                }
                list {
                    id
                    firstname
                    age
                    isFavourite
                    cardInfo {
                      bio
                      districtNames
                      budget
                    }
                  }
                }
              }
        `;

    const limit = 10;
    const offset = router.query.page
      ? (Number(router.query.page) - 1) * limit
      : 0;

    setLoading(true);

    const response = await axios.post(
      BASE_URL_GRAPHQL,
      {
        query: query,
        variables: {
          input: filterData !== null ? filterData : [],
          pagination: {
            offset,
            limit,
          },
          lang: router.locale === "en" ? LangEnum.En : LangEnum.Ka,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setLoading(false);

    if (!response.data?.errors) {
      setSearchResults(response.data.data.filterUsers.list);
      setPageInfo(response.data.data.filterUsers.pageInfo);
    }
  };

  useEffect(() => {
    if (user && !user?.payed) {
      setOpenPayModal(true);
      return;
    }

    getSearchResults();
  }, [router.locale, router.query.page, search]);

  const updateAddRemove = (id: number, saveId: boolean) => {
    const updatedSearchResults = searchResults.map((el) => {
      if (!saveId && el.id === id) {
        return { ...el, isFavourite: true };
      }
      if (saveId && el.id === id) {
        return { ...el, isFavourite: false };
      }
      return { ...el };
    });

    setSearchResults(updatedSearchResults);
  };

  console.log(filterData);

  return (
    <div className="">
      <NewHeader />
      {openPayModal ? (
        <PayModal
          isModal
          setClose={() => {
            setOpenPayModal(false);
          }}
        />
      ) : null}

      <div className="searchPage">
        <div className="flex flex-col md:flex-row  items-start justify-start px-10 w-full md:pl-32 pt-10 md:pr-[200px]">
          <div className="hidden md:flex">
            <UserFilter
              setFilterData={setFilterData}
              filterData={filterData}
              search={search}
              setSearch={setSearch}
            />
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <Button className="md:hidden">Filter</Button>
            </SheetTrigger>
            <SheetContent
              side="bottom"
              className=" px-6 pt-3 pb-14 bg-[#F2F5FF] flex flex-col items-start w-full overflow-y-auto min-h-screen"
            >
              <UserFilter
                setFilterData={setFilterData}
                filterData={filterData}
                search={search}
                setSearch={setSearch}
              />
            </SheetContent>
          </Sheet>

          {loading ? (
            <Loader className="static w-full search_mainContent  ml-12" />
          ) : (
            <div className="search_mainContent w-full md:ml-12">
              {!searchResults?.length ? (
                <div className="text-center mt-5">{t("statementNotFound")}</div>
              ) : (
                searchResults?.map((el) => {
                  return (
                    <ProfileCard
                      setPayModal={() => {
                        setOpenPayModal(true);
                      }}
                      key={el.id}
                      {...el}
                      updateAddRemove={updateAddRemove}
                    />
                  );
                })
              )}

              <Pagination
                pagePath="/search"
                maxPage={
                  pageInfo ? Math.floor(pageInfo.total / pageInfo.limit) : 1
                }
                maxItem={pageInfo?.limit}
              />
            </div>
          )}
        </div>
      </div>

      <NewFooter />
    </div>
  );
};

export default Search;

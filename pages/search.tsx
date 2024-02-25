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

const Search = () => {
  useCheckAuth();

  const [searchResults, setSearchResults] = useState<ISearchItems[]>([]);
  const [pageInfo, setPageInfo] = useState<any>(null);
  const [openPayModal, setOpenPayModal] = useState(false);
  const [loading, setLoading] = useState(false);

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
                data {
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
          input: [],
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
      setSearchResults(response.data.data.filterUsers.data);
      setPageInfo(response.data.data.filterUsers.pageInfo);
    }
  };

  useEffect(() => {
    if (user && !user?.payed) {
      setOpenPayModal(true);
      return;
    }

    getSearchResults();
  }, [router.locale, router.query.page]);

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

      {loading ? (
        <Loader className="static" />
      ) : (
        <div className="searchPage">
          <div className="container d-flex pt-5">
            <div className="search_mainContent">
              {!searchResults.length ? (
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
          </div>
        </div>
      )}
      <NewFooter />
    </div>
  );
};

export default Search;

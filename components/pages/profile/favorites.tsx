import React, { useEffect, useState } from "react";
import ProfileCard from "./profileCard";
import {
  ProfileService,
  ISearchItems,
} from "../../../services/profile/profile.http";
import PayModal from "../payModal";
import { useRouter } from "next/router";
import Pagination from "../../common/pagination";
import Loader from "../../common/loader";

const Favorites = () => {
  const [favoritesList, setFavoritesList] = useState<ISearchItems[] | null>(
    null
  );
  const [payModal, setPayModal] = useState(false);
  const [pageInfo, setPageInfo] = useState<any>(null);

  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const fetchFavorites = () => {
    const limit = 10;
    const offset = router.query.page
      ? (Number(router.query.page) - 1) * limit
      : 0;

    setLoading(true);
    ProfileService.getFavorites({ lang: router.locale, limit, offset })
      .then((res: any) => {
        const onlyUsersData = res.data.list.map((el) => el.favourite);

        setFavoritesList(onlyUsersData);
        setPageInfo(res.data.pageInfo);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const updateAddRemove = (id, saveId) => {
    setFavoritesList(favoritesList.filter((el) => el.favourite_id !== id));
  };

  useEffect(() => {
    fetchFavorites();
  }, [router.locale, router.query.page]);

  if (loading) {
    return <Loader className="mt-12 h-auto w-full ml-auto mr-auto static" />;
  }

  return (
    <div className="mt-3">
      {payModal ? (
        <PayModal
          setClose={() => {
            setPayModal(false);
          }}
          isModal
        />
      ) : null}
      {favoritesList?.map((el) => {
        return (
          <ProfileCard
            setPayModal={() => {
              setPayModal(true);
            }}
            key={el.id}
            {...el}
            isFavourite={true}
            updateAddRemove={updateAddRemove}
          />
        );
      })}
      <Pagination
        pagePath="/profile/favorites"
        maxPage={pageInfo ? Math.floor(pageInfo.total / pageInfo.limit) : 1}
        maxItem={pageInfo?.limit}
      />
    </div>
  );
};

export default Favorites;

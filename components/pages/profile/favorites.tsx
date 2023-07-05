import React, { useEffect, useState } from "react";
import ProfileCard from "./profileCard";
import {
  ProfileService,
  ISearchItems,
} from "../../../services/profile/profile.http";
import PayModal from "../payModal";
import { useRouter } from "next/router";

const Favorites = () => {
  const [favoritesList, setFavoritesList] = useState<ISearchItems[] | null>(
    null
  );
  const [payModal, setPayModal] = useState(false);

  const router = useRouter();

  useEffect(() => {
    ProfileService.getFavorites({ lang: router.locale })
      .then((res) => {
        setFavoritesList(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [router.locale]);

  const updateAddRemove = (id, saveId) => {
    // debugger;
    setFavoritesList(favoritesList.filter((el) => el.favourite_id !== id));
  };

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
            key={el.favourite_id}
            {...el}
            isFavourite={true}
            updateAddRemove={updateAddRemove}
          />
        );
      })}
    </div>
  );
};

export default Favorites;

import React, { useEffect, useState } from "react";
import { Flats } from "../../../services/flats/flats.http";
import HouseCard from "./houseCard";
import { useRouter } from "next/router";
import Pagination from "../../common/pagination";
import Loader from "../../common/loader";

const FavoriteFlats = () => {
  const [flatsList, setFlatsList] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const fetchFavorites = () => {
    const page = router?.query?.page ? Number(router.query.page) : 1;

    setLoading(true);
    Flats.getFavoriteFlats(router.locale, page)
      .then((res) => {
        // await new Promise((resolve) => setTimeout(resolve, 4000));
        setFlatsList(
          res.data.data.map((el) => {
            el.isFavourite = 1;
            return el;
          })
        );
        setMeta(res.data.meta);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchFavorites();
  }, [router.locale, router.query.page]);

  if (loading) {
    return <Loader className="mt-12 h-auto w-full ml-auto mr-auto static" />;
  }

  return (
    <div className="d-flex flex-wrap flex-col mt-4 favourite_flat">
      <div className="d-flex justify-content-center justify-content-md-start">
        {flatsList.map((el, i) => {
          return (
            <HouseCard
              className="mr-3"
              key={i}
              data={el}
              addRemoveFavorite={(flag, id) => {
                setFlatsList([
                  ...flatsList.filter((item) => {
                    if (item.id === id) {
                      return null;
                    }

                    return item;
                  }),
                ]);
              }}
              isAuth={true}
            />
          );
        })}
      </div>
      <Pagination
        pagePath="/profile/flats"
        maxPage={meta?.pageCount}
        maxItem={meta?.take}
      />
    </div>
  );
};

export default FavoriteFlats;

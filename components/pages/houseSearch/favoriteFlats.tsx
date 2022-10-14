import React, { useEffect, useState } from "react";
import { Flats } from "../../../services/flats/flats.http";
import HouseCard from "./houseCard";

const FavoriteFlats = () => {
  const [flatsList, setFlatsList] = useState([]);
  useEffect(() => {
    Flats.getFavoriteFlats()
      .then((res) => {
        console.log(res);
        setFlatsList(
          res.data.data.map((el) => {
            el.isFavourite = 1;
            return el;
          })
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="d-flex justify-content-center flex-wrap mt-4 ">
      <div
        //   style={max}
        className="d-flex flex-wrap justify-content-center justify-content-md-start"
      >
        {flatsList.map((el, i) => {
          return (
            <HouseCard
              key={i}
              data={el}
              addRemoveFavorite={(flag, id) => {
                console.log(flag, id);
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
    </div>
  );
};

export default FavoriteFlats;

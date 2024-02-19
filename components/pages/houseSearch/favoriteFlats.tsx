import React, { useEffect, useState } from 'react';
import { Flats } from '../../../services/flats/flats.http';
import HouseCard from './houseCard';
import { useRouter } from 'next/router';

const FavoriteFlats = () => {
    const [flatsList, setFlatsList] = useState([]);

    const router = useRouter();

    useEffect(() => {
        Flats.getFavoriteFlats(router.locale)
            .then((res) => {
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
    }, [router.locale]);

    return (
        <div className="d-flex flex-wrap mt-4 favourite_flat">
            <div className="d-flex flex-wrap justify-content-center justify-content-md-start">
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
        </div>
    );
};

export default FavoriteFlats;

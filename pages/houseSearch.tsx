import React, { useContext, useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/footer';
import { Questions, IQuestions } from '../services/questions/questions.http';
import { Flats } from '../services/flats/flats.http';
import { ProfileService, ISearchItems } from '../services/profile/profile.http';
import { useCheckAuth } from '../components/hooks/useCheckAuth';
// import Choice from "../components/pages/search/searchItems/choice";
import Choice from '../components/pages/houseSearch/houseSearchComponets/choice';

import { SearchProvider } from '../components/pages/search/context/searchContext';
import { HouseSearchContext } from '../components/pages/houseSearch/houseSearchComponets/houseSearchContext';
import Link from 'next/link';
import ProfileCard from '../components/pages/profile/profileCard';
import Range from '../components/pages/houseSearch/houseSearchComponets/range';
import { Button } from '../components/common/form';
import Checkbox from '../components/pages/houseSearch/houseSearchComponets/checkbox';
import LocationSearch from '../components/pages/search/searchItems/locationSearch';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/action-creators';
import PayModal from '../components/pages/payModal';
import { useTypedSelector } from '../components/hooks/useTypeSelector';
import Pagination from '../components/common/pagination';
import useTranslation from 'next-translate/useTranslation';
import TextSearch from '../components/pages/houseSearch/houseSearchComponets/testField';

import HouseCard from '../components/pages/houseSearch/houseCard';

const Search = () => {
    useCheckAuth(false);
    const [searchParams, setSearchParams] = useState<any[]>([]);
    const [searchResults, setSearchResults] = useState<any>([]);
    const [openSearchMenu, setOpenSearchMenu] = useState(false);
    // const [takosModali, setTakosModali] = useState(false);
    const [meta, setMeta] = useState<any>();
    let { t } = useTranslation('common');

    const [openPayModal, setOpenPayModal] = useState(false);

    const { user } = useTypedSelector((state) => state.profile);

    const { searchObject, setSearchObject, setSearchObjectFromQuery } =
        useContext(HouseSearchContext);
    const router = useRouter();
    const dispatch = useDispatch();

    useEffect(() => {
        Flats.getFlatFilters({
            lang: router.locale,
        })
            .then((res) => {
                setSearchParams(res.data.filter((el) => el.type !== 'chies'));
            })
            .catch((err) => {
                console.log(err);
            });
    }, [router.locale]);

    useEffect(() => {
        if (router.query) {
            setSearchObjectFromQuery(router.query);
        }
    }, []);

    useEffect(() => {
        Flats.getFlats({
            ...searchObject,
            page: router.query.page ? router.query.page : 1,
            locale: router.locale,
        })
            .then((res) => {
                setMeta(res.data.meta);

                setSearchResults(res.data.data);
            })
            .catch((err) => {
                if (err?.response?.data?.message === 'Unauthorized') {
                    dispatch(logout());
                    window.location.replace('/login');
                }
                // debugger;
            });
    }, [router.query, router.locale]);

    const searchHandler = () => {
        router.push('/houseSearch', {
            query: {
                ...searchObject,
                page: 1,
            },
        });

        setSearchObjectFromQuery(searchObject);
    };

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

    const toggleSearchMenu = (
        e: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
        if (openSearchMenu) {
            setOpenSearchMenu(false);
        } else {
            setOpenSearchMenu(true);
        }
    };

    return (
        <div className="">
            <Header />
            {/* <SearchProvider> */}
            {openPayModal ? (
                <PayModal
                    isModal
                    setClose={() => {
                        setOpenPayModal(false);
                    }}
                />
            ) : null}

            <div className="searchPage searchPage-houses">
                <div className="container d-flex pt-5">
                    <div
                        className={classNames('search_sideBar', {
                            openSearchMenu: openSearchMenu,
                        })}
                    >
                        {searchParams.map((el) => {
                            if (el.search_type === 'checkbox') {
                                return (
                                    <Checkbox
                                        title={el.title}
                                        name={el.name}
                                    />
                                );
                            } else if (el.search_type === 'range') {
                                return (
                                    <Range
                                        key={el.id}
                                        data={el}
                                    />
                                );
                            } else if (el.search_type === 'choice') {
                                return (
                                    <Choice
                                        data={el.data}
                                        name={el.name}
                                        title={el.title}
                                    />
                                );
                            }
                        })}

                        <div></div>
                        <div className="searchBtnWrapper">
                            <button
                                onClick={searchHandler}
                                className="btn btn-primary w-100 text-center"
                            >
                                <svg
                                    className="mr-3"
                                    width="18"
                                    height="18"
                                    viewBox="0 0 18 18"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M17.2688 15.1976L13.9582 11.8876C13.8088 11.7382 13.6062 11.6552 13.3937 11.6552H12.8525C13.7689 10.4832 14.3135 9.00913 14.3135 7.40558C14.3135 3.59091 11.2221 0.5 7.40676 0.5C3.59144 0.5 0.5 3.59091 0.5 7.40558C0.5 11.2202 3.59144 14.3112 7.40676 14.3112C9.01058 14.3112 10.4849 13.7667 11.6571 12.8504V13.3915C11.6571 13.604 11.7401 13.8065 11.8895 13.9559L15.2001 17.2659C15.5122 17.578 16.017 17.578 16.3258 17.2659L17.2655 16.3264C17.5776 16.0143 17.5776 15.5097 17.2688 15.1976ZM7.40676 11.6552C5.05912 11.6552 3.15644 9.75613 3.15644 7.40558C3.15644 5.05834 5.0558 3.15599 7.40676 3.15599C9.75439 3.15599 11.6571 5.05502 11.6571 7.40558C11.6571 9.75281 9.75771 11.6552 7.40676 11.6552Z"
                                        fill="white"
                                    />
                                </svg>
                                {t('filter')}
                            </button>
                        </div>
                    </div>
                    <div className="search_mainContent ml-5">
                        <div className="d-flex ">
                            <div
                                onClick={toggleSearchMenu}
                                className="searchMenu_btn d-flex d-md-none "
                            >
                                {openSearchMenu ? (
                                    <svg
                                        width="23"
                                        height="23"
                                        viewBox="0 0 23 23"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M11.5 0C5.16235 0 0 5.16235 0 11.5C0 17.8377 5.16235 23 11.5 23C17.8377 23 23 17.8377 23 11.5C23 5.16235 17.8377 0 11.5 0ZM11.5 2.3C16.5946 2.3 20.7 6.40536 20.7 11.5C20.7 16.5946 16.5946 20.7 11.5 20.7C6.40536 20.7 2.3 16.5946 2.3 11.5C2.3 6.40536 6.40536 2.3 11.5 2.3ZM7.71309 6.08691L6.08691 7.71309L9.87383 11.5L6.08691 15.2869L7.71309 16.9131L11.5 13.1262L15.2869 16.9131L16.9131 15.2869L13.1262 11.5L16.9131 7.71309L15.2869 6.08691L11.5 9.87383L7.71309 6.08691Z"
                                            fill="#19A463"
                                        />
                                    </svg>
                                ) : (
                                    <svg
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M13.875 11.9999L3.75004 11.9999"
                                            stroke="#19A463"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M20.25 11.9999L17.625 11.9999"
                                            stroke="#19A463"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M13.875 11.9999C13.875 13.0354 14.7145 13.8749 15.75 13.8749C16.7855 13.8749 17.625 13.0354 17.625 11.9999C17.625 10.9643 16.7855 10.1249 15.75 10.1249C14.7145 10.1249 13.875 10.9643 13.875 11.9999Z"
                                            stroke="#19A463"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M6.375 18.7499L3.75001 18.75"
                                            stroke="#19A463"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M20.25 18.75L10.125 18.7499"
                                            stroke="#19A463"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M6.37501 18.7499C6.37501 19.7854 7.21448 20.6249 8.25001 20.6249C9.28554 20.6249 10.125 19.7854 10.125 18.7499C10.125 17.7143 9.28554 16.8749 8.25001 16.8749C7.21448 16.8749 6.37501 17.7143 6.37501 18.7499Z"
                                            stroke="#19A463"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M9.375 5.24987L3.75002 5.24976"
                                            stroke="#19A463"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M20.25 5.24976L13.125 5.24987"
                                            stroke="#19A463"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M9.37502 5.24987C9.37502 6.2854 10.2145 7.12486 11.25 7.12486C12.2855 7.12486 13.125 6.2854 13.125 5.24987C13.125 4.21434 12.2855 3.37488 11.25 3.37488C10.2145 3.37488 9.37502 4.21434 9.37502 5.24987Z"
                                            stroke="#19A463"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                )}
                            </div>
                            {/* <div className="w-100">
                <TextSearch searchHandler={searchHandler} />
              </div> */}
                        </div>
                        <div className="d-flex flex-wrap houseCard_container justify-content-md-start  justify-content-center">
                            {!searchResults.length ? (
                                <div className="text-center mt-5">
                                    {t('statementNotFound')}
                                </div>
                            ) : (
                                searchResults?.map((el) => {
                                    return (
                                        <HouseCard
                                            isAuth={!!user}
                                            setPayModal={() => {}}
                                            addRemoveFavorite={(flag, id) => {
                                                setSearchResults([
                                                    ...searchResults.map(
                                                        (item) => {
                                                            if (
                                                                item.id === id
                                                            ) {
                                                                if (
                                                                    flag ===
                                                                    'remove'
                                                                ) {
                                                                    item.isFavourite = 0;
                                                                } else {
                                                                    item.isFavourite = 1;
                                                                }
                                                            }

                                                            return item;
                                                        }
                                                    ),
                                                ]);
                                            }}
                                            key={el.id}
                                            data={el}
                                            updateAddRemove={updateAddRemove}
                                        />
                                    );
                                })
                            )}
                        </div>

                        <Pagination
                            pagePath="/houseSearch"
                            maxPage={meta?.pageCount}
                            maxItem={meta?.take}
                        />
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Search;

import React, { useContext, useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/footer';
import { ISearchItems } from '../services/profile/profile.http';
import { useCheckAuth } from '../components/hooks/useCheckAuth';
import ProfileCard from '../components/pages/profile/profileCard';
import { useRouter } from 'next/router';
import PayModal from '../components/pages/payModal';
import { useTypedSelector } from '../components/hooks/useTypeSelector';
import useTranslation from 'next-translate/useTranslation';
import axios from 'axios';
import { BASE_URL_NEW } from '../services/api';
import Pagination from '../components/common/pagination';

const Search = () => {
    useCheckAuth();
    const [searchResults, setSearchResults] = useState<ISearchItems[]>([]);
    const [pageInfo, setPageInfo] = useState<any>(null);
    let { t } = useTranslation('common');

    const [openPayModal, setOpenPayModal] = useState(false);

    const { user } = useTypedSelector((state) => state.profile);

    const router = useRouter();

    const getSearchResults = async () => {
        const query = `
            query FilterUsers($offset: Int!, $limit: Int!, $input: [FilterInput!]) {
                filterUsers(offset: $offset, limit: $limit, input: $input) {
                    pageInfo {
                        hasNextPage
                        hasPrevious
                        offset
                        limit
                        total
                    }
                    data {
                        id
                        firstname
                        age
                        cardInfo {
                            bio
                            districtsName
                            budget
                        }
                    }
                }
            }
        `;

        const response = await axios.post(BASE_URL_NEW, {
            query: query,
            variables: {
                input: [],
                offset: !pageInfo ? 0 : pageInfo.page * pageInfo.limit,
                limit: 10,
            },
        });

        if (response.data?.data) {
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
        // router.query.page
        // router.locale

        // TODO: need to refetch data when page, or locale changes
    }, [router.query, router.locale]);

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
            <Header />
            {openPayModal ? (
                <PayModal
                    isModal
                    setClose={() => {
                        setOpenPayModal(false);
                    }}
                />
            ) : null}

            <div className="searchPage">
                <div className="container d-flex pt-5">
                    <div className="search_mainContent">
                        {!searchResults.length ? (
                            <div className="text-center mt-5">
                                {t('statementNotFound')}
                            </div>
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
                                pageInfo ? pageInfo.total / pageInfo.limit : 1
                            }
                            maxItem={pageInfo?.limit}
                        />
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Search;

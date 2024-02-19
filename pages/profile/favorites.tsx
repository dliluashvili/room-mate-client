import React from 'react';
import ProfileWrapper from '../../components/pages/profile/profileWrapper';
import ProfileTab from '../../components/pages/profile/components/profileTab';
import FavoritesContent from '../../components/pages/profile/favorites';
import useTranslation from 'next-translate/useTranslation';

const Favorites = (props) => {
    let { t } = useTranslation('common');

    const tabs = [
        {
            label: t('notifications'),
            path: '/profile',
        },
        {
            label: t('favorites'),
            path: '/profile/favorites',
        },
        // {
        //   label: t("maklierebi"),
        //   path: "/profile/agents",
        // },
        {
            label: t('savedApartments'),
            path: '/profile/flats',
        },
    ];

    return (
        <ProfileWrapper>
            <ProfileTab tabs={tabs} />
            <FavoritesContent />
        </ProfileWrapper>
    );
};

export default Favorites;

import React from "react";
import ProfileWrapper from "../../components/pages/profile/profileWrapper";
import ProfileTab from "../../components/pages/profile/components/profileTab";
import FavoritesContent from "../../components/pages/profile/favorites";
import useTranslation from "next-translate/useTranslation";

const Favorites = (props) => {
  let { t } = useTranslation("common");

  const tabs = [
    {
      label: t("favorites"),
      path: "/profile/favorites",
    },
    {
      label: t("savedApartments"),
      path: "/profile/flats",
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

import React from "react";
import ProfileWrapper from "../../components/pages/profile/profileWrapper";
import ProfileTab from "../../components/pages/profile/components/profileTab";
import Notifications from "../../components/pages/profile/notifications";
import useTranslation from "next-translate/useTranslation";

const Profile = (props) => {
  let { t } = useTranslation("common");

  const tabs = [
    {
      label: t("notifications"),
      path: "/profile",
    },
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
      <Notifications />
    </ProfileWrapper>
  );
};

export default Profile;

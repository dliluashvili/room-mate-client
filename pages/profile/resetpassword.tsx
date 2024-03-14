import React from "react";
import ProfileTab from "../../components/pages/profile/components/profileTab";

import ProfileWrapper from "../../components/pages/profile/profileWrapper";
import ResetPassword from "../../components/pages/profile/resetPsswors";
import useTranslation from "next-translate/useTranslation";

function Edit() {
  let { t } = useTranslation("common");

  const tabs = [
    {
      label: t("editProfile"),
      path: "/profile/edit",
    },
    {
      label: t("changePassword"),
      path: "/profile/resetpassword",
    },
  ];

  return (
    <ProfileWrapper consumerPage={"edit"}>
      <ProfileTab tabs={tabs} />
      <ResetPassword />
    </ProfileWrapper>
  );
}

export default Edit;

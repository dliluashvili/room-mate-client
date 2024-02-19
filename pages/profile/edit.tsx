import React from "react";
import ProfileTab from "../../components/pages/profile/components/profileTab";

import ProfileWrapper from "../../components/pages/profile/profileWrapper";
import QuestionEdit from "../../components/pages/profile/questionEdit";
import useTranslation from "next-translate/useTranslation";

function Edit(props) {
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

      <QuestionEdit />
    </ProfileWrapper>
  );
}

export default Edit;

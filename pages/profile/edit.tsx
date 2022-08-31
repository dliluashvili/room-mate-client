import React from "react";
import PropTypes from "prop-types";
import { useCheckAuth } from "../../components/hooks/useCheckAuth";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentUser, logout } from "../../redux/action-creators";
import { useTypedSelector } from "../../components/hooks/useTypeSelector";
import Header from "../../components/Header";
import Link from "next/link";
import { useRouter } from "next/router";
import ProfileTab from "../../components/pages/profile/components/profileTab";

import Loader from "../../components/common/loader";
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

import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useCheckAuth } from "../../components/hooks/useCheckAuth";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentUser, logout } from "../../redux/action-creators";
import { useTypedSelector } from "../../components/hooks/useTypeSelector";
import Header from "../../components/Header";
import Link from "next/link";
import { useRouter } from "next/router";
import Loader from "../../components/common/loader";
import ProfileWrapper from "../../components/pages/profile/profileWrapper";
import { Questions, IQuestions } from "../../services/questions/questions.http";
import QuestionPreview from "../../components/pages/profile/QuestionPreview";
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
      label: t("maklierebi"),
      path: "/profile/agents",
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

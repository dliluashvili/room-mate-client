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

const tabs = [
  {
    label: "პროფილის რედაქტირება",
    path: "/profile/edit",
  },
  {
    label: "პაროლის შეცვლა",
    path: "/profile/resetpassword",
  },
];

function Edit(props) {
  return (
    <ProfileWrapper consumerPage={"edit"}>
      <ProfileTab tabs={tabs} />

      <QuestionEdit />
    </ProfileWrapper>
  );
}

export default Edit;

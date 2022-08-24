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
import FavoritesContent from "../../components/pages/profile/favorites";

const tabs = [
  {
    label: "შეტყობინებები",
    path: "/profile",
  },
  {
    label: "ფავორიტები",
    path: "/profile/favorites",
  },
];

const Favorites = (props) => {
  return (
    <ProfileWrapper>
      <ProfileTab tabs={tabs} />
      <FavoritesContent />
    </ProfileWrapper>
  );
};

export default Favorites;

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
import useTranslation from "next-translate/useTranslation";
import { ProfileService } from "../../services/profile/profile.http";

const Favorites = (props) => {
  let { t } = useTranslation("common");
  const [agents, setAgents] = useState([]);

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

  useEffect(() => {
    ProfileService.getAgents()
      .then((res) => {
        console.log(res);
        setAgents(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <ProfileWrapper>
      <ProfileTab tabs={tabs} />
      {/* <FavoritesContent /> */}
      <div className="d-flex flex-wrap mt-4">
        {agents.map((el, i) => {
          return (
            <div key={i} className="notification_card mr-3 ">
              <b>
                {" "}
                {el.fullname}: {el.phone}
              </b>
              <div
                style={{
                  fontSize: "13px",
                }}
              >
                უძრავი ქონების აგენტებთან დარეკვისას აუცილებლად უთხარი, რომ
                Roommate Georgia-დან ურეკავ
              </div>
            </div>
          );
        })}
      </div>
    </ProfileWrapper>
  );
};

export default Favorites;

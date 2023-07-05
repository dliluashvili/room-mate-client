import React, { useEffect, useState } from "react";
import useTranslation from "next-translate/useTranslation";
import {
  ProfileService
} from "../../../services/profile/profile.http";
import classNames from "classnames";
import ReceiveNotification from "./components/receiveNotification";
import SentNotification from "./components/sentNotification";
import { useTypedSelector } from "../../hooks/useTypeSelector";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "../../../redux/action-creators";

const Notifications = () => {
  const [notificationType, setNotificationType] = useState<"sent" | "receive">(
    "receive"
  );
  let { t } = useTranslation("common");

  const user = useTypedSelector((state) => state.profile.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user.notifications) {
      ProfileService.updateNotifications({})
        .then((res) => {
          console.log(res);
          dispatch(
            setCurrentUser({
              user: {
                ...user,
                notifications: 1,
              },
            })
          );
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  return (
    <div className="d-flex flex-wrap mt-4 ">
      <div className="d-flex m-3">
        <span
          onClick={() => {
            setNotificationType("receive");
          }}
          className={classNames("btn btn-light  mr-3", {
            ["active"]: notificationType !== "receive",
          })}
        >
          {t("resave")}
        </span>
        <span
          onClick={() => {
            setNotificationType("sent");
          }}
          className={classNames("btn btn-light  ", {
            ["active"]: notificationType !== "sent",
          })}
        >
          {t("sent")}
        </span>
      </div>
      <div className="container notificationsContainer p-0">
        {notificationType === "receive" ? (
          <ReceiveNotification />
        ) : (
          <SentNotification />
        )}
      </div>
    </div>
  );
};

export default Notifications;

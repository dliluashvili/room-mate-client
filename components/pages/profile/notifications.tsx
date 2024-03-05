import React, { useEffect, useState } from "react";
import useTranslation from "next-translate/useTranslation";
import { ProfileService } from "../../../services/profile/profile.http";
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

  const backendNotificationType =
    notificationType === "receive" ? "received_request" : "answer_to_request";

  const user = useTypedSelector((state) => state.profile.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user?.notifications?.length) {
      ProfileService.updateNotifications({
        type: backendNotificationType,
      })
        .then((res) => {
          dispatch(
            setCurrentUser({
              user: {
                ...user,
                notifications: user.notifications.filter(
                  (notification) =>
                    notification.type !== backendNotificationType
                ),
              },
            })
          );
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [notificationType]);

  const sentNotifications = user?.notifications?.filter(
    (notification) => notification.type === "answer_to_request"
  );

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
          className={classNames("btn btn-light relative", {
            ["active"]: notificationType !== "sent",
          })}
        >
          {t("sent")}
          {!!sentNotifications?.length && (
            <div className="absolute flex items-center justify-center font-semibold  -top-3 -right-3 rounded-full text-white text-xs bg-primaryBeta  w-7 h-7">
              {sentNotifications.length}
            </div>
          )}
        </span>
      </div>
      <div className="container notificationsContainer p-0 justify-start">
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

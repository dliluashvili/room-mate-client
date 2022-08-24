import React, { useEffect, useState } from "react";
import NotificationsCard from "./components/notificationsCard";
import {
  ProfileService,
  INotificationReceiver,
  INotificationSent,
} from "../../../services/profile/profile.http";
import classNames from "classnames";
import ReceiveNotification from "./components/receiveNotification";
import SentNotification from "./components/sentNotification";
const Notifications = () => {
  const [notificationType, setNotificationType] = useState<"sent" | "receive">(
    "receive"
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
          მიღებული
        </span>
        <span
          onClick={() => {
            setNotificationType("sent");
          }}
          className={classNames("btn btn-light  ", {
            ["active"]: notificationType !== "sent",
          })}
        >
          გაგზავნილი
        </span>
      </div>
      <div className="container notificationsContainer p-0">
        {notificationType === "receive" ? (
          <ReceiveNotification />
        ) : (
          <SentNotification />
        )}
        {/* <div className="col-12 col-md-4">
            <NotificationsCard />
          </div>{" "}
          <div className="col-12 col-md-4">
            <NotificationsCard />
          </div>
          <div className="col-12 col-md-4">
            <NotificationsCard />
          </div> */}
      </div>
    </div>
  );
};

export default Notifications;

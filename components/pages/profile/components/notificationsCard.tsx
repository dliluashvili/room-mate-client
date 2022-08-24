import React from "react";
import { Button } from "../../../common/form";
import {
  INotificationReceiver,
  INotificationSent,
} from "../../../../services/profile/profile.http";
import classNames from "classnames";
import Link from "next/link";

interface IProps {
  text: string;
  type?: string;
  id: number;
}

const NotificationsCard: React.FC<IProps> = ({ text, id, children, type }) => {
  return (
    <div
      className={classNames("notification_card ", {
        [type]: type,
      })}
    >
      <div className="notification_body d-flex">
        <Link href={"/user/" + id}>
          <a>
            <img src="/imgs/download.jpg" />
          </a>
        </Link>
        <p>
          {text}
          {/* {type === "sent"
            ? `თქვენ გაგზავნილი გაქვთ ${receiver_firstname} ${receiver_lastname} - სთან კონტაქტების ნახვის მოთხოვნა`
            : `${sender_firstname} ${sender_lastname} - ს უნდა თქვენი კონტაქტების ნახვა`} */}
        </p>
      </div>
      <div className="notification_footer d-flex ">
        {children}
        {/* {type === "receive" ? (
          <Button className="btn btn-light w-100">მოთხოვნის გაუქმება</Button>
        ) : (
          <>
            <Button className="btn btn-light w-50  mr-3">უარყოფა</Button>
            <Button className="btn btn-primary w-50">დაშვება</Button>
          </>
        )} */}
      </div>
    </div>
  );
};

export default NotificationsCard;

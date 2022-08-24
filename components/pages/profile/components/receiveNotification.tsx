import React, { useEffect, useState } from "react";
import NotificationsCard from "./notificationsCard";
import {
  ProfileService,
  INotificationReceiver,
  INotificationSent,
} from "../../../../services/profile/profile.http";
import classNames from "classnames";
import { Button } from "../../../common/form";
import { ToastContainer, toast } from "react-toastify";
import { useCheckUnAuthResponse } from "../../../hooks/useCheckUnauthRespnse";

const ReceiveNotification = () => {
  const [sentNotifications, setSentNotifications] = useState<
    INotificationReceiver[] | null
  >(null);

  const checkAuth = useCheckUnAuthResponse();

  useEffect(() => {
    ProfileService.getReceivedNotifications()
      .then((res) => {
        console.log(res);
        setSentNotifications(res.data);
      })
      .catch((err) => {
        if (err?.response?.data?.message === "Unauthorized") {
          checkAuth();
        }

        console.log(err);
      });
  }, []);

  const answerAllowRequest = (
    data: INotificationReceiver,
    flag: "reject" | "approve"
  ) => {
    let requestBody: { senderId: number; answer: 2 | 3 } = {
      senderId: data.sender_id,
      answer: 2,
    };

    if (flag === "reject") {
      requestBody.answer = 3;
    }

    ProfileService.approveRejectContact(data.id, requestBody)
      .then((res) => {
        console.log(res);
        setSentNotifications(
          sentNotifications.map((el) => {
            if (data.id === el.id) {
              if (flag === "approve") {
                return { ...el, status: 2 };
              } else {
                return { ...el, status: 3 };
              }
            }
            return el;
          })
        );
        toast.success(
          flag === "reject" ? "მოთხოვნა უარყოფილია" : "მოთხოვნა მიღებულია",
          {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          }
        );
      })
      .catch((err) => {
        console.log(err);
        if (err?.response?.data?.message === "Unauthorized") {
          checkAuth();
        }
      });
  };

  return (
    <>
      {sentNotifications?.map((el, i) => {
        return (
          <div key={i} className="">
            <ToastContainer />
            <NotificationsCard
              type="receive"
              text={
                el.status === 1
                  ? `${el.sender_firstname} ${el.sender_lastname} - ს უნდა თქვენი კონტაქტების ნახვა`
                  : el.status === 2
                  ? `თვენ უფლება მიეცით ${el.sender_firstname} ${el.sender_lastname} - ს ნახოს თქვენი კონტაქტი`
                  : `თვენ უარი თქვით ${el.sender_firstname} ${el.sender_lastname} - მა ნახოს თქვენი კონტაქტი`
              }
              id={el.sender_id}
            >
              {el.status === 1 ? (
                <>
                  {" "}
                  <Button
                    onClick={() => answerAllowRequest(el, "reject")}
                    className="btn btn-light w-50  mr-3"
                  >
                    უარყოფა
                  </Button>
                  <Button
                    onClick={() => answerAllowRequest(el, "approve")}
                    className="btn btn-primary w-50"
                  >
                    დაშვება
                  </Button>
                </>
              ) : el.status === 2 ? (
                <Button className="btn btn-primary w-100">
                  მომხმარებელი დაშვებულია
                </Button>
              ) : (
                <Button className="btn btn-danger w-100">
                  მომხმარებელი უარყოფილია
                </Button>
              )}
            </NotificationsCard>
          </div>
        );
      })}
    </>
  );
};

export default ReceiveNotification;

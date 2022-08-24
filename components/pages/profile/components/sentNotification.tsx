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
import { useRouter } from "next/router";
import { useCheckUnAuthResponse } from "../../../hooks/useCheckUnauthRespnse";

const SentNotification = () => {
  const [sentNotifications, setSentNotifications] = useState<
    INotificationSent[] | null
  >(null);

  const router = useRouter();
  const checkUnAuth = useCheckUnAuthResponse();

  useEffect(() => {
    ProfileService.getSentNotifications()
      .then((res) => {
        console.log(res);
        setSentNotifications(res.data);
      })
      .catch((err) => {
        console.log(err);
        if (err?.response?.data?.message === "Unauthorized") {
          checkUnAuth();
        }
      });
  }, []);

  const handleRemoveRequest = (id: number) => {
    ProfileService.deleteContactRequest(id)
      .then((res) => {
        console.log();
        toast.success("მოთხოვნა გაუქმდა", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setSentNotifications(
          sentNotifications.filter((el) => el.receiver_id !== id)
        );
      })
      .catch((err) => {
        console.log(err);
        if (err?.response?.data?.message === "Unauthorized") {
          checkUnAuth();
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
              text={
                el.status === 1
                  ? `თქვენ გაგზავნილი გაქვთ ${el.receiver_firstname} ${el.receiver_lastname} - სთან კონტაქტების ნახვის მოთხოვნა`
                  : el.status === 2
                  ? `${el.receiver_firstname} ${el.receiver_lastname} - დაეთანხმა თქვენ მოთხოვნას `
                  : el.status === 3
                  ? `${el.receiver_firstname} ${el.receiver_lastname} - მ უარყო თქვენი მოთხოვნას `
                  : null
              }
              id={el.receiver_id}
            >
              {el.status === 1 ? (
                <Button
                  onClick={() => handleRemoveRequest(el.receiver_id)}
                  className="btn btn-light w-100"
                >
                  მოთხოვნის გაუქმება
                </Button>
              ) : el.status === 2 ? (
                <Button
                  onClick={() => {
                    router.push("/user/" + el.receiver_id);
                  }}
                  className="btn btn-success w-100"
                >
                  პროფილის ნახვა
                </Button>
              ) : el.status === 3 ? (
                <Button
                  onClick={() => {
                    router.push("/user/" + el.receiver_id);
                  }}
                  // onClick={() => handleRemoveRequest(el.receiver_id)}
                  className="btn btn-danger w-100"
                >
                  პროფილის ნახვა
                </Button>
              ) : null}
            </NotificationsCard>
          </div>
        );
      })}
    </>
  );
};

export default SentNotification;

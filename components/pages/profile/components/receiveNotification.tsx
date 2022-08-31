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
import useTranslation from "next-translate/useTranslation";

const ReceiveNotification = () => {
  const [sentNotifications, setSentNotifications] = useState<
    INotificationReceiver[] | null
  >(null);

  let { t } = useTranslation("common");

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
          flag === "reject" ? t("requestRejected") : t("requestApproved"),
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
              img={el.sender_profile_imagee}
              text={
                el.status === 1
                  ? t("needSeeYourProfile", {
                      name: el.sender_firstname,
                      lastname: el.sender_lastname,
                    })
                  : el.status === 2
                  ? t("youApproveuserToSee", {
                      name: el.sender_firstname,
                      lastname: el.sender_lastname,
                    })
                  : t("youRejectuserToSee", {
                      name: el.sender_firstname,
                      lastname: el.sender_lastname,
                    })
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
                    {t("reject")}
                  </Button>
                  <Button
                    onClick={() => answerAllowRequest(el, "approve")}
                    className="btn btn-primary w-50"
                  >
                    {t("approve")}
                  </Button>
                </>
              ) : el.status === 2 ? (
                <Button className="btn btn-primary w-100">
                  {t("approveUser")}
                </Button>
              ) : (
                <Button className="btn btn-danger w-100">
                  {t("rejectUser")}
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

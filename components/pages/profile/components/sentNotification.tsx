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
import useTranslation from "next-translate/useTranslation";

const SentNotification = () => {
  const [sentNotifications, setSentNotifications] = useState<
    INotificationSent[] | null
  >(null);

  let { t } = useTranslation("common");

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
        toast.success(t("requestCacneled"), {
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
                el.status === 1 ? (
                  t("haveTosentQequest", {
                    name: el.receiver_firstname,
                    lastname: el.receiver_lastname,
                  })
                ) : el.status === 2 ? (
                  <>
                    {t("approvedYouRequest", {
                      name: el.receiver_firstname,
                      lastname: el.receiver_lastname,
                    })}
                    <div>
                      {t("approvedYouRequest2")}
                      <br />
                      <br />
                      {t("approvedYouRequest3")}

                      <br />
                      {t("approvedYouRequest4")}

                      <br />
                      {t("approvedYouRequest5")}
                    </div>
                  </>
                ) : el.status === 3 ? (
                  t("rejectedYouRequest", {
                    name: el.receiver_firstname,
                    lastname: el.receiver_lastname,
                  })
                ) : null
              }
              id={el.receiver_id}
            >
              {el.status === 1 ? (
                <Button
                  onClick={() => handleRemoveRequest(el.receiver_id)}
                  className="btn btn-light w-100"
                >
                  {t("cancelRequest")}
                </Button>
              ) : el.status === 2 ? (
                <Button
                  onClick={() => {
                    router.push("/user/" + el.receiver_id);
                  }}
                  className="btn btn-success w-100"
                >
                  {t("seeProfile")}
                </Button>
              ) : el.status === 3 ? (
                <Button
                  onClick={() => {
                    router.push("/user/" + el.receiver_id);
                  }}
                  // onClick={() => handleRemoveRequest(el.receiver_id)}
                  className="btn btn-danger w-100"
                >
                  {t("seeProfile")}
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

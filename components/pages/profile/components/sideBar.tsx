/* eslint-disable */
import React, { useEffect, useMemo, useRef, useState } from "react";
import classnames from "classnames";
import Link from "next/link";
import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";
import { ToastContainer, toast } from "react-toastify";

import { Button, FormGroup } from "../../../common/form";
import { ProfileService } from "../../../../services/profile/profile.http";
import { useTypedSelector } from "../../../hooks/useTypeSelector";
import { setCurrentUser } from "../../../../redux/action-creators/index";
import { useDispatch } from "react-redux";
import { AlertIcon } from "../../../svg/statusIcon";
import { useCheckUnAuthResponse } from "../../../hooks/useCheckUnauthRespnse";
import classNames from "classnames";
import Sms from "../../../../public/newImages/sms-edit.svg";
import Image from "next/image";
import { checkConversationExistence } from "../../../utils/conversationUtils";
import ConversationWindow from "../../../conversationComponents/ConversationWindow";

interface ISidebar {
  firstname: string;
  lastname: string;
  about_me: string;
  phone: string | null;
  social_network: any;
  signOut?: () => void;
  myProfile?: boolean;
  profile_image?: string;
  callingCode?: string;
  is_locked_communication?: boolean;
  isSentRequest?: number;
  id?: number;
}

const SideBar: React.FC<ISidebar> = (props) => {
  const router = useRouter();
  const [status, setStatus] = useState<"load" | boolean>(false);
  const [reportModal, setReportModal] = useState<"load" | boolean>(false);
  const [reports, setReports] = useState([]);
  const dispatch = useDispatch();
  const [image, setImage] = useState("");
  let { t } = useTranslation("common");
  const [selectedValue, setSelectedValue] = useState<any>(); // State variable to store the selected value
  const [loadReports, setLoadReports] = useState(false);
  const [reportTextarea, setReportTextarea] = useState(null);
  const [reportText, setReportText] = useState("");

  const handleRadioChange = (data) => {
    setSelectedValue(data); // Update the selected value when a radio button is clicked
  };

  useEffect(() => {
    if (selectedValue?.id == 5) {
      setReportTextarea(true);
    } else {
      setReportTextarea(false);
    }
  }, [selectedValue]);

  const fileRef: any = useRef();

  const { user } = useTypedSelector((state) => state.profile);
  const checkAuth = useCheckUnAuthResponse();

  const userContactRequest = () => {
    setStatus("load");
    ProfileService.addContactRequest(Number(router.query.userId))
      .then((res) => {
        setStatus(true);
      })
      .catch((err) => {
        console.log({ err });
        setStatus(false);
        if (err?.response?.data?.message === "Unauthorized") {
          checkAuth();
        }
      });
  };

  const handleChangeProfileLock = () => {
    ProfileService.updateLockCommunication(!user?.is_locked_communication)
      .then((res) => {
        let newUSer = {
          ...user,
          is_locked_communication: !user.is_locked_communication,
        };
        dispatch(setCurrentUser({ user: newUSer }));
      })
      .catch((err) => {
        console.log(err);
        if (err?.response?.data?.message === "Unauthorized") {
          checkAuth();
        }
      });
  };

  useEffect(() => {
    ProfileService.getReports({ lang: router.locale })
      .then((res) => {
        setReports(res.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [router.locale]);

  const handleChangeAvailable = () => {
    ProfileService.updateAvailable(!user?.available)
      .then((res) => {
        let newUSer = {
          ...user,
          available: !user.available,
        };
        dispatch(setCurrentUser({ user: newUSer }));
      })
      .catch((err) => {
        if (err?.response?.data?.message === "Unauthorized") {
          checkAuth();
        }
      });
  };

  const reportUser = () => {
    setLoadReports(true);

    ProfileService.postReports({
      userId: props.id,
      reportId: selectedValue?.id,
      text: selectedValue?.id == 5 ? reportText : "",
    })
      .then((res) => {
        toast.success(t("reportDone"), {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setReportModal(false);
      })
      .catch((err) => {
        const errorText = err?.response?.data?.isAlreadyReported
          ? t("alreadyReported")
          : "error :/";
        toast.error(errorText, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      })
      .finally(() => {
        setLoadReports(false);
      });
  };

  const sendStatus = useMemo(() => {
    if (props.isSentRequest === 3) {
      return "REJECTED";
    }

    if (props.isSentRequest === 1 || status === true) {
      return "SENT";
    }

    return "NOT_SENT";
  }, [props.isSentRequest, status]);

  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState(null);

  const handleOpenChatWindow = async () => {
    const conversation = await checkConversationExistence(String(props.id));

    if (conversation) {
      router.push(`/conversation?id=${conversation.id}`, undefined, {
        shallow: true,
      });
    } else {
      setIsOpen(true);
      setName(props.firstname);
    }
  };

  return (
    <>
      {isOpen ? (
        <ConversationWindow
          setIsOpen={setIsOpen}
          name={name}
          participantId={String(props.id)}
        />
      ) : null}
      <ToastContainer />

      {reportModal && (
        <div className="reportModal">
          <div className=" reportModal-header text-right d-flex align-items-center justify-between w-100 ">
            <div>{t("reportReason")}</div>

            <img
              className="pointer"
              onClick={() => {
                setReportModal(false);
              }}
              src="https://t3.ftcdn.net/jpg/00/69/37/26/360_F_69372697_LSptpUKLbHwJSeCdBZ2uINqCQkg34oBF.jpg"
            />
          </div>
          <div className="reportModal-reason pl-4">
            {reports.map((el, i) => {
              return (
                <label key={i} className="d-flex align-items-center">
                  <input
                    style={{
                      minWidth: "15px",
                      minHeight: " 15px",
                    }}
                    type="radio"
                    value={el.title}
                    checked={selectedValue?.id === el.id} // Compare the selected value with the current radio button's value
                    onChange={() => handleRadioChange(el)}
                  />{" "}
                  <span> {el.title} </span>
                </label>
              );
            })}
            <br />

            {reportTextarea && (
              <FormGroup>
                <textarea
                  value={reportText}
                  onChange={(e) => setReportText(e.target.value)}
                  placeholder={t("WriteLetter")}
                  className={classnames("form-control textarea")}
                ></textarea>
              </FormGroup>
            )}

            <br />
            <br />
            <Button
              loading={loadReports}
              disabled={loadReports}
              style={{
                backgroundColor: "#f9c745 ",
                maxWidth: "260px",
              }}
              onClick={() => {
                reportUser();
              }}
              className="btn btn-primary btn_profile mb-4 w-100"
            >
              {t("reportBtn")}
            </Button>
          </div>
        </div>
      )}
      <div className="profile_sideBar">
        <div className="profile_userHeading">
          {props.myProfile ? (
            <span
              onClick={() => {
                fileRef?.current?.click();
              }}
              className="imgUploadWrapper pointer"
            >
              <img className="cameraIcon" src="/imgs/camera.png" />
              {props.myProfile ? (
                <img
                  src={
                    user?.profile_image
                      ? user?.profile_image
                      : "https://www.portmelbournefc.com.au/wp-content/uploads/2022/03/avatar-1.jpeg"
                  }
                />
              ) : (
                props.profile_image && (
                  <img className="pointer" src={props.profile_image} />
                )
              )}
              <input
                onChange={(e) => {
                  setImage(URL.createObjectURL(e.target.files[0]));

                  const toBase64 = (file) =>
                    new Promise((resolve, reject) => {
                      const reader = new FileReader();
                      reader.readAsDataURL(file);
                      reader.onload = () => resolve(reader.result);
                      reader.onerror = (error) => reject(error);
                    });

                  async function Main() {
                    const file = e.target.files[0];
                    let fileString = await toBase64(file);
                    ProfileService.uploadImage({
                      base64: fileString,
                    })
                      .then((res) => {
                        let newUSer = {
                          ...user,
                          profile_image: res.data.profileImage,
                        };
                        dispatch(
                          setCurrentUser({
                            user: newUSer,
                          })
                        );
                      })
                      .catch((err) => {
                        console.log(err);
                      });
                  }

                  Main();
                }}
                className="d-none"
                ref={fileRef}
                type="file"
              />
            </span>
          ) : (
            <span className="imgUploadWrapper pointer">
              <img
                src={
                  props?.profile_image
                    ? props?.profile_image
                    : "https://www.portmelbournefc.com.au/wp-content/uploads/2022/03/avatar-1.jpeg"
                }
              />
            </span>
          )}
          <span
            style={{
              display: "inline-block",
              maxWidth: "136px",
            }}
          >
            {props?.firstname} {props?.lastname}
          </span>
        </div>

        <>
          {props.myProfile ? (
            <div className="contactViewSwitch flex-column mt-3">
              {props.myProfile ? (
                <div className="contactViewSwitch flex-column mb-2">
                  <div className="form-check form-switch ">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={user?.available}
                      role="switch"
                      onChange={() => {
                        handleChangeAvailable();
                      }}
                      id="SearchingRoomateSwitch"
                    />
                    <label className="form-check-label flex">
                      {t("findRoomate")}

                      <span className="pointer toltipWrapper ml-3 ">
                        <AlertIcon stroke="blue" fill="blue" />
                        <p className="contact_view_tooltip">
                          {t("findRoomateHint")}
                        </p>
                      </span>
                    </label>
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}
        </>

        {!router.pathname.split("/").includes("profile") && (
          <button
            onClick={handleOpenChatWindow}
            className="w-full mt-4 py-2 px-2 bg-[#0A7CFF] rounded-md  flex flex-row items-center justify-center"
          >
            <Image src={Sms} width={16} height={16} alt="sms" />
            <span className="ml-1 text-white text-base">Message</span>
          </button>
        )}
        {!props.myProfile && props.phone && (
          <Button
            loading={status === "load"}
            disabled={!!status}
            style={{
              backgroundColor: "#f9c745 ",
            }}
            onClick={() => {
              setReportModal(true);
            }}
            className="btn btn-primary btn_profile mb-4 w-100"
          >
            {t("reportBtn")}
          </Button>
        )}
        <div className="profile_menu">
          {props.myProfile ? (
            <ul className="list-unstyled">
              <li>
                <Link href="/profile/favorites">
                  <a
                    className={classnames({
                      active:
                        router.pathname.split("/")[2] === "favorites" ||
                        router.pathname.split("/")[2] === "flats",
                    })}
                  >
                    <svg
                      width="16"
                      height="19"
                      viewBox="0 0 16 19"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12.0714 4.53333C12.0714 6.75721 10.2528 8.56667 8 8.56667C5.74719 8.56667 3.92857 6.75721 3.92857 4.53333C3.92857 2.30945 5.74719 0.5 8 0.5C10.2528 0.5 12.0714 2.30945 12.0714 4.53333ZM8 11.2667C8.96368 11.2667 9.8809 11.0617 10.71 10.7H11.2C13.5778 10.7 15.5 12.6122 15.5 14.96V16.4333C15.5 17.0918 14.96 17.6333 14.2857 17.6333H1.71429C1.04005 17.6333 0.5 17.0918 0.5 16.4333V14.96C0.5 12.6122 2.42219 10.7 4.8 10.7H5.29042C6.12177 11.0615 7.03566 11.2667 8 11.2667Z"
                        stroke="#5E666E"
                      />
                    </svg>
                    {/* ჩემი გვერდი */}
                    {t("myProfile")}
                  </a>
                </Link>
              </li>

              <li>
                <Link href="/profile/edit">
                  <a
                    className={classnames({
                      active:
                        router.pathname.split("/")[2] === "edit" ||
                        router.pathname.split("/")[2] === "resetpassword",
                    })}
                  >
                    <svg
                      width="16"
                      height="17"
                      viewBox="0 0 16 17"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M13.6237 9.24274L13.5903 9.52086L13.8101 9.69457L15.4674 11.0045L13.8972 13.7228L11.9306 12.9322L11.6682 12.8267L11.4425 12.9973C11.0495 13.2945 10.6241 13.5488 10.1665 13.7355L9.90065 13.844L9.86042 14.1284L9.56319 16.2288H6.42652L6.1293 14.1284L6.08906 13.844L5.82318 13.7355C5.36416 13.5481 4.94953 13.3038 4.54865 12.9984L4.32269 12.8262L4.05913 12.9322L2.09247 13.7228L0.522564 11.0049L2.19792 9.69636L2.43049 9.51471L2.38386 9.22331C2.34724 8.99441 2.32843 8.74323 2.32843 8.5C2.32843 8.26845 2.35537 8.01905 2.39415 7.7767L2.44077 7.4853L2.20821 7.30365L0.53285 5.99509L2.10276 3.27719L4.06941 4.06781L4.33185 4.17331L4.55747 4.00272C4.95052 3.70553 5.37595 3.45125 5.83347 3.26451L6.09935 3.15599L6.13958 2.87164L6.43681 0.77124H9.57348L9.8707 2.87164L9.91094 3.15599L10.1768 3.26451C10.6358 3.45186 11.0505 3.69617 11.4514 4.00161L11.6773 4.17376L11.9409 4.06781L13.9075 3.27719L15.4774 5.99509L13.8021 7.30365L13.5695 7.4853L13.6161 7.7767C13.6528 8.00606 13.6716 8.247 13.6716 8.5C13.6716 8.75313 13.6528 9.00008 13.6237 9.24274ZM4.41421 8.5C4.41421 10.4733 6.02668 12.0858 8 12.0858C9.97332 12.0858 11.5858 10.4733 11.5858 8.5C11.5858 6.52668 9.97332 4.91422 8 4.91422C6.02668 4.91422 4.41421 6.52668 4.41421 8.5Z"
                        stroke="#5E666E"
                      />
                    </svg>
                    {t("editProfile")}
                  </a>
                </Link>
              </li>
              <li>
                <a href="#" onClick={() => props?.signOut()}>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10 2L12.6667 2C13.0203 2 13.3594 2.14047 13.6095 2.39052C13.8595 2.64057 14 2.97971 14 3.33333L14 12.6667C14 13.0203 13.8595 13.3594 13.6095 13.6095C13.3594 13.8595 13.0203 14 12.6667 14L10 14"
                      stroke="#5E666E"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M5.33325 4.66665L1.99992 7.99998L5.33325 11.3333"
                      stroke="#5E666E"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M2 8L10 8"
                      stroke="#5E666E"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {t("logout")}
                </a>
              </li>
            </ul>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default SideBar;

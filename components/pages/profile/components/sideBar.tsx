import React, { useRef, useState } from "react";
import classnames from "classnames";
import Link from "next/link";
import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";

import { Button } from "../../../common/form";
import { ProfileService } from "../../../../services/profile/profile.http";
import { useTypedSelector } from "../../../hooks/useTypeSelector";
import { setCurrentUser } from "../../../../redux/action-creators/index";
import { useDispatch } from "react-redux";
import { AlertIcon } from "../../../svg/statusIcon";
import { useCheckUnAuthResponse } from "../../../hooks/useCheckUnauthRespnse";
import Fb from "../../../common/fbauth";

interface ISidebar {
  firstname: string;
  lastname: string;
  about_me: string;
  phone: string | null;
  social_network: any;
  signOut?: () => void;
  myProfile?: boolean;
  profile_image?: string;
  is_locked_communication?: boolean;
  isSentRequest?: boolean;
}

const SideBar: React.FC<ISidebar> = (props) => {
  console.log(props, "propspropsprops");
  const router = useRouter();
  const [status, setStatus] = useState<"load" | boolean>(false);
  const dispatch = useDispatch();
  const [image, setImage] = useState("");
  let { t } = useTranslation("common");

  const fileRef: any = useRef();

  const { user } = useTypedSelector((state) => state.profile);
  const checkAuth = useCheckUnAuthResponse();

  const userContactRequest = () => {
    setStatus("load");
    ProfileService.addContactRequest(Number(router.query.userId))
      .then((res) => {
        console.log(res);
        setStatus(true);
      })
      .catch((err) => {
        setStatus(false);

        console.log(err);
        if (err?.response?.data?.message === "Unauthorized") {
          checkAuth();
        }
      });
  };

  const toggleCommunication = () => {
    // ProfileService.updateLockCommunication(user.)
  };

  const handleChangeProfileLock = () => {
    ProfileService.updateLockCommunication(!user?.is_locked_communication)
      .then((res) => {
        // console.log(res);
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

  const handleChangeAvailable = () => {
    ProfileService.updateAvailable(!user?.available)
      .then((res) => {
        // console.log(res);
        let newUSer = {
          ...user,
          available: !user.available,
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
  return (
    <div className="profile_sideBar">
      <div className="profile_userHeading">
        {props.myProfile ? (
          <span
            onClick={() => {
              fileRef?.current?.click();
            }}
            // className="pointer"
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
                      // console.log(res);
                      let newUSer = {
                        ...user,
                        profile_image: res.data.profileImage,
                      };
                      dispatch(setCurrentUser({ user: newUSer }));
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
          <span
            // onClick={() => {
            //   fileRef?.current?.click();
            // }}
            // className="pointer"
            className="imgUploadWrapper pointer"
          >
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

      <div className="profile_aboutMe">
        <div>{t("aboutMe")} </div>
        <p>{props?.about_me}</p>
      </div>

      {!props.myProfile && !props.phone ? (
        <div className="profile_contacts">
          <p className="text-center">{t("seandContactRequest")}</p>
          <Button
            loading={status === "load"}
            disabled={!!status}
            onClick={userContactRequest}
            className="btn btn-primary mb-4 w-100"
          >
            {status || props.isSentRequest
              ? t("sentContactRequest")
              : t("contactRequest")}
          </Button>
        </div>
      ) : (
        <>
          {props.myProfile ? (
            <div className="contactViewSwitch flex-column mt-3">
              <div className="contactViewSwitch flex-column">
                <div className=" form-check form-switch ">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={!user?.is_locked_communication}
                    role="switch"
                    onChange={() => {
                      handleChangeProfileLock();
                    }}
                    id="flexSwitchCheckDefault"
                  />
                  <label
                    className="form-check-label"
                    htmlFor="flexSwitchCheckDefault"
                  >
                    {/* კონტაqტის ხილვადობა{" "} */}
                    {t("contactVisibility")}
                    <span className="pointer toltipWrapper ml-3">
                      <AlertIcon stroke="blue" fill="blue" />
                      <p>{t("contactVisibilityHint")}</p>
                    </span>
                  </label>
                </div>
              </div>

              {props.myProfile ? (
                <div className="contactViewSwitch flex-column">
                  <div className="form-check form-switch ">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={user?.available}
                      role="switch"
                      onChange={() => {
                        handleChangeAvailable();
                      }}
                      id="flexSwitchCheckDefault"
                    />
                    <label
                      className="form-check-label"
                      htmlFor="flexSwitchCheckDefault"
                    >
                      {/* კონტაqტის ხილვადობა{" "} */}
                      {t("findRoomate")}

                      <span className="pointer toltipWrapper ml-3">
                        <AlertIcon stroke="blue" fill="blue" />
                        <p>{t("findRoomateHint")}</p>
                      </span>
                    </label>
                  </div>
                </div>
              ) : null}
              {!user?.socials?.length ? (
                <Fb>{t("connect")}</Fb>
              ) : (
                <p>{t("connected")}</p>
              )}
            </div>
          ) : null}

          <div className="profile_contacts">
            <div>
              <svg
                width="17"
                height="17"
                viewBox="0 0 17 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3.34333 1.88889C3.4 2.72944 3.54167 3.55111 3.76833 4.335L2.635 5.46833C2.24778 4.335 2.00222 3.13556 1.91722 1.88889H3.34333ZM12.6556 13.2411C13.4583 13.4678 14.28 13.6094 15.1111 13.6661V15.0733C13.8644 14.9883 12.665 14.7428 11.5222 14.365L12.6556 13.2411ZM4.25 0H0.944444C0.425 0 0 0.425 0 0.944444C0 9.81278 7.18722 17 16.0556 17C16.575 17 17 16.575 17 16.0556V12.7594C17 12.24 16.575 11.815 16.0556 11.815C14.8844 11.815 13.7417 11.6261 12.6839 11.2767C12.5894 11.2389 12.4856 11.2294 12.3911 11.2294C12.1456 11.2294 11.9094 11.3239 11.7206 11.5033L9.64278 13.5811C6.97 12.2117 4.77889 10.03 3.41889 7.35722L5.49667 5.27944C5.76111 5.015 5.83667 4.64667 5.73278 4.31611C5.38333 3.25833 5.19444 2.125 5.19444 0.944444C5.19444 0.425 4.76944 0 4.25 0Z"
                  fill="#5E666E"
                />
              </svg>
              {props?.phone}
            </div>
            {props?.social_network ? (
              <div>
                <a
                  href={props?.social_network}
                  rel="noreferrer"
                  target="_blank"
                >
                  <svg
                    width="8"
                    height="17"
                    viewBox="0 0 8 17"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1.79631 17H5.21133V8.42146H7.59502L7.85456 5.55284H5.21133V3.92045C5.21133 3.23745 5.3411 2.9779 5.99678 2.9779H7.85456V0H5.4777C2.93009 0 1.78264 1.12013 1.78264 3.26476V5.55966H0V8.46243H1.78264L1.79631 17Z"
                      fill="#5E666E"
                    />
                  </svg>
                  {props?.firstname} {props?.lastname}
                </a>
              </div>
            ) : (
              ""
            )}
          </div>
        </>
      )}
      <div className="profile_menu">
        {props.myProfile ? (
          <ul className="list-unstyled">
            <li>
              <Link href="/profile">
                <a
                  className={classnames({
                    active: "/profile" === router.asPath,
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
                    active: "/profile/edit" === router.asPath,
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
              <Link href="/profile/balance">
                <a
                  className={classnames("statusLink", {
                    active: "/profile/balance" === router.asPath,
                  })}
                >
                  <span>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_285_65)">
                        <path
                          d="M-6.10352e-05 8.00045C-6.10352e-05 3.59188 3.59315 -0.00178058 8.0035 6.61885e-07C12.4139 0.0017819 16.0031 3.59633 15.9995 8.00757C15.9959 12.4188 12.3974 16.0071 7.98792 16C3.57846 15.9929 -6.10352e-05 12.4023 -6.10352e-05 8.00045ZM14.9352 8.00579C14.9368 7.09559 14.759 6.194 14.4119 5.35256C14.0648 4.51112 13.5553 3.74633 12.9125 3.10191C12.2697 2.4575 11.5062 1.94609 10.6657 1.59692C9.82509 1.24775 8.92395 1.06766 8.01374 1.06696C4.18051 1.05538 1.0669 4.1592 1.0669 7.99688C1.06567 8.90702 1.24375 9.80849 1.59097 10.6498C1.93818 11.4911 2.44774 12.2558 3.09052 12.9001C3.7333 13.5445 4.49671 14.0559 5.33717 14.4052C6.17763 14.7544 7.07867 14.9347 7.98881 14.9357C11.8212 14.9468 14.9308 11.8453 14.9352 8.00579Z"
                          fill="#5E666E"
                        />
                        <path
                          d="M7.25127 12.6111C6.66805 12.4859 6.15061 12.278 5.72213 11.8892C5.2429 11.4546 5.01425 10.9086 5.00422 10.2692C4.99733 9.83907 5.30555 9.50532 5.71211 9.48779C5.81176 9.47997 5.91195 9.49272 6.00647 9.52524C6.10099 9.55776 6.18782 9.60936 6.26155 9.67683C6.33527 9.7443 6.39433 9.82621 6.43506 9.91745C6.47578 10.0087 6.4973 10.1073 6.49828 10.2073C6.51457 10.5905 6.71442 10.8391 7.04393 10.9837C7.68478 11.2655 8.33815 11.2711 8.97336 10.9768C9.60858 10.6825 9.72948 9.80213 9.17571 9.38197C8.83053 9.12023 8.40268 8.95241 7.99173 8.79399C7.31642 8.5335 6.6098 8.35003 6.01843 7.90169C5.18213 7.26863 4.7812 6.01127 5.12073 5.02129C5.40389 4.19474 6.03973 3.75266 6.83469 3.49593C6.96687 3.45335 7.10218 3.42141 7.25127 3.38071C7.25127 3.17407 7.24751 2.97182 7.25127 2.77019C7.26067 2.33187 7.58455 2.00063 7.99988 2C8.41522 1.99937 8.74097 2.32686 8.75162 2.76581C8.756 2.96806 8.75162 3.17095 8.75162 3.36318C9.03915 3.46274 9.3198 3.53475 9.57852 3.65435C10.4593 4.06199 10.9811 4.72824 10.9993 5.72824C11.0029 5.82607 10.9871 5.92365 10.9527 6.01534C10.9184 6.10703 10.8662 6.19102 10.7993 6.26245C10.7323 6.33388 10.6518 6.39135 10.5625 6.43153C10.4732 6.47171 10.3768 6.49381 10.2789 6.49655C10.1809 6.50134 10.083 6.48656 9.99083 6.45309C9.89866 6.41962 9.81409 6.36812 9.74206 6.3016C9.67003 6.23508 9.61198 6.15487 9.57132 6.06568C9.53065 5.97648 9.50818 5.88007 9.50522 5.78209C9.48893 5.4402 9.32981 5.19599 9.03789 5.05323C8.34191 4.71384 7.6309 4.70445 6.94557 5.06951C6.38491 5.36819 6.31349 6.22229 6.83406 6.62116C7.13601 6.85347 7.50937 7.00063 7.86644 7.15028C8.28992 7.32749 8.73782 7.44708 9.1613 7.62492C10.3847 8.13838 11.0243 9.07388 10.9993 10.2937C10.9818 11.1578 10.5733 11.8009 9.82722 12.2135C9.50335 12.3926 9.14189 12.5034 8.75224 12.6637C8.75224 12.8103 8.75224 13.0113 8.75224 13.2116C8.74661 13.6738 8.43901 13.9994 8.00488 14C7.57076 14.0006 7.25942 13.6738 7.25315 13.2141C7.24877 13.0188 7.25127 12.824 7.25127 12.6111Z"
                          fill="#5E666E"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_285_65">
                          <rect width="16" height="16" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                    {t("status")}
                  </span>

                  {!user?.payed ? (
                    <span className="btn  payStatus">
                      {t("inactive")}

                      <AlertIcon stroke="#db0505" fill="#db0505" />
                    </span>
                  ) : (
                    <span className="btn btn-success  ">{t("active")}</span>
                  )}
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
  );
};

export default SideBar;

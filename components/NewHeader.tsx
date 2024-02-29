import Image from "next/image";
import React from "react";
import Logo from "../public/newImages/logo.svg";
import Bell from "../public/newImages/bell.svg";
import UserIcon from "../public/newImages/user-icon.svg";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { useTypedSelector } from "./hooks/useTypeSelector";
import BurgerMenu from "./BurgerMenu";
import { useCheckAuth } from "./hooks/useCheckAuth";
import LangChoose from "./LangChoose";

export default function NewHeader() {
  useCheckAuth(false);

  let { t } = useTranslation("common") as { t: (key: string) => string };
  const router = useRouter();
  const { user } = useTypedSelector((state) => state.profile);

  const handleLinkClick = (e, href) => {
    if (router.pathname === "/signup") {
      e.preventDefault();
      const leave = window.confirm(
        t("leavePageQuestion") + "\n" + t("leavingPageAlert")
      );
      if (leave) {
        router.push(href);
      }
    } else {
      router.push(href);
    }
  };

  return (
    <main className="bg-mainBg flex flex-row px-5 py-3 items-center justify-between sm:px-16 md:px-20 md:py-3 xl:px-24 xl:py-6 md:bg-[#fff] shadow-md">
      <div
        id="logoIcon"
        className="w-32 h-6 xl:w-52 xl:h-10 relative"
        onClick={(e) => {
          handleLinkClick(e, "/");
        }}
      >
        <Image
          src={Logo}
          alt="Page logo"
          layout="fill"
          objectFit="cover"
          className="pointer"
        />
      </div>
      <div id="headerContent" className="flex flex-row items-center">
        <span
          className="hidden md:block md:text-xs xl:text-base mr-4 pointer"
          onClick={(e) => {
            const href = user ? "/search" : "/signup";
            router.push(href);
          }}
        >
          {t("roommateFind")}
        </span>

        <span
          className="hidden md:block md:text-xs xl:text-base mr-4 pointer"
          onClick={(e) => handleLinkClick(e, "/houseSearch")}
        >
          {t("rentApartment")}
        </span>
        <div
          className="bg-[#cff1e6] p-2 mr-2 flex items-center rounded-lg xl:px-3 xl:py-2 xl:mr-4 pointer"
          onClick={(e) => {
            const href = user ? "/profile" : "login";
            handleLinkClick(e, href);
          }}
        >
          <div className="w-3 h-3 xl:w-5 xl:h-5 relative pointer">
            <Image
              src={UserIcon}
              alt="UserIcon"
              layout="fill"
              objectFit="cover"
            />
          </div>
          <span className="ml-2 text-xs xl:text-base xl:mr-3">
            {user?.firstname ? user.firstname : t("auth")}
          </span>
        </div>

        <LangChoose
          className="bg-[#f2f5ff] rounded-lg p-2 text-xs pointer md:mr-4 lg:text-base lg:p-2"
          spanClassname="text-xs xl:text-base"
        />
        <div
          id="bell"
          className="hidden relative lg:block lg:bg-[#f2f5ff]  rounded-lg px-2 pb-1 pt-2 md:px-3 lg:mr-4 pointer"
          onClick={(e) => {
            const href = user ? "/profile" : "login";
            handleLinkClick(e, href);
          }}
        >
          <Image src={Bell} alt="Bell Icon" />
          {!!user?.notifications?.length && (
            <div className="absolute flex items-center justify-center font-semibold  -top-3 -right-3 rounded-full text-white text-xs bg-primaryBeta  w-7 h-7">
              {user.notifications.length}
            </div>
          )}
        </div>
        <div className="block ml-2 md:hidden">
          <BurgerMenu />
        </div>
      </div>
    </main>
  );
}

import Image from "next/image";
import React, { useEffect, useMemo } from "react";
import Logo from "../public/newImages/logo.svg";
import MobileLogo from "../public/newImages/mobile-header-logo.svg";
import Bell from "../public/newImages/bell.svg";
import UserIcon from "../public/newImages/user-icon.svg";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { useTypedSelector } from "./hooks/useTypeSelector";
import BurgerMenu from "./BurgerMenu";
import { useCheckAuth } from "./hooks/useCheckAuth";
import LangChoose from "./LangChoose";
import Messanger from "../public/newImages/messanger.svg";
import { useLazyQuery } from "@apollo/client";
import { getConversationsForUserQuery } from "../gql/graphqlStatements";
import { LIMIT, OFFSET } from "../constants/pagination";
export default function NewHeader() {
  useCheckAuth(false);

  let { t } = useTranslation("common") as { t: (key: string) => string };
  const router = useRouter();
  const { user } = useTypedSelector((state) => state.profile);

  const [getConversationsForUser, { data }] = useLazyQuery(
    getConversationsForUserQuery,
    {
      variables: {
        pagination: {
          limit: LIMIT,
          offset: OFFSET,
        },
      },
      fetchPolicy: "cache-only",
    }
  );

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

  useEffect(() => {
    if (user) {
      getConversationsForUser();
    }
  }, [user]);

  const unreadMessagesCount = useMemo(() => {
    if (data?.getConversationsForUser?.list?.length) {
      return data?.getConversationsForUser?.list.reduce((acc, conversation) => {
        const sum = conversation.unreadMessagesCount + acc;
        return sum;
      }, 0);
    }

    return 0;
  }, [data]);

  return (
    <header className="bg-mainBg  w-full flex flex-row px-6 py-3 items-center justify-between sm:px-16 md:px-20 md:py-3 xl:px-24 xl:py-6 md:bg-[#fff] shadow-md">
      <div
        id="logoIcon"
        className="pointer hidden xl:flex items-center"
        onClick={(e) => {
          handleLinkClick(e, "/");
        }}
      >
        <Image
          src={Logo}
          alt="Page logo"
          width={199}
          height={40}
          layout="fixed"
          onClick={(e) => {
            handleLinkClick(e, "/");
          }}
        />
      </div>
      <div
        id="logoIcon"
        className="pointer xl:hidden  flex items-center"
        onClick={(e) => {
          handleLinkClick(e, "/");
        }}
      >
        <Image
          src={MobileLogo}
          alt="Page logo"
          width={121}
          height={24}
          layout="fixed"
          onClick={(e) => {
            handleLinkClick(e, "/");
          }}
        />
      </div>
      <div id="headerContent" className="flex flex-row items-center">
        <span
          className="hidden md:block md:text-xs xl:text-base mr-4 pointer  rounded-lg"
          onClick={(e) => {
            const href = user ? "/search" : "/signup";
            router.push(href);
          }}
        >
          {t("roommateFind")}
        </span>

        <span
          className="hidden md:block md:text-xs xl:text-base mr-4 pointer rounded-lg"
          onClick={(e) => handleLinkClick(e, "/houseSearch")}
        >
          {t("rentApartment")}
        </span>
        <div
          className="p-2 flex items-center rounded-lg bg-[#F2F5FF]  xl:px-3 xl:py-2 mr-2 lg:mr-4 pointer"
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
            {!user?.firstname ? (
              <span>{t("auth")}</span>
            ) : (
              <span>{user.firstname}</span>
            )}
          </span>
        </div>

        <LangChoose
          className="bg-[#f2f5ff] rounded-lg p-2 text-xs pointer mr-2 lg:mr-4 lg:text-base lg:p-2"
          spanClassname="text-xs xl:text-base"
        />
        {user?.firstname ? (
          <div
            className="relative flex items-center justify-center w-8 h-8 lg:w-10 lg:h-10 md:block bg-[#f2f5ff] rounded-lg p-0 md:px-2 md:pt-[6px] pointer"
            onClick={(e) => {
              handleLinkClick(e, "/conversation");
            }}
          >
            <div className="hidden md:block">
              <Image src={Messanger} width={24} height={24} alt="!23" />
            </div>
            <div className="block md:hidden mt-2">
              <Image src={Messanger} width={18} height={18} alt="!23" />
            </div>
            {!!unreadMessagesCount && (
              <div className="absolute flex items-center justify-center font-semibold  -top-2 -right-2 rounded-full text-white text-xs bg-primaryBeta  w-5 h-5">
                {unreadMessagesCount}
              </div>
            )}
          </div>
        ) : null}
        <div className="block ml-2 md:hidden">
          <BurgerMenu />
        </div>
      </div>
    </header>
  );
}

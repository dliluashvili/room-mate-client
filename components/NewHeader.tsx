import Image from "next/image";
import React from "react";
import Logo from "../public/newImages/logo.svg";
import StatusIcon from "../public/newImages/status-icon.svg";
import Bell from "../public/newImages/bell.svg";
import UserIcon from "../public/newImages/user-icon.svg";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTypedSelector } from "./hooks/useTypeSelector";

export default function NewHeader() {
  let { t } = useTranslation("common") as { t: (key: string) => string };
  const router = useRouter();
  const { user } = useTypedSelector((state) => state.profile);

  return (
    <main className="bg-mainBg flex flex-row px-6 py-3 items-center justify-between sm:px-16 md:px-20 md:py-3 xl:px-24 xl:py-6 md:bg-[#fff] shadow-md">
      <Link href="/">
        <div id="logoIcon" className="w-32 h-6 xl:w-52 xl:h-10 relative">
          <Image
            src={Logo}
            alt="Page logo"
            layout="fill"
            objectFit="cover"
            className="pointer"
          />
        </div>
      </Link>
      <div id="headerContent" className="flex flex-row items-center">
        <Link href={user ? "/search" : "/signup"}>
          <span className="hidden md:block md:text-xs xl:text-base mr-4 pointer">
            {t("roommateFind")}
          </span>
        </Link>
        <Link href="/houseSearch">
          <span className="hidden md:block md:text-xs xl:text-base mr-4 pointer">
            {t("rentApartment")}
          </span>
        </Link>
        <Link href={user ? "/profile" : "login"}>
          <div className="bg-[#cff1e6] p-2 mr-2 flex items-center rounded-lg xl:px-3 xl:py-2 xl:mr-4 pointer">
            <div className="w-3 h-3 xl:w-5 xl:h-5 relative pointer">
              <Image
                src={UserIcon}
                alt="UserIcon"
                layout="fill"
                objectFit="cover"
              />
            </div>

            <span className="ml-2 text-xs xl:text-base xl:mr-3">
              {user ? user.firstname : "ავტორიზაცია"}
            </span>
          </div>
        </Link>

        {router.locales.map((lang) => {
          if (router.locale === lang) return null;
          return (
            <Link key={lang} href={router.asPath} locale={lang}>
              <div
                id="lang"
                className="bg-[#f2f5ff] rounded-lg p-2 text-xs pointer md:mr-4 lg:text-base lg:p-2"
              >
                <span>{lang === "ka" ? "GEO" : "ENG"}</span>
              </div>
            </Link>
          );
        })}
        <div
          id="bell"
          className="hidden lg:block lg:bg-[#f2f5ff]  relative rounded-lg px-2 pb-1 pt-2 md:px-3 lg:mr-4"
        >
          <Image src={Bell} alt="Bell Icon" className="pointer" />
        </div>
      </div>
    </main>
  );
}

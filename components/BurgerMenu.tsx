import React from "react";
import { Sheet, SheetContent, SheetTrigger } from "../@/components/ui/sheet";
import Image from "next/image";
import BurgerIcon from "../public/newImages/burger-menu.svg";
import { useTypedSelector } from "./hooks/useTypeSelector";
import LogoutIcon from "../public/newImages/logout.svg";
import useTranslation from "next-translate/useTranslation";
import { logout } from "../redux/action-creators";
import { useDispatch } from "react-redux";
import Phone from "../public/newImages/footer-phone.svg";
import Email from "../public/newImages/footer-email.svg";
import { Social } from "./NewFooter";
import { useRouter } from "next/router";
import Link from "next/link";

export default function BurgerMenu() {
  const { user } = useTypedSelector((state) => state.profile);
  let { t } = useTranslation("common") as { t: (key: string) => string };
  const router = useRouter();

  const dispatch = useDispatch();
  const signOut = () => {
    dispatch(logout());
    window.location.replace("/login");
  };

  const handleLinkClick = (e, href) => {
    if (router.pathname === "/signup") {
      e.preventDefault();
      const leave = window.confirm("Are you sure you want to leave this page?");
      if (leave) {
        router.push(href);
      }
    } else {
      router.push(href);
    }
  };
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Image src={BurgerIcon} />
      </SheetTrigger>
      <SheetContent className="px-6 pt-3 pb-14 bg-[#F2F5FF] flex flex-col items-start w-72 overflow-y-auto max-h-screen">
        <div className="flex flex-col gap-y-6 mt-20 text-[14px]">
          <p
            className="text-xs"
            style={{ fontWeight: router.pathname === "/" ? "bold" : "" }}
            onClick={(e) => handleLinkClick(e, "/")}
          >
            {t("main")}
          </p>

          <p
            className="text-xs"
            style={{ fontWeight: router.pathname === "/search" ? "bold" : "" }}
            onClick={(e) => {
              const href = user ? "/search" : "/signup";
              handleLinkClick(e, href);
            }}
          >
            {t("search")}
          </p>

          <p
            className="text-xs"
            style={{
              fontWeight: router.pathname === "/houseSearch" ? "bold" : "",
            }}
            onClick={(e) => handleLinkClick(e, "/houseSearch")}
          >
            {t("RentAnApartment")}
          </p>

          <p className="text-xs">{t("becomePartner")}</p>
          <p className="text-xs">{t("faq")}</p>
          <p className="text-xs">{t("howItWorks")}</p>
          {user ? (
            <div className="flex flex-row" onClick={signOut}>
              <Image src={LogoutIcon} width={24} height={24} />
              <p className="ml-2">{t("logout")}</p>
            </div>
          ) : null}
        </div>
        <Link href="tel:+995599976385">
          <div className="mt-[150px] flex flex-row">
            <Image src={Phone} width={16} height={16} />
            <p className="text-[#484848] text-[14px] ml-3">599 976 385</p>
          </div>
        </Link>
        <Link href="mailto:info@roommate.ge">
          <div className="-mt-2 mb-2 flex flex-row">
            <Image src={Email} width={16} height={16} />
            <p className="text-[#484848]  text-[14px] ml-3">info@rommate.ge</p>
          </div>
        </Link>
        <Social />
        <div className="bg-[#DADDE7] w-full h-[2px]"></div>
        <div className="flex flex-row w-full justify-end">
          {/* <Payments /> */}
        </div>
      </SheetContent>
    </Sheet>
  );
}

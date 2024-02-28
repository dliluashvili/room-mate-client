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
import { Payments, Social } from "./NewFooter";
import { useRouter } from "next/router";

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
          <p onClick={(e) => handleLinkClick(e, "/")}>{t("main")}</p>

          <p
            onClick={(e) => {
              const href = user ? "/search" : "/signup";
              handleLinkClick(e, href);
            }}
          >
            {t("search")}
          </p>

          <p onClick={(e) => handleLinkClick(e, "/houseSearch")}>
            {t("RentAnApartment")}
          </p>
          {!user ? (
            <div className="flex flex-row relative">
              <p className="">{t("notifications")}</p>
              <div className="absolute flex items-center justify-center font-semibold  -top-3 right-20 rounded-full text-white text-[10px] bg-primaryBeta  w-6 h-6">
                10
              </div>
            </div>
          ) : null}

          <p>{t("becomePartner")}</p>
          <p>{t("faq")}</p>
          <p>{t("howItWorks")}</p>
          {user ? (
            <div className="flex flex-row" onClick={signOut}>
              <Image src={LogoutIcon} width={24} height={24} />
              <p className="ml-2">{t("logout")}</p>
            </div>
          ) : null}
        </div>
        <div className="mt-[150px] flex flex-row">
          <Image src={Phone} width={16} height={16} />
          <p className="text-[#484848] text-[14px] ml-3">599 123 456</p>
        </div>
        <div className="-mt-2 mb-2 flex flex-row">
          <Image src={Email} width={16} height={16} />
          <p className="text-[#484848]  text-[14px] ml-3">info@rommate.ge</p>
        </div>
        <Social />
        <div className="bg-[#DADDE7] w-full h-[2px]"></div>
        <div className="flex flex-row w-full justify-end">
          <Payments />
        </div>
      </SheetContent>
    </Sheet>
  );
}

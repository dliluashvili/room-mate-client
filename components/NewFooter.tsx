import React from "react";
import FooterLogo from "../public/newImages/footer-logo.svg";
import Image from "next/image";
import FooterPhone from "../public/newImages/footer-phone.svg";
import FooterLiveChat from "../public/newImages/footer-liveChat.svg";
import Footeremail from "../public/newImages/footer-email.svg";
import FooterMessanger from "../public/newImages/footer-messanger.svg";
import Facebook from "../public/newImages/social-fb.svg";
import Instagram from "../public/newImages/social-instagram.svg";
import Whatsapp from "../public/newImages/social-whatsapp.svg";
import Linkedin from "../public/newImages/social-linkedin.svg";
import Visa from "../public/newImages/Visa.svg";
import MasterCard from "../public/newImages/Mastercard.svg";
import Paypal from "../public/newImages/PayPal.svg";
import { useTypedSelector } from "./hooks/useTypeSelector";
import Link from "next/link";
import useTranslation from "next-translate/useTranslation";

export default function NewFooter() {
  const { user } = useTypedSelector((state) => state.profile);
  let { t } = useTranslation("common") as { t: (key: string) => string };
  return (
    <main className="flex flex-col w-full h-full pt-12">
      <div className="flex flex-col px-7 sm:px-16 md:px-20 md:flex-row md:justify-between md:items-start">
        <div>
          <div className=" w-60 h-10  relative">
            <Image src={FooterLogo} layout="fill" objectFit="cover" />
          </div>
        </div>
        <div className="flex flex-col gap-y-4  mt-8 md:mt-0">
          <Link href="/">
            <p className="text-xs font-semibold "> {t("main")}</p>
          </Link>
          <div className="grid lg:grid-cols-2 gap-y-4 lg:gap-x-20">
            <Link href={user ? "/search" : "/signup"}>
              <p className="text-xs pointer"> {t("roommateFind")}</p>
            </Link>
            <Link href="/houseSearch">
              <p className="text-xs pointer"> {t("rentApartment")}</p>
            </Link>
            <p className="text-xs pointer"> {t("becomePartner")}</p>
            <Link href="https://roommate.blog/">
              <p className="text-xs pointer"> {t("blog")}</p>
            </Link>
            <p className="text-xs pointer"> {t("howItWorks")}</p>
          </div>
        </div>
        <div className="flex flex-col mt-8 md:mt-0 ">
          <h1 className="font-semibold text-xs">{t("contact")}</h1>
          <div className="grid grid-cols-2  gap-4 mt-4 md:grid-cols-1 ">
            <div className="py-3 px-2  bg-[#F2F5FF] rounded-lg flex flex-row items-center pointer">
              <Image src={FooterPhone} width={16} height={16} />
              <p className="ml-2 text-xs">555 12 22 23</p>
            </div>
            <div className="py-3 px-2  bg-[#F2F5FF] rounded-lg flex flex-row items-center pointer">
              <Image src={Footeremail} width={16} height={16} />
              <p className="ml-2 text-xs">info@roommate.ge</p>
            </div>
            <div className="py-3 px-2  bg-[#F2F5FF] rounded-lg flex flex-row items-center pointer">
              <Image src={FooterMessanger} width={16} height={16} />
              <p className="ml-2 text-xs">roommate</p>
            </div>
            <div className="py-3 px-2  bg-[#F2F5FF] rounded-lg flex flex-row items-center pointer">
              <Image src={FooterLiveChat} width={16} height={16} />
              <p className="ml-2 text-xs">live chat</p>
            </div>
          </div>
        </div>
      </div>
      <div className="h-[1px] w-full bg-[#7D7D7D]  lg:block hidden mt-6  "></div>
      <div className="flex flex-col lg:flex-row px-7 sm:px-16 md:px-20 lg:justify-between lg:items-center md:py-4">
        <div className=" flex-row gap-x-4 hidden lg:flex">
          <p className=" text-xs pointer">{t("terms")}</p>
          <div className="w-[1px] h-3 bg-[#7D7D7D]"></div>
          <p className=" text-xs pointer">{t("confidencial")}</p>
        </div>
        <div className="flex flex-col mt-8 md:mt-0 lg:order-2 ">
          <div className="flex flex-row mt-4 lg:mt-0 gap-x-6">
            <Image className="pointer" src={Facebook} width={32} height={32} />
            <Image className="pointer" src={Instagram} width={32} height={32} />
            <Image className="pointer" src={Whatsapp} width={32} height={32} />
            <Image className="pointer" src={Linkedin} width={32} height={32} />
          </div>
        </div>

        <div className="h-[1px] w-full bg-[#7D7D7D] mt-8 lg:hidden lg:mt-0 "></div>
        <div className="mt-3  flex flex-row justify-between items-center ">
          <p className="text-xs font-bold lg:hidden">{t("payMethods")}:</p>
          <div className="flex flex-row gap-x-2">
            <Image src={Visa} width={34} height={24} />
            <Image src={MasterCard} width={34} height={24} />
            <Image src={Paypal} width={34} height={24} />
          </div>
        </div>
      </div>
      <div className="bg-[#F2F5FF] px-7 flex flex-row  mt-4 py-4 items-center justify-around sm:px-16 md:px-20 lg:justify-center ">
        <p className=" text-[8px]">Copyrighyt 2022</p>
        <div className="w-[1px] h-3 bg-[#7D7D7D] lg:hidden"></div>
        <p className=" text-[8px] lg:hidden pointer">{t("terms")}</p>
        <div className="w-[1px] h-3 bg-[#7D7D7D] lg:hidden"></div>
        <p className=" text-[8px] lg:hidden pointer">{t("confidencial")}</p>
      </div>
    </main>
  );
}

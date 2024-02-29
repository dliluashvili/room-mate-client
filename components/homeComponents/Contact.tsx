import React from "react";
import Phone from "../../public/newImages/phone-icon.svg";
import Whatsapp from "../../public/newImages/whatsapp-icon.svg";
import Messanger from "../../public/newImages/messanger-icon.svg";
import Email from "../../public/newImages/email-icon.svg";
import Image from "next/image";
import { useMediaQuery } from "react-responsive";
import useTranslation from "next-translate/useTranslation";

export default function Contact() {
  const media = useMediaQuery({ query: "(max-width: 1024px)" });
  let { t } = useTranslation("common") as { t: (key: string) => string };
  return (
    <main className="w-full flex flex-col bg-[#F2F5FF] py-5 md:py-10 items-center px-6 md:flex-row sm:px-16 md:px-20 lg:px-24 mt-10 lg:mt-10">
      <div className="w-full lg:w-[30%] ">
        <h1 className="text-[#484848] text-2xl lg:text-xl">{t("contactUs")}</h1>
        <p className="text-xs text-[#484848] mt-2 lg:text-base">
          {t("contactUsText")}
        </p>
      </div>
      <div
        id="contact icons"
        className="w-full mt-6 grid grid-cols-2 gap-x-4 gap-y-4 lg:mt-0 lg:flex lg:gap-x-6 justify-end  "
      >
        <div className=" bg-[#fff5f0] py-3 px-7 flex flex-row justify-center items-center rounded-lg lg:flex-col lg:px-8 lg:py-4 pointer   ">
          <Image src={Phone} width={media ? 18 : 24} height={media ? 18 : 24} />
          <p className="text-xs text-[#391515] ml-3 lg:ml-0 lg:mt-3 lg:text-[14px]">
            599 123 456
          </p>
        </div>
        <div className="bg-[#e6f9f0] py-3 px-8 flex flex-row justify-center items-center  rounded-lg lg:flex-col lg:px-10 lg:py-4 pointer ">
          <Image
            src={Whatsapp}
            width={media ? 20 : 30}
            height={media ? 20 : 30}
          />
          <p className="text-xs text-[#19a463] ml-3  rounded-lg lg:ml-0 lg:mt-3 lg:text-[14px]">
            whatsapp
          </p>
        </div>
        <div className="bg-[#e0e6fa] py-3 px-8 flex flex-row justify-center items-center  rounded-lg lg:flex-col lg:px-9 lg:py-4 pointer">
          <Image
            src={Messanger}
            width={media ? 24 : 26}
            height={media ? 24 : 26}
          />
          <p className="text-xs text-[ #1162db] ml-3 lg:ml-0 lg:mt-3 lg:text-[14px]">
            messenger
          </p>
        </div>
        <div className="bg-[#e4e0fa] py-3 px-3 flex flex-row justify-center  items-center  rounded-lg lg:flex-col lg:px-4 lg:py-4 pointer ">
          <Image src={Email} width={media ? 23 : 26} height={media ? 23 : 26} />
          <p className="text-xs text-[#633fca] ml-2 lg:ml-0 lg:mt-3 lg:text-[14px]">
            info@roommate.ge
          </p>
        </div>
      </div>
    </main>
  );
}

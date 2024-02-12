import React from "react";
import Phone from "../../public/newImages/phone-icon.svg";
import Whatsapp from "../../public/newImages/whatsapp-icon.svg";
import Messanger from "../../public/newImages/messanger-icon.svg";
import Email from "../../public/newImages/email-icon.svg";
import Image from "next/image";
import { useMediaQuery } from "react-responsive";

export default function Contact() {
  const media = useMediaQuery({ query: "(max-width: 768px)" });
  return (
    <main className="w-full flex flex-col items-center md:flex-row ">
      <div className="w-full md:w-[30%] ">
        <h1 className="text-[#484848] text-2xl md:text-3xl">კონტაქტი</h1>
        <p className="text-xs text-[#484848] mt-2 md:text-base">
          შემთხვევით გენერირებული ტექსტი
        </p>
      </div>
      <div
        id="contact icons"
        className="w-full mt-6 grid grid-cols-2 gap-x-4 gap-y-4 md:mt-0 md:flex md:gap-x-6 justify-end  "
      >
        <div className=" bg-[#fff5f0] py-3 px-7 flex flex-row justify-center items-center rounded-lg md:flex-col md:px-8 md:py-4 pointer   ">
          <Image src={Phone} width={media ? 18 : 24} height={media ? 18 : 24} />
          <p className="text-xs text-[#391515] ml-3 md:ml-0 md:mt-3 md:text-[14px]">
            599 123 456
          </p>
        </div>
        <div className="bg-[#e6f9f0] py-3 px-8 flex flex-row justify-center items-center  rounded-lg md:flex-col md:px-10 md:py-4 pointer ">
          <Image
            src={Whatsapp}
            width={media ? 20 : 30}
            height={media ? 20 : 30}
          />
          <p className="text-xs text-[#19a463] ml-3  rounded-lg md:ml-0 md:mt-3 md:text-[14px]">
            whatsapp
          </p>
        </div>
        <div className="bg-[#e0e6fa] py-3 px-8 flex flex-row justify-center items-center  rounded-lg md:flex-col md:px-9 md:py-4 pointer">
          <Image
            src={Messanger}
            width={media ? 24 : 26}
            height={media ? 24 : 26}
          />
          <p className="text-xs text-[ #1162db] ml-3 md:ml-0 md:mt-3 md:text-[14px]">
            messenger
          </p>
        </div>
        <div className="bg-[#e4e0fa] py-3 px-3 flex flex-row justify-center  items-center  rounded-lg md:flex-col md:px-4 md:py-4 pointer ">
          <Image src={Email} width={media ? 23 : 26} height={media ? 23 : 26} />
          <p className="text-xs text-[#633fca] ml-2 md:ml-0 md:mt-3 md:text-[14px]">
            info@roommate.ge
          </p>
        </div>
      </div>
    </main>
  );
}

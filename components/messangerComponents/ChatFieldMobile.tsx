import Image from "next/image";
import React, { useState } from "react";
import TestAvatar from "../../public/newImages/testAvatar.svg";
import CloseCircle from "../../public/newImages/close-circle.svg";
import Send from "../../public/newImages/send.svg";

export default function ChatFieldMobile({
  user,
  request,
  mobileOpen,
  setMobileOpen,
}) {
  return (
    <section
      className="w-full bg-[#FFFFFF]  h-full flex-col absolute z-50 "
      style={{ display: mobileOpen ? "flex" : "none" }}
    >
      <div className="flex flex-row w-full justify-between items-center pt-4 pb-10 px-6 shadow-md ">
        <div className="flex flex-row items-center">
          <Image src={TestAvatar} alt="123" width={40} height={40} />
          <div className="flex flex-col ml-6 justify-between">
            <span>{user}</span>
            <span>active now</span>
          </div>
        </div>
        <div className="h-full flex items-start justify-start">
          <Image
            onClick={() => setMobileOpen(false)}
            src={CloseCircle}
            alt="123"
            width={32}
            height={32}
            className="cursor-pointer"
          />
        </div>
      </div>
      {!request ? (
        <div className="flex flex-col pt-5 pb-4 px-4 w-full h-full justify-end p-6  ">
          <span className="w-[300px] text-xs mb-5">
            შემთხვევითად გენერირებული ტექსტი ეხმარება დიზაინერებს და
            ტიპოგრაფიული ნაწარმის შემთხვევითად გენერირებული ტექსტი
          </span>
          <textarea className="border-[#838CAC] border focus:outline-none rounded-md h-24 pl-1 text-md pt-1" />
          <div className="w-full flex flex-row justify-end mt-6 cursor-pointer">
            <Image src={Send} width={24} height={24} alt="send" />
          </div>
        </div>
      ) : (
        <div className="w-full h-full flex flex-col justify-end  p-6 ">
          <div className="w-full    bg-[#838CAC] rounded-lg flex flex-col items-center p-6">
            <span className="text-[#FFFFFF]">
              if you reply Mako will be able to call you and see information
              such as you active statusand when you have read messages.
            </span>
            <div className="w-full flex gap-4 flex-row   justify-center items-center mt-6">
              <button className="py-2 w-full px-10 bg-white rounded-xl text-[#838CAC]">
                accept
              </button>
              <button className="py-2 px-10 w-full text-[#FFFFFF] border border-[#FFFFFF] rounded-xl">
                reject
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

import Image from "next/image";
import React, { useState } from "react";
import TestAvatar from "../../public/newImages/testAvatar.svg";
import CloseCircle from "../../public/newImages/close-circle.svg";
import Send from "../../public/newImages/send.svg";
import ArrowLeft from "../../public/newImages/arrow-left-chat.svg";
import More from "../../public/newImages/more.svg";

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
          {!request ? (
            <div onClick={() => setMobileOpen(false)} className="mr-4">
              <Image src={ArrowLeft} />
            </div>
          ) : null}
          <Image src={TestAvatar} alt="123" width={40} height={40} />
          <div className="flex flex-col ml-6 justify-between">
            <span>{user}</span>
            <span>active now</span>
          </div>
        </div>
        <div className="h-full flex items-start justify-start">
          {request ? (
            <Image
              onClick={() => setMobileOpen(false)}
              src={CloseCircle}
              alt="123"
              width={32}
              height={32}
              className="cursor-pointer"
            />
          ) : null}
        </div>
      </div>
      {!request ? (
        <div className="flex flex-col pt-5 pb-4 px-6 w-full h-full justify-end p-6  ">
          <div className="flex w-full flex-row h-auto items-center  py-4">
            <input
              placeholder="send message"
              className="w-full text-[14px] py-2 px-3 border border-[gray] rounded-3xl mr-2"
            />
            <Image
              src={Send}
              width={24}
              height={24}
              alt="!23"
              className="cursor-pointer"
            />
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

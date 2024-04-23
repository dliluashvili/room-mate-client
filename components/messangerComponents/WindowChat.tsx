import TestAvatar from "../../public/newImages/testAvatar.svg";
import More from "../../public/newImages/more.svg";
import Send from "../../public/newImages/send.svg";
import CloseCircle from "../../public/newImages/close-circle.svg";
import Image from "next/image";
import { useState } from "react";

export default function WindowChat({ setIsOpen, name}) {


  return (
    <div className="w-[375px] h-[415px] fixed bottom-0 right-20 bg-[#FFFFFF] flex  flex-col  border z-50 rounded-lg shadow-md">
      <div className="flex flex-row w-full justify-between items-center p-6  shadow-md">
        <div className="flex flex-row w-full items-center justify-between">
          <div className="w-full flex flex-row  items-center justify-start">
            <Image src={TestAvatar} alt="123" width={40} height={40} />
            <div className="flex flex-col ml-6 justify-between">
              <span>{name}</span>
              <span className="text-[#838CAC] text-sm">active now</span>
            </div>
          </div>
          <div className="h-full flex items-start justify-between">
            <Image
              onClick={() => setIsOpen(false)}
              src={CloseCircle}
              alt="123"
              width={32}
              height={32}
              className="cursor-pointer"
            />
          </div>
        </div>
      </div>
      <div className="w-full h-full px-6 "></div>

      <div className=" h-auto w-full flex flex-col justify-end items-end ">
        <div className="flex w-full flex-row h-auto items-center px-6 py-4">
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
    </div>
  );
}

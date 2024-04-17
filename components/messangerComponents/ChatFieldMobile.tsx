import Image from "next/image";
import React, { useState } from "react";
import TestAvatar from "../../public/newImages/testAvatar.svg";
import CloseCircle from "../../public/newImages/close-circle.svg";

export default function ChatFieldMobile({
  user,
  request,
  mobileOpen,
  setMobileOpen,
}) {
  return (
    <section
      className="w-full bg-[#FFFFFF]  h-full absolute z-50"
      style={{ display: mobileOpen ? "block" : "none" }}
    >
      <div className="flex flex-row w-full justify-between items-center pt-4 pb-10 px-6 shadow-md">
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
      {request ? (
        <div className="w-full h-full ">request</div>
      ) : (
        <div className="w-full h-full ">chat</div>
      )}
    </section>
  );
}

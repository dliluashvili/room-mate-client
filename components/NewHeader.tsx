import Image from "next/image";
import React from "react";
import Logo from "../public/newImages/logo.svg";
import StatusIcon from "../public/newImages/status-icon.svg";
import Bell from "../public/newImages/bell.svg";

export default function NewHeader() {
  return (
    <main className="bg-mainBg flex flex-row px-6 py-3 items-center justify-between lg:px-24 lg:py-6">
      <div className="w-32 h-6 lg:w-52 lg:h-10 relative">
        <Image
          src={Logo}
          alt="Page logo"
          layout="fill"
          objectFit="cover"
          className="pointer"
        />
      </div>
      <div id="headerContent" className="flex flex-row items-center">
        <span className="hidden lg:block text-base mr-4 pointer">
          იპოვე ოთახის მეზობელი
        </span>
        <span className="hidden lg:block text-base mr-4 pointer">
          იქირავე ბინა
        </span>
        <div className="bg-[#cff1e6] p-2 flex items-center rounded-lg lg:px-3 lg:py-2">
          <span className="mr-2 text-xs lg:text-base lg:mr-3">სტატუსი</span>
          <div className="w-3 h-3 lg:w-5 lg:h-5 relative pointer">
            <Image
              src={StatusIcon}
              alt="StatusIcon"
              layout="fill"
              objectFit="cover"
            />
          </div>
        </div>
        <div
          id="lang"
          className="bg-[#f2f5ff] rounded-lg p-2 text-xs ml-2 pointer lg:text-base lg:p-2 lg:mr-4"
        >
          eng
        </div>
        <div
          id="bell"
          className="hidden lg:block lg:bg-[#f2f5ff]  relative rounded-lg px-[10px] py-[6px]"
        >
          <Image src={Bell} alt="Bell Icon" className="pointer" />
        </div>
      </div>
    </main>
  );
}

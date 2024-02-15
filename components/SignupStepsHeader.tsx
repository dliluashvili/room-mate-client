import Image from "next/image";
import React from "react";
import RegistrationLogo from "../public/newImages/registration-logo.svg";
import LangEn from "../public/newImages/lang-en.svg";

export default function SignupStepsHeader({ step }) {
  return (
    <div className="bg-[##F2F5FF] px-20 pt-12 pb-8 flex flex-col">
      <div className="flex flex-row justify-between items-start ">
        <div className="flex flex-col items-start">
          <Image src={RegistrationLogo} width={197} height={24} />
          <p className="pl-5 mt-2 text-xs">სარეგისტრაციო ფორმა</p>
        </div>
        <div className="flex flex-row pointer">
          <Image src={LangEn} />
          <p className="text-xs ml-1">Eng</p>
        </div>
      </div>

      <div className="flex flex-row pl-5 mt-12 items-center justify-between gap-x-2">
        <div className="flex justify-center flex-col">
          <div
            className={`w-8 h-8 border border-[#838CAC] rounded-full flex items-center justify-center ${
              step >= 1 ? "border-[#19A463]" : ""
            }`}
          >
            <div
              className={`w-6 h-6 border-2 border-[#838CAC]  rounded-full flex items-center justify-center text-xs ${
                step >= 1 ? "text-[#19A463] border-[#19A463]" : ""
              }`}
            >
              1
            </div>
          </div>
        </div>
        <div
          className={`w-full h-[1px] ${
            step >= 2 ? "bg-[#19A463]" : "bg-[#939AB6]"
          }`}
        ></div>
        <div className="flex justify-center flex-col">
          <div
            className={`w-8 h-8 border border-[#838CAC] rounded-full flex items-center justify-center ${
              step >= 2 ? "border-[#19A463]" : ""
            }`}
          >
            <div
              className={`w-6 h-6 border-2 border-[#838CAC]  rounded-full flex items-center justify-center text-xs ${
                step >= 2 ? "text-[#19A463]" : ""
              }`}
            >
              2
            </div>
          </div>
        </div>
        <div
          className={`w-full h-[1px] ${
            step >= 3 ? "border-[#19A463]" : "bg-[#939AB6]"
          }`}
        ></div>
        <div className="flex justify-center flex-col">
          <div
            className={`w-8 h-8 border border-[#838CAC] rounded-full flex items-center justify-center ${
              step >= 3 ? "border-[#19A463]" : ""
            }`}
          >
            <div
              className={`w-6 h-6 border-2 border-[#838CAC]  rounded-full flex items-center justify-center text-xs ${
                step >= 3 ? "text-[#19A463]" : ""
              }`}
            >
              3
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-row justify-between items-center mt-2 pl-5">
        <p className="text-xs ">ეტაპი</p>
        <p className="text-xs ">ეტაპი</p>
        <p className="text-xs ">ეტაპი</p>
      </div>
    </div>
  );
}

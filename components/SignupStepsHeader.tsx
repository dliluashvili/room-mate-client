import Image from "next/image";
import React from "react";
import RegistrationLogo from "../public/newImages/registration-logo.svg";
import useTranslation from "next-translate/useTranslation";

export default function SignupStepsHeader({ step }) {
  let { t } = useTranslation("common") as { t: (key: string) => string };
  return (
    <div className="bg-[##F2F5FF] px-20 pt-12 pb-8 flex flex-col">
      <div className="flex flex-row justify-between items-start ">
        <div className="flex flex-col items-start">
          <Image src={RegistrationLogo} width={197} height={24} />
          <p className="pl-5 mt-2 text-xs">{t("registerForm")}</p>
        </div>
      </div>

      <div className="flex flex-row pl-5 mt-12 items-center justify-between gap-x-2">
        <div className="flex justify-center flex-col">
          <div className="w-8 h-8 border-2 border-[#19A463]  rounded-full flex items-center justify-center">
            <div className="w-6 h-6 border-2 text-[#19A463] border-[#19A463] font-semibold rounded-full flex items-center justify-center text-xs ">
              1
            </div>
          </div>
        </div>
        <div
          className={`w-full rounded-xl h-[3px] ${
            step >= 2 ? "bg-[#19A463]" : "bg-[#939AB6]"
          }`}
        ></div>
        <div className="flex justify-center flex-col">
          <div
            className={`w-8 h-8 border-2  rounded-full flex items-center justify-center ${
              step >= 2 ? "border-[#19A463]" : "border-[#838CAC]"
            }`}
          >
            <div
              className={`w-6 h-6 border-2 font-semibold rounded-full flex items-center justify-center text-xs ${
                step >= 2
                  ? "border-[#19A463] text-[#19A463]"
                  : "border-[#838CAC] text-[#838CAC]"
              }`}
            >
              2
            </div>
          </div>
        </div>
        {/* <div
          className={`w-full rounded-xl h-[3px] ${
            step >= 3 ? "bg-[#19A463]" : "bg-[#939AB6]"
          }`}
        ></div> */}
        {/* <div
          className={`w-fullrounded-xl h-[3px] ${
            step >= 3 ? "border-[#19A463]" : "bg-[#939AB6]"
          }`}
        ></div>
        <div className="flex justify-center flex-col">
          <div
            className={`w-8 h-8 border-2  rounded-full flex items-center justify-center ${
              step >= 3 ? "border-[#19A463]" : "border-[#838CAC]"
            }`}
          >
            <div
              className={`w-6 h-6 border-2 font-semibold rounded-full flex items-center justify-center text-xs ${
                step >= 3
                  ? "border-[#19A463] text-[#19A463]"
                  : "border-[#838CAC] text-[#838CAC]"
              }`}
            >
              3
            </div>
          </div>
        </div> */}
      </div>
      <div className="flex flex-row justify-between items-center mt-2 pl-5">
        <p className="text-xs ">{t("step")}</p>
        <p className="text-xs ">{t("step")}</p>
        {/* <p className="text-xs ">{t("step")}</p> */}
      </div>
    </div>
  );
}

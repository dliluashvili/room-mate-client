import React from "react";
import BankIcon from "../../public/newImages/bank.svg";
import RateStar from "../../public/newImages/rate-star.svg";
import RateStars from "../../public/newImages/rate-stars.svg";
import Image from "next/image";
import { useMediaQuery } from "react-responsive";
import useTranslation from "next-translate/useTranslation";

export default function Features() {
  const media = useMediaQuery({ query: "(max-width: 1024px)" });
  let { t } = useTranslation("common") as { t: (key: string) => string };
  return (
    <>
      <main className="w-full flex justify-between px-6  mt-12 sm:px-16 md:px-20 lg:grid  lg:grid-flow-col  lg:grid-cols-4 lg:gap-x-12 lg:mt-24 lg:px-24">
        <div className="flex flex-col items-center w-16 lg:w-full lg:items-start">
          <Image src={BankIcon} alt="Bank Icon" width={32} height={32} />
          <div className="flex flex-col mt-4">
            <div className=" h-12 md:h-20  xl:h-10 w-full flex items-start">
              <span className="text-xs break-words text-center text-[#838cac] lg:text-[#484848] lg:text-lg lg:text-left lg:font-semibold">
                {t("roommateFind")}
              </span>
            </div>
            <p className="hidden lg:block text-[#484848] text-base font-normal mt-2">
              {t("roommateFindText")}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center w-16 lg:w-full lg:items-start">
          <Image src={BankIcon} alt="Bank Icon" width={32} height={32} />
          <div className="flex flex-col mt-4">
            <div className=" h-12  md:h-20 xl:h-10 w-full flex items-start">
              <span className="text-xs break-words text-center text-[#838cac] lg:text-[#484848] lg:text-lg lg:text-left lg:font-semibold">
                {t("roommateMatching")}
              </span>
            </div>
            <p className="hidden lg:block text-[#484848] text-base mt-2">
              {t("roommateMatchingText")}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center w-16 lg:w-full lg:items-start">
          <Image src={BankIcon} alt="Bank Icon" width={32} height={32} />
          <div className="flex flex-col mt-4">
            <div className=" h-12 md:h-20  xl:h-10 w-full flex items-start">
              <span className="text-xs break-words text-center text-[#838cac] lg:text-[#484848] lg:text-lg lg:text-left lg:font-semibold">
                {t("support")}
              </span>
            </div>
            <p className="hidden lg:block text-[#484848] text-base mt-2">
              {t("supportText")}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center w-16 lg:w-full lg:items-start">
          <div
            style={{
              height: media ? "32px" : "32px",
              width: media ? "32px" : "120px",
            }}
            className="relative"
          >
            <Image
              src={media ? RateStar : RateStars}
              alt="Bank Icon"
              layout="fill"
              objectFit="contain"
            />
          </div>
          <div className="flex flex-col mt-4">
            <div className=" h-12  md:h-20 xl:h-10 w-full flex items-start">
              <span className="text-xs break-words text-center text-[#838cac] lg:text-[#484848] lg:text-lg lg:text-left lg:font-semibold">
                4.9
              </span>
            </div>
            <p className="hidden lg:block text-[#484848] text-base mt-2">
              {t("rate")}
            </p>
          </div>
        </div>
      </main>
    </>
  );
}

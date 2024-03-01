import React from "react";

import FirstBG from "../../public/newImages/bgFirst.svg";
import SecondBG from "../../public/newImages/secondBG.svg";
import { Button } from "../../@/components/ui/button";
import Image from "next/image";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";

export default function Partners() {
  let { t } = useTranslation("common") as { t: (key: string) => string };
  return (
    <main className="w-full flex flex-col md:flex-row px-6 mt-12 sm:px-16 md:px-20  xl:px-24  xl:flex-row md:gap-10 ">
      <div className="w-full h-60 rounded-xl relative mt-4 xl:bg-[#f2f5ff] xl:h-full  xl:w-[90%] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-no-repeat bg-center  xl:hidden "
          style={{ backgroundImage: `url(${FirstBG.src})` }}
        ></div>
        <div className="absolute inset-0 bg-[#5e666ebf] bg-opacity-50 rounded-xl h-full   p-10 xl:relative xl:bg-[#f2f5ff] flex flex-row justify-between   items-center xl:items-end  xl:pl-12 xl:py-4 xl:pr-4">
          <div className="xl:w-1/2 h-full flex flex-col items-start justify-center xl:pr-14  overflow-hidden xl:mb-20">
            <h1 className="z-50  text-[#fff] xl:text-[#484848] xl:text-xl   font-semibold">
              {t("partnersHead1")}
            </h1>
            <p className="text-xs z-50 mt-4 text-[#fff] xl:text-[#484848] xl:text-base overflow-auto ">
              {t("partnersText1")}
            </p>
            <Link href="/signup">
              <Button className="text-xs mt-7   ">{t("startSearch")}</Button>
            </Link>
          </div>
          <div className="w-1/2 hidden xl:block">
            <Image src={FirstBG} layout="responsive" objectFit="cover" />
          </div>
        </div>
      </div>
      <div className="w-full h-60 rounded-xl relative mt-4 xl:bg-[#f2f5ff] xl:h-full  xl:w-[90%] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-no-repeat bg-center    xl:hidden"
          style={{ backgroundImage: `url(${SecondBG.src})` }}
        ></div>
        <div className="absolute inset-0 bg-[#5e666ebf] bg-opacity-50 rounded-xl  p-10 xl:relative xl:bg-[#f2f5ff] flex flex-row justify-between items-center xl:items-end xl:pl-12 xl:py-4 xl:pr-4">
          <div className="xl:w-1/2  flex flex-col items-start justify-center xl:pr-14  overflow-hidden  xl:mb-20">
            <h1 className="z-50  text-[#fff] xl:text-[#484848] xl:text-xl   font-semibold">
              {t("partnersHead2")}
            </h1>
            <p className="text-xs z-50 mt-4 text-[#fff] xl:text-[#484848] xl:text-base overflow-auto ">
              {t("partnersText2")}
            </p>
            <Link href="https://form.jotform.com/240432625356049">
              <Button className="text-xs mt-7">{t("leaveFlat")}</Button>
            </Link>
          </div>
          <div className="w-1/2 hidden xl:block">
            <Image src={SecondBG} layout="responsive" objectFit="cover" />
          </div>
        </div>
      </div>
    </main>
  );
}

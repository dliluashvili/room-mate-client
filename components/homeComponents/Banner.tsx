import React from "react";
import { Button } from "../../@/components/ui/button";
import useTranslation from "next-translate/useTranslation";

export default function Banner() {
  let { t } = useTranslation("common") as { t: (key: string) => string };
  return (
    <>
      <div className="w-full pt-6 pb-2 px-6 md:px-16 lg:px:20 xl:px-24">
        <div className="flex  bg-[#A6E2EC] rounded-xl overflow-hidden pl-4 pt-12 pb-32 pr-32 flex-col md:pb-14 md:pt-24 md:pl-8 md:pr-[400px] xl:pr-[800px]">
          <p className="text-xl text-[#FFFFFF] font-semibold lg:text-4xl ">
            იპოვე ოთახის მეზობელი და გაიყავი ბინის ქირა
          </p>
          <div className=" flex-row justify-between gap-x-4 mt-4 xl:mt-12 hidden md:flex">
            <Button className="md:text-base  ">{t("search")}</Button>
            <Button className="md:text-base">{t("rentApartment")}</Button>
          </div>
        </div>
        <div className="flex flex-row justify-between gap-x-4 mt-4 md:hidden">
          <Button className="md:text-base">{t("search")}</Button>
          <Button className="md:text-base">{t("rentApartment")}</Button>
        </div>
      </div>
    </>
  );
}

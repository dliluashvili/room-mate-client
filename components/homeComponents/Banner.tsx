import React from "react";
import { Button } from "../../@/components/ui/button";
import useTranslation from "next-translate/useTranslation";
import cover from "../../public/newImages/caver-01.jpg";
import Link from "next/link";
import { useTypedSelector } from "../hooks/useTypeSelector";

export default function Banner() {
  let { t } = useTranslation("common") as { t: (key: string) => string };
  const { user } = useTypedSelector((state) => state.profile);
  return (
    <>
      <div className="w-full pt-6 pb-2 px-6 md:px-16 lg:px:20 xl:px-24">
        <div
          style={{
            backgroundImage: `url(${cover.src})`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
          }}
          className="flex   rounded-xl overflow-hidden pl-4 pt-12 pb-32 pr-32 flex-col md:pb-14 md:pt-24 md:pl-8 md:pr-[400px] xl:pr-[800px]"
        >
          <p className="text-xl text-[#FFFFFF] font-semibold lg:text-4xl ">
            {t("bannerHeader")}
          </p>
          <div className=" flex-row justify-between gap-x-4 mt-4 xl:mt-12 hidden md:flex">
            <Link href={user ? "/search" : "/signup"}>
              <Button className="md:text-base  ">{t("search")}</Button>
            </Link>
            <Link href="/houseSearch">
              <Button className="md:text-base">{t("rentApartment")}</Button>
            </Link>
          </div>
        </div>
        <div className="flex flex-row justify-between gap-x-4 mt-4 md:hidden">
          <Link href={user ? "/search" : "/signup"}>
            <Button className="md:text-base">{t("search")}</Button>
          </Link>
          <Link href="/houseSearch">
            <Button className="md:text-base">{t("rentApartment")}</Button>
          </Link>
        </div>
      </div>
    </>
  );
}

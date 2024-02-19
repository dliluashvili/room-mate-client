import React from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "../../@/components/ui/carousel";
import BankIcon from "../../public/newImages/bank.svg";
import Image from "next/image";
import useTranslation from "next-translate/useTranslation";

export default function WhyUs() {
  let { t } = useTranslation("common") as { t: (key: string) => string };

  const data = [
    {
      header: t("whyUsHassleH"),
      text: t("whyUsHassle"),
      image: BankIcon,
    },
    {
      header: t("whyUsRoommatesH"),
      text: t("whyUsRoommates"),
      image: BankIcon,
    },
    {
      header: t("whyUsHomeListingH"),
      text: t("whyUsHomeListnig"),
      image: BankIcon,
    },
    {
      header: t("whyUsSearchH"),
      text: t("whyUsSearch"),
      image: BankIcon,
    },
  ];
  return (
    <main className="w-full flex flex-col bg-[#F2F5FF] p-6 sm:px-16 md:px-20 lg:px-24 items-start lg:py-12 lg:flex-row lg:items-center">
      <div className="flex flex-col items-start lg:w-2/3 ">
        <h1 className="text-2xl text-[#484848] lg:text-3xl">{t("whyUs")}</h1>
      </div>

      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full mt-6 p-0 lg:hidden"
      >
        <CarouselContent className="pr-10 lg:pr-16">
          {data.map((item, index) => (
            <CarouselItem key={index} className="w-full lg:w-1/2 md:basis-1/2">
              <div className="w-full h-full pl-4 py-4 pr-8 flex flex-col items-start rounded-xl bg-[#c0dbfc]">
                <Image src={BankIcon} alt="Bank Icon" width={32} height={32} />
                <p className="text-xs font-semibold mt-4">{item.header}</p>
                <p className="text-xs mt-2">{item.text}</p>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <div className="w-full  grid-cols-2 gap-6 hidden lg:grid ">
        {data.map((item, index) => (
          <div
            className="py-8 pl-8 pr-14 bg-[#fff] rounded-xl flex flex-col items-start justify-start"
            key={index}
          >
            <Image src={BankIcon} alt="Bank Icon" width={32} height={32} />
            <h1 className="mt-6 text-left font-semibold">{item.header}</h1>
            <h2 className="mt-2 text-left">{item.text}</h2>
          </div>
        ))}
      </div>
    </main>
  );
}

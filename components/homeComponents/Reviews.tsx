import React from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../@/components/ui/carousel";
import CarouselBgMen from "../../public/newImages/CarouselBg.svg";
import CarouselBgWomen from "../../public/newImages/CarouselBgWomen.svg";
import Image from "next/image";
import { useMediaQuery } from "react-responsive";
import Avatar from "../../public/newImages/avatar.svg";
import RateStar from "../../public/newImages/rate-star.svg";
import useTranslation from "next-translate/useTranslation";

export default function Reviews() {
  const media = useMediaQuery({ query: "(max-width: 1024px)" });
  let { t } = useTranslation("common") as { t: (key: string) => string };
  const data = [
    {
      header: t("reviewName1"),
      text: t("reviewText1"),
      image: CarouselBgMen,
    },
    {
      header: t("reviewName2"),
      text: t("reviewText2"),
      image: CarouselBgWomen,
    },
    {
      header: t("reviewName4"),
      text: t("reviewText3"),
      image: CarouselBgMen,
    },
    {
      header: t("reviewName5"),
      text: t("reviewText4"),
      image: CarouselBgMen,
    },
  ];
  return (
    <main className="w-full flex flex-col px-6 items-start sm:px-16 md:px-20 my-12 lg:px-24 ">
      <h1 className="text-2xl text-[#484848]">{t("reviewsHead")}</h1>
      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full mt-6 p-0"
      >
        <CarouselContent className="pr-10 lg:pr-20 ml-1 gap-4 ">
          {data.map((item, index) => (
            <CarouselItem
              key={index}
              className="w-full md:basis-1/2 lg:basis-1/3 bg-[#FFFFFF]  rounded-xl border border-gray-300 "
            >
              <div className="w-full py-6 px-4 flex flex-col">
                <div className="w-full flex flex-row items-center">
                  <div className="w-14 h-14 relative">
                    <Image src={Avatar} layout="fill" objectFit="cover" />
                  </div>
                  <p className="ml-4 text-xs font-semibold text-[#484848]">
                    {item.header}
                  </p>
                  <div className="flex flex-row ml-14 items-center">
                    <div className="w-4 h-4 relative">
                      <Image src={RateStar} layout="fill" objectFit="cover" />
                    </div>
                    <p className="ml-1 text-[#484848] text-[14px] font-semibold">
                      4.9
                    </p>
                  </div>
                </div>
                <p className="mt-4 text-[ #484848] text-xs">{item.text}</p>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {media ? null : <CarouselPrevious />}
        {media ? null : <CarouselNext />}
      </Carousel>
    </main>
  );
}

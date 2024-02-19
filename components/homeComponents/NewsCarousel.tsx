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
import { Button } from "../../@/components/ui/button";
import { useMediaQuery } from "react-responsive";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";

export default function NewsCarousel() {
  let { t } = useTranslation("common") as { t: (key: string) => string };
  const data = [
    {
      header: t("blogHeader1"),
      text: t("blogText1"),
      image: CarouselBgMen,
      buttonText: t("findMore"),
      link: "https://www.roommate.blog/",
    },
    {
      header: t("blogHeader2"),
      text: t("blogText2"),
      image: CarouselBgWomen,
      buttonText: t("findMore"),
      link: "https://www.roommate.blog/post/a-comprehensive-guide-to-accommodation-options-and-prices-for-international-students-in-tbilisi-geo",
    },
    {
      header: t("blogHeader3"),
      text: t("blogText3"),
      image: CarouselBgMen,
      buttonText: t("findMore"),
      link: "https://www.roommate.blog/",
    },
  ];
  const media = useMediaQuery({ query: "(max-width: 1024px)" });
  return (
    <main className="w-full h-full flex flex-col px-6 items-start my-12 sm:px-16 md:px-20 lg:my-24 lg:px-24">
      <h1 className="text-2xl text-[#484848]">{t("blogMainHead")}</h1>

      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full mt-6 p-0 "
      >
        <CarouselContent className="pr-10 lg:pr-16  ">
          {data.map((item, index) => (
            <CarouselItem
              key={index}
              className="w-full md:basis-1/2 xl:basis-1/3   "
            >
              <div className="w-full h-full pl-6 pt-6 pb-10 pr-24 flex flex-col justify-between   relative lg:pb-10 lg:pt-8 lg:pl-8 lg:pr-[140px] rounded-xl bg-[#c0dbfc] ">
                <span className="text-base font-semibold">{item.header}</span>
                <div className="flex h-full  flex-col justify-between mt-4">
                  <span className="text-xs ">{item.text}</span>
                  <Link href={item.link}>
                    <Button className="mt-4 w-32 bottom-0 text-xs">
                      {item.buttonText}
                    </Button>
                  </Link>
                </div>
                <div className="absolute right-0 bottom-[-10px]  lg:right-4">
                  <Image width={128} height={158} src={item.image} />
                </div>
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

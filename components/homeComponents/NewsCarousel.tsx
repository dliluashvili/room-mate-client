import React from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../@/components/ui/carousel";

import blogFirst from "../../public/newImages/blog-first.svg";
import blogSecond from "../../public/newImages/blog-second.svg";
import blogThirth from "../../public/newImages/blog-thirth.svg";
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
      image: blogFirst,
      buttonText: t("findMore"),
      link: "https://www.roommate.blog/",
    },
    {
      header: t("blogHeader2"),
      text: t("blogText2"),
      image: blogSecond,
      buttonText: t("findMore"),
      link: "https://www.roommate.blog/post/a-comprehensive-guide-to-accommodation-options-and-prices-for-international-students-in-tbilisi-geo",
    },
    {
      header: t("blogHeader3"),
      text: t("blogText3"),
      image: blogThirth,
      buttonText: t("findMore"),
      link: "https://www.roommate.blog/",
    },
  ];
  const media = useMediaQuery({
    query: "(min-width: 768px) and (max-width: 1280px)",
  });
  const dragMedia = useMediaQuery({
    query: "(min-width: 0px) and (max-width: 1280px)",
  });
  return (
    <main className="w-full h-full flex flex-col px-6 items-start my-12 sm:px-16 md:px-20 lg:my-24 xl:px-24">
      <h1 className="text-2xl text-[#484848]">{t("blogMainHead")}</h1>

      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full mt-6 p-0  "
      >
        <CarouselContent className="  pr-10  lg:pr-16 xl:pr-0">
          {data.map((item, index) => (
            <CarouselItem
              key={index}
              className="w-full md:basis-1/2 xl:basis-1/3"
            >
              <div className="w-full h-full pl-6 pt-4 pb-10 pr-20 flex flex-col justify-between   overflow-hidden relative lg:pb-10 lg:pt-8 lg:pl-8 lg:pr-[140px] rounded-xl bg-[#c0dbfc] ">
                <span className="text-base font-semibold">{item.header}</span>
                <div className="flex h-full  flex-col justify-between mt-4">
                  <span className="text-xs z-50 ">{item.text}</span>
                  <Link href={item.link}>
                    <Button className="mt-4 w-32 bottom-0 text-xs z-50">
                      {item.buttonText}
                    </Button>
                  </Link>
                </div>
                <div className="absolute w-[144px] h-[144px]  right-0 bottom-0 ">
                  <Image layout="fill" objectFit="cover" src={item.image} />
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {media ? <CarouselPrevious /> : null}
        {media ? <CarouselNext /> : null}
      </Carousel>
    </main>
  );
}

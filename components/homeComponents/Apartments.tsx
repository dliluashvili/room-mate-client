import React from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../@/components/ui/carousel";
import { useMediaQuery } from "react-responsive";
import Link from "next/link";
import useTranslation from "next-translate/useTranslation";

export default function Apartments({ flats }) {
  const media = useMediaQuery({ query: "(max-width: 1024px)" });
  let { t } = useTranslation("common") as { t: (key: string) => string };

  return (
    <>
      <h1 className="text-2xl text-[#484848] pl-6 pt-12 pb-6 sm:px-16 md:px-20 lg:px-24 lg:pt-12 lg:pb-7 ">
        {t("findAffordable")}
      </h1>
      <main className="w-full flex flex-col  items-start pl-6  pb-8  sm:px-16 md:px-20  lg:px-24">
        <Carousel
          opts={{
            align: "start",
          }}
          className="w-full p-0   "
        >
          <CarouselContent className="  pr-10 lg:pr-16">
            {flats &&
              flats.map((item) => (
                <Link href={`house/${item.id}`}>
                  <CarouselItem
                    key={item}
                    className="w-full sm:basis-1/2  md:basis-1/3 xl:basis-1/4 pointer"
                  >
                    <div className="w-full h-full  flex flex-col justify-start rounded-xl  items-start  border-1 ">
                      <div className="w-full  rounded-t-xl overflow-hidden">
                        <div style={{ height: "214px", position: "relative" }}>
                          {/* <Image
                            src={item.images[0].original}
                            layout="fill"
                            objectFit="cover"
                          /> */}
                          <img
                            src={item.images[0].original}
                            style={{
                              objectFit: "cover",
                              width: "100%",
                              height: "100%",
                            }}
                          />
                        </div>
                      </div>

                      <div className="px-4  pt-7 pb-4">
                        <h1 className="text-semibold text-xl text-[#484848]">
                          {item.price} ₾/ {t("InMonth")}
                        </h1>
                        <p className="mt-3 text-xs text-[#484848]">
                          {item.title} {t("space")} - {item.area} M 2
                        </p>
                      </div>
                    </div>
                  </CarouselItem>
                </Link>
              ))}
          </CarouselContent>

          {media ? null : <CarouselPrevious />}
          {media ? null : <CarouselNext />}
        </Carousel>
      </main>
    </>
  );
}

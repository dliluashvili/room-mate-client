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
import Image from "next/image";
import Door from "../../public/newImages/door.svg";
import Square from "../../public/newImages/square.svg";
import Location from "../../public/newImages/location.svg";
import Cursor from "../../public/newImages/cursor.svg";

export default function Apartments({ flats }) {
  const media = useMediaQuery({ query: "(max-width: 768px)" });
  let { t } = useTranslation("common") as { t: (key: string) => string };
  return (
    <>
      <section>
        <h1 className="text-2xl text-[#484848] pl-6 pt-12 pb-6 sm:px-16 md:px-20  xl:px-24 lg:pt-12 lg:pb-7 ">
          {t("findAffordable")}
        </h1>
        <div className="w-full flex flex-col   items-start pl-6  pb-8  sm:px-16 md:px-20  xl:px-24 relative">
          <Carousel
            opts={{
              align: "start",
            }}
            className="w-full p-0   "
          >
            <CarouselContent className=" pr-12 lg:pr-16">
              {flats &&
                flats.map((item) => (
                  <Link href={`house/${item.id}`}>
                    <CarouselItem
                      key={item}
                      className="w-full sm:basis-1/2  md:basis-1/2 lg:basis-1/3 xl:basis-1/4 pointer"
                    >
                      <div className="w-full  flex flex-col justify-start rounded-xl  items-start  border-1 overflow-auto text-ellipsis  whitespace-nowrap ">
                        <div className="w-full  rounded-t-xl overflow-hidden">
                          <div
                            style={{ height: "214px", position: "relative" }}
                          >
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

                        <div className="px-4 relative  pt-7 pb-4 flex flex-col w-full">
                          <h1 className=" font-bold text-xl text-[#484848]">
                            {item.price} ₾/ {t("InMonth")}
                          </h1>
                          <div className="flex flex-row  items-center mt-4">
                            <div className="flex flex-row items-center">
                              <Image src={Door} width={24} height={24} />
                              <p className="text-sm ml-2 text-[#484848]">
                                {t("room")}: {item.room}
                              </p>
                            </div>
                            <div className="flex flex-row items-center ml-10">
                              <Image src={Square} width={24} height={24} />
                              <p className="text-sm ml-2 text-[#484848]">
                                {t("area")} - {item.area}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-row items-center mt-2">
                            <Image src={Location} width={24} height={24} />
                            <p className="text-sm ml-2 text-[#484848]">
                              {item?.district?.title}
                            </p>
                          </div>
                          <div className="absolute -top-5 right-4">
                            <Image src={Cursor} width={40} height={40} />
                          </div>
                        </div>
                      </div>
                    </CarouselItem>
                  </Link>
                ))}
            </CarouselContent>

            {media ? null : <CarouselPrevious />}
            {media ? null : <CarouselNext />}
          </Carousel>
          <Link href="/houseSearch">
            <p className="hidden md:block text text-sm text-[#484848] underline absolute right-24 -bottom-5 pointer">
              {t("viewAll")}
            </p>
          </Link>
          <Link href="/houseSearch">
            <div className="w-[92%] text-sm text-[#838CAC] py-2 border border-[#838CAC] rounded-md mt-6  flex items-center justify-center md:hidden">
              {t("viewAll")}
            </div>
          </Link>
        </div>
      </section>
    </>
  );
}

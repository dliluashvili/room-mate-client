import React from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../@/components/ui/carousel";
import Image from "next/image";
import { useMediaQuery } from "react-responsive";
import Link from "next/link";

export default function Apartments({ flats }) {
  const media = useMediaQuery({ query: "(max-width: 768px)" });

  return (
    <>
      <h1 className="text-2xl text-[#484848] pl-6 pt-12 pb-6 md:px-24 md:pt-12 md:pb-7 ">
        იქირავე ბინა
      </h1>
      <main className="w-full flex flex-col  items-start  pb-8 pl-6 md:px-48">
        <Carousel
          opts={{
            align: "start",
          }}
          className="w-full p-0  md:px-4  "
        >
          <CarouselContent className=" pr-14 md:pr-36 gap-2 ">
            {flats.map((item) => (
              <Link href={`house/${item.id}`}>
                <CarouselItem
                  key={item}
                  className="w-full  md:basis-1/3 pointer"
                >
                  <div className="w-full  flex flex-col justify-start rounded-xl  items-start  border-1 ">
                    <div className="w-full  rounded-t-xl overflow-hidden">
                      <div style={{ height: "214px", position: "relative" }}>
                        <Image
                          src={item.images[0].original}
                          layout="fill"
                          objectFit="cover"
                        />
                      </div>
                    </div>

                    <div className="pl-4 mr-6 pt-8 pb-4">
                      <h1 className="text-semibold text-2xl text-[#484848]">
                        2987 ₾/თვეში
                      </h1>
                      <p className="mt-4 text-[14px] text-[#484848]">
                        3 საძინებელი, ფართი - 85 მ 2
                      </p>
                      <p className="mt-1 text-[14px] text-[#484848]">
                        საბურთალო: მერაბ კოსტავა #34
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

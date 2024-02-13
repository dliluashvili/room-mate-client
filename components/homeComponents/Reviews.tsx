import React from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../@/components/ui/carousel";
import CarouselBgMen from "../../public/newImages/CarouselBgMen.svg";
import CarouselBgWomen from "../../public/newImages/CarouselBgWomen.svg";
import Image from "next/image";
import { Button } from "../../@/components/ui/button";
import { useMediaQuery } from "react-responsive";
import Avatar from "../../public/newImages/avatar.svg";
import RateStar from "../../public/newImages/rate-star.svg";

const data = [
  {
    header: "სათაური",
    text: "შემთხვევითად გენერირებული ტექსტი ეხმარება დიზაინერებს და ტიპოგრაფიული ნაწარმის",
    image: CarouselBgMen,
    buttonText: "ღილაკი",
  },
  {
    header: "სათაური",
    text: "შემთხვევითად გენერირებული ტექსტი ეხმარება დიზაინერებს და ტიპოგრაფიული ნაწარმის",
    image: CarouselBgWomen,
    buttonText: "ღილაკი",
  },
  {
    header: "სათაური",
    text: "შემთხვევითად გენერირებული ტექსტი ეხმარება დიზაინერებს და ტიპოგრაფიული ნაწარმის",
    image: CarouselBgMen,
    buttonText: "ღილაკი",
  },
  {
    header: "სათაური",
    text: "შემთხვევითად გენერირებული ტექსტი ეხმარება დიზაინერებს და ტიპოგრაფიული ნაწარმის",
    image: CarouselBgMen,
    buttonText: "ღილაკი",
  },
];

export default function Reviews() {
  const media = useMediaQuery({ query: "(max-width: 768px)" });
  return (
    <main className="w-full flex flex-col px-6 items-start my-12 md:px-24 ">
      <h1 className="text-2xl text-[#484848]">სათაური</h1>
      <h2 className="mt-2 text-xs text-[#484848]">
        შემთხვევით გენერირებული ტექსტი
      </h2>

      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full mt-6 p-0"
      >
        <CarouselContent className="pr-10 md:pr-20 ml-1 gap-4">
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
                    სახელი გვარი
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
                <p className="mt-4 text-[ #484848] text-xs">
                  შემთხვევითად გენერირებული ტექსტი ეხმარება დიზაინერებს და
                  ტიპოგრაფიული ნაწარმის შემქმნელებს
                </p>
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

import React from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../@/components/ui/carousel";
import { Card, CardContent } from "../../@/components/ui/card";
import CarouselBgMen from "../../public/newImages/CarouselBgMen.svg";
import CarouselBgWomen from "../../public/newImages/CarouselBgWomen.svg";
import Image from "next/image";
import { Button } from "../../@/components/ui/button";
import { useMediaQuery } from "react-responsive";

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
];

export default function NewsCarousel() {
  const media = useMediaQuery({ query: "(max-width: 768px)" });
  return (
    <main className="w-full flex flex-col px-6 items-start my-12 md:my-24 md:px-24">
      <h1 className="text-2xl text-[#484848]">სათაური</h1>
      <h2 className="mt-2 text-xs text-[#484848]">
        შემთხვევით გენერირებული ტექსტი
      </h2>

      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full mt-6 p-0 "
      >
        <CarouselContent className="pr-10 md:pr-16">
          {data.map((item, index) => (
            <CarouselItem key={index} className="w-full md:basis-1/2 ">
              <div className="w-full pl-6 pt-6 pb-10 pr-24 flex flex-col relative md:pb-10 md:pt-8 md:pl-8 md:pr-[226px] rounded-xl bg-[#c0dbfc] ">
                <span className="text-base font-semibold">{item.header}</span>
                <span className="text-xs ">{item.text}</span>

                <Button className="mt-6 w-32">{item.buttonText}</Button>
                <div className="absolute right-0 bottom-[-10px]  md:right-4">
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

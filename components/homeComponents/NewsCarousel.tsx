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
import Image from "next/image";
import { Button } from "../../@/components/ui/button";

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

export default function NewsCarousel() {
  return (
    <main className="flex flex-col items-start w-full my-12">
      <h1 className="text-2xl text-[#484848]">სათაური</h1>
      <h2 className="mt-2 text-xs text-[#484848]">
        შემთხვევით გენერირებული ტექსტი
      </h2>
      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full mt-6 "
      >
        <CarouselContent>
          {data.map((item, index) => (
            <CarouselItem
              key={index}
              className="md:basis-1/2  lg:basis-1/2 xl:basis-1/2 "
            >
              <div className="p-1 ">
                <Card className="rounded-xl pt-6 pl-6 pb-10 pr-28  bg-[#c0dbfc] w-[500px] h-[240px]  relative md:pt-8 md:pl-8 xl:pr-[228px]  ">
                  <CardContent className="p-0 flex flex-col relative ">
                    <span className="text-base font-semibold">
                      {item.header}
                    </span>
                    <span className="text-xs pt-4">{item.text}</span>

                    <Button className="mt-6">{item.buttonText}</Button>
                    <div className="absolute right-[-111px] bottom-[-46px] md:right-[-228px] ">
                      <Image width={128} height={158} src={item.image} />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </main>
  );
}

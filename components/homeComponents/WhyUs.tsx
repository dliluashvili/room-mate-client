import React from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "../../@/components/ui/carousel";
import BankIcon from "../../public/newImages/bank.svg";
import Image from "next/image";

import { useMediaQuery } from "react-responsive";

const data = [
  {
    header: "სათაური",
    text: "შემთხვევითად გენერირებული ტექსტი ეხმარება დიზაინერებს და ტიპოგრაფიული ნაწარმის",
    image: BankIcon,
    buttonText: "ღილაკი",
  },
  {
    header: "სათაური",
    text: "შემთხვევითად გენერირებული ტექსტი ეხმარება დიზაინერებს და ტიპოგრაფიული ნაწარმის",
    image: BankIcon,
    buttonText: "ღილაკი",
  },
  {
    header: "სათაური",
    text: "შემთხვევითად გენერირებული ტექსტი ეხმარება დიზაინერებს და ტიპოგრაფიული ნაწარმის",
    image: BankIcon,
    buttonText: "ღილაკი",
  },
  {
    header: "სათაური",
    text: "შემთხვევითად გენერირებული ტექსტი ეხმარება დიზაინერებს და ტიპოგრაფიული ნაწარმის",
    image: BankIcon,
    buttonText: "ღილაკი",
  },
];

export default function WhyUs() {
  const media = useMediaQuery({ query: "(max-width: 768px)" });
  return (
    <main className="w-full flex flex-col bg-[#F2F5FF] p-6 md:px-24 items-start md:py-12 md:flex-row md:items-center">
      <div className="flex flex-col items-start md:w-1/2">
        <h1 className="text-2xl text-[#484848] md:text-3xl">რატომ ჩვენთან</h1>
        <h2 className="mt-2 text-xs text-[#484848] text-left md:text-base md:mt-4">
          შემთხვევითად გენერირებული ტექსტი ეხმარება დიზაინერებს
        </h2>
      </div>

      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full mt-6 p-0 md:hidden"
      >
        <CarouselContent className="pr-10 md:pr-16">
          {data.map((item, index) => (
            <CarouselItem key={index} className="w-full md:w-1/2">
              <div className="w-full pl-4 py-4 pr-8 flex flex-col items-start rounded-xl bg-[#c0dbfc]">
                <Image src={BankIcon} alt="Bank Icon" width={32} height={32} />
                <span className="text-[18px] font-semibold mt-4">
                  {item.header}
                </span>
                <span className="text-xs mt-2">{item.text}</span>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <div className="w-1/2  grid-cols-2 gap-6 hidden md:grid ">
        {data.map((item, index) => (
          <div
            className="py-8 pl-8 pr-14 bg-[#fff] rounded-xl flex flex-col items-start"
            key={index}
          >
            <Image src={BankIcon} alt="Bank Icon" width={32} height={32} />
            <h1 className="mt-6 text-left">{item.header}</h1>
            <h2 className="mt-2 text-left">{item.text}</h2>
          </div>
        ))}
      </div>
    </main>
  );
}

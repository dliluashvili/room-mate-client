import React from "react";
import FirstBG from "../../public/newImages/firstBG.svg";
import SecondBG from "../../public/newImages/secondBG.svg";
import { Button } from "../../@/components/ui/button";
import { useMediaQuery } from "react-responsive";
import Image from "next/image";

export default function Partners() {
  const media = useMediaQuery({ query: "(max-width: 768px)" });
  return (
    <main className="w-full flex flex-col px-6 mt-12 md:px-24 md:flex-row gap-4 ">
      <div
        className="w-full h-60 rounded-xl relative mt-4 md:bg-[#f2f5ff] md:h-full md:w-[90%] "
        style={{
          backgroundImage: media ? `url(${FirstBG.src})` : "none",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "50%",
        }}
      >
        <div className="absolute inset-0 bg-[#5e666ebf] bg-opacity-50 rounded-xl   p-10 md:relative md:bg-[#f2f5ff] flex flex-row justify-between items-center md:pl-12 md:py-4 md:pr-4">
          <div className="md:w-1/2 flex flex-col items-start justify-center md:pr-14 overflow-hidden   ">
            <h1 className="z-50  text-[#fff] md:text-[#484848] md:text-2xl  font-semibold">
              ოთახის მეზობელი
            </h1>
            <p className="text-xs z-50 mt-4 text-[#fff] md:text-[#484848] md:text-base  ">
              შემთხვევითადგენერირებული ტექსტი ეხმარება დიზაინერებს და
              ტიპოგრაფიული ნაწარმის
            </p>
            <Button className="text-xs mt-7  lg:text-[14px] ">
              გახდი ჩვენი პარტნიორი
            </Button>
          </div>

          <div className="w-1/2 hidden md:block">
            <Image src={FirstBG} layout="responsive" objectFit="cover" />
          </div>
        </div>
      </div>
      <div
        className="w-full h-60 rounded-xl relative mt-4 md:bg-[#f2f5ff] md:h-full  md:w-[90%] "
        style={{
          backgroundImage: media ? `url(${SecondBG.src})` : "none",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "50%",
        }}
      >
        <div className="absolute inset-0 bg-[#5e666ebf] bg-opacity-50 rounded-xl  p-10 md:relative md:bg-[#f2f5ff] flex flex-row justify-between items-center md:pl-12 md:py-4 md:pr-4">
          <div className="md:w-1/2  flex flex-col items-start justify-center md:pr-14  overflow-hidden ">
            <h1 className="z-50  text-[#fff] md:text-[#484848] md:text-2xl   font-semibold">
              ოთახის მეზობელი
            </h1>
            <p className="text-xs z-50 mt-4 text-[#fff] md:text-[#484848] md:text-base overflow-auto ">
              შემთხვევითადგენერირებული ტექსტი ეხმარება დიზაინერებს და
              ტიპოგრაფიული ნაწარმის
            </p>
            <Button className="text-xs mt-7  lg:text-[14px] ">
              გახდი ჩვენი პარტნიორი
            </Button>
          </div>
          <div className="w-1/2 hidden md:block">
            <Image src={SecondBG} layout="responsive" objectFit="cover" />
          </div>
        </div>
      </div>
    </main>
  );
}

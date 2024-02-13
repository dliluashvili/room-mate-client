import React from "react";
import FirstBG from "../../public/newImages/firstBG.svg";
import SecondBG from "../../public/newImages/secondBG.svg";
import { Button } from "../../@/components/ui/button";
import { useMediaQuery } from "react-responsive";
import Image from "next/image";

export default function Partners() {
  const media = useMediaQuery({ query: "(max-width: 1280px)" });
  return (
    <main className="w-full flex flex-col md:flex-row px-6 mt-12 sm:px-16 md:px-20 lg:px-24 xl:px-24  xl:flex-row md:gap-10 ">
      <div
        className="w-full h-60 rounded-xl relative mt-4 xl:bg-[#f2f5ff] xl:h-full xl:w-[90%] "
        style={{
          backgroundImage: media ? `url(${FirstBG.src})` : "none",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "50%",
        }}
      >
        <div className="absolute inset-0 bg-[#5e666ebf] bg-opacity-50 rounded-xl   p-10 xl:relative xl:bg-[#f2f5ff] flex flex-row justify-between items-center xl:pl-12 xl:py-4 xl:pr-4">
          <div className="xl:w-1/2 flex flex-col items-start justify-center xl:pr-14 overflow-hidden   ">
            <h1 className="z-50  text-[#fff] xl:text-[#484848] xl:text-2xl  font-semibold">
              ოთახის მეზობელი
            </h1>
            <p className="text-xs z-50 mt-4 text-[#fff] xl:text-[#484848] xl:text-base  ">
              შემთხვევითადგენერირებული ტექსტი ეხმარება დიზაინერებს და
              ტიპოგრაფიული ნაწარმის
            </p>
            <Button className="text-xs mt-7  xl:text-[14px] ">
              გახდი ჩვენი პარტნიორი
            </Button>
          </div>

          <div className="w-1/2 hidden xl:block">
            <Image src={FirstBG} layout="responsive" objectFit="cover" />
          </div>
        </div>
      </div>
      <div
        className="w-full h-60 rounded-xl relative mt-4 xl:bg-[#f2f5ff] xl:h-full  xl:w-[90%] "
        style={{
          backgroundImage: media ? `url(${SecondBG.src})` : "none",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "50%",
        }}
      >
        <div className="absolute inset-0 bg-[#5e666ebf] bg-opacity-50 rounded-xl  p-10 xl:relative xl:bg-[#f2f5ff] flex flex-row justify-between items-center xl:pl-12 xl:py-4 xl:pr-4">
          <div className="xl:w-1/2  flex flex-col items-start justify-center xl:pr-14  overflow-hidden ">
            <h1 className="z-50  text-[#fff] xl:text-[#484848] xl:text-2xl   font-semibold">
              ოთახის მეზობელი
            </h1>
            <p className="text-xs z-50 mt-4 text-[#fff] xl:text-[#484848] xl:text-base overflow-auto ">
              შემთხვევითადგენერირებული ტექსტი ეხმარება დიზაინერებს და
              ტიპოგრაფიული ნაწარმის
            </p>
            <Button className="text-xs mt-7  xl:text-[14px] ">
              გახდი ჩვენი პარტნიორი
            </Button>
          </div>
          <div className="w-1/2 hidden xl:block">
            <Image src={SecondBG} layout="responsive" objectFit="cover" />
          </div>
        </div>
      </div>
    </main>
  );
}

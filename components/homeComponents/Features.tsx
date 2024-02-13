import React from "react";
import BankIcon from "../../public/newImages/bank.svg";
import RateStar from "../../public/newImages/rate-star.svg";
import RateStars from "../../public/newImages/rate-stars.svg";
import Image from "next/image";
import { useMediaQuery } from "react-responsive";

export default function Features() {
  const media = useMediaQuery({ query: "(max-width: 1024px)" });
  return (
    <>
      <main className="w-full flex justify-between px-6 gap-x-14 mt-12 sm:px-16 md:px-20 lg:grid  lg:grid-flow-col  lg:grid-cols-4 lg:gap-x-20 lg:mt-24 lg:px-24">
        <div className="flex flex-col items-center w-16 lg:w-full lg:items-start">
          <Image src={BankIcon} alt="Bank Icon" width={32} height={32} />
          <div className="flex flex-col mt-4">
            <span className="text-xs break-words text-center text-[#838cac] lg:text-[#484848] lg:text-lg lg:text-left lg:font-semibold">
              {media ? "ოთახის მეზობელი" : "იპოვე ოთახის მეზობელი"}
            </span>
            <p className="hidden lg:block text-[#484848] text-base font-normal mt-2">
              შეარჩიე სასურველი ბინა და გამოიყენე რუმმეითის პლატფორმა ბინის
              მეპატრონესთან მოლაპარაკებისთვის
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center w-16 lg:w-full lg:items-start">
          <Image src={BankIcon} alt="Bank Icon" width={32} height={32} />
          <div className="flex flex-col mt-4">
            <span className="text-xs break-words text-center text-[#838cac] lg:text-[#484848] lg:text-lg lg:text-left lg:font-semibold">
              {media ? "იპოვე" : "იპოვე ხელმისაწვდომი ბინა"}
            </span>
            <p className="hidden lg:block text-[#484848] text-base mt-2">
              მოგვწერე ნებისმიერ დროს პრობლემის არსებობის შემთხვევაში
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center w-16 lg:w-full lg:items-start">
          <Image src={BankIcon} alt="Bank Icon" width={32} height={32} />
          <div className="flex flex-col mt-4">
            <span className="text-xs break-words text-center text-[#838cac] lg:text-[#484848] lg:text-lg lg:text-left lg:font-semibold">
              {media ? "24/7" : "24/7 მხარდაჭერა"}
            </span>
            <p className="hidden lg:block text-[#484848] text-base mt-2">
              მოგვწერე ნებისმიერ დროს პრობლემის არსებობის შემთხვევაში
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center w-16 lg:w-full lg:items-start">
          <div
            style={{
              height: media ? "32px" : "32px",
              width: media ? "32px" : "120px",
            }}
            className="relative"
          >
            <Image
              src={media ? RateStar : RateStars}
              alt="Bank Icon"
              layout="fill"
              objectFit="contain"
            />
          </div>
          <div className="flex flex-col mt-4">
            <span className="text-xs break-words text-center text-[#838cac] lg:text-[#484848] lg:text-lg lg:text-left lg:font-semibold">
              5.9
            </span>
            <p className="hidden lg:block text-[#484848] text-base mt-2">
              5000-მდე ადამიანი უკვე იყენებს ჩვენს პლატფორმას წარმატებით
            </p>
          </div>
        </div>
      </main>
    </>
  );
}

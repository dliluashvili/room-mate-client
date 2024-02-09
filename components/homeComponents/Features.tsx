import React from "react";
import BankIcon from "../../public/newImages/bank.svg";
import RateStar from "../../public/newImages/rate-star.svg";
import RateStars from "../../public/newImages/rate-stars.svg";
import Image from "next/image";
import { useMediaQuery } from "react-responsive";

export default function Features() {
  const media = useMediaQuery({ query: "(max-width: 768px)" });
  return (
    <>
      <main className="w-full flex justify-between   md:grid  md:grid-flow-col  md:grid-cols-4 gap-x-14  md:gap-x-20 mt-12 md:mt-24">
        <div className="flex flex-col items-center w-16 md:w-full md:items-start">
          <Image src={BankIcon} alt="Bank Icon" width={32} height={32} />
          <div className="flex flex-col mt-4">
            <span className="text-xs break-words text-center text-[#838cac] md:text-[#484848] md:text-lg md:text-left md:font-semibold">
              {media ? "ოთახის მეზობელი" : "იპოვე ოთახის მეზობელი"}
            </span>
            <p className="hidden md:block text-[#484848] text-base font-normal mt-2">
              შეარჩიე სასურველი ბინა და გამოიყენე რუმმეითის პლატფორმა ბინის
              მეპატრონესთან მოლაპარაკებისთვის
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center w-16 md:w-full md:items-start">
          <Image src={BankIcon} alt="Bank Icon" width={32} height={32} />
          <div className="flex flex-col mt-4">
            <span className="text-xs break-words text-center text-[#838cac] md:text-[#484848] md:text-lg md:text-left md:font-semibold">
              {media ? "იპოვე" : "იპოვე ხელმისაწვდომი ბინა"}
            </span>
            <p className="hidden md:block text-[#484848] text-base mt-2">
              მოგვწერე ნებისმიერ დროს პრობლემის არსებობის შემთხვევაში
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center w-16 md:w-full md:items-start">
          <Image src={BankIcon} alt="Bank Icon" width={32} height={32} />
          <div className="flex flex-col mt-4">
            <span className="text-xs break-words text-center text-[#838cac] md:text-[#484848] md:text-lg md:text-left md:font-semibold">
              {media ? "24/7" : "24/7 მხარდაჭერა"}
            </span>
            <p className="hidden md:block text-[#484848] text-base mt-2">
              მოგვწერე ნებისმიერ დროს პრობლემის არსებობის შემთხვევაში
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center w-16 md:w-full md:items-start">
          <Image
            src={media ? RateStar : RateStars}
            alt="Bank Icon"
            width={media ? 32 : 120}
            height={media ? 32 : 20}
          />
          <div className="flex flex-col mt-4">
            <span className="text-xs break-words text-center text-[#838cac] md:text-[#484848] md:text-lg md:text-left md:font-semibold">
              5.9
            </span>
            <p className="hidden md:block text-[#484848] text-base mt-2">
              5000-მდე ადამიანი უკვე იყენებს ჩვენს პლატფორმას წარმატებით
            </p>
          </div>
        </div>
      </main>
    </>
  );
}

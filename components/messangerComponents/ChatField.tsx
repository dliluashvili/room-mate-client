import Image from "next/image";
import React from "react";
import TestAvatar from "../../public/newImages/testAvatar.svg";
import More from "../../public/newImages/more.svg";
import Send from "../../public/newImages/send.svg";

export default function ChatField({ user, request }) {
  return (
    <section className="w-full bg-[#FFFFFF]  hidden ml-6 md:block rounded-md border-b-2  border-[red] ">
      <div className="flex flex-row w-full justify-between items-center pt-4 pb-10 px-6 shadow-md">
        <div className="flex flex-row items-center">
          <Image src={TestAvatar} alt="123" width={40} height={40} />
          <div className="flex flex-col ml-6 justify-between">
            <span>{user}</span>
            <span>active now</span>
          </div>
        </div>
        <div className="h-full flex items-start justify-start">
          <Image
            src={More}
            alt="123"
            width={24}
            height={24}
            className="cursor-pointer"
          />
        </div>
      </div>

      {!request ? (
        <div className="w-full h-full ">
          <div className="flex flex-col pt-5 pb-4 px-4 w-full">
            <span className="w-[300px] text-xs mb-5">
              შემთხვევითად გენერირებული ტექსტი ეხმარება დიზაინერებს და
              ტიპოგრაფიული ნაწარმის შემთხვევითად გენერირებული ტექსტი
            </span>
            <textarea className="border-[#838CAC] border focus:outline-none rounded-md h-24 pl-1 text-md pt-1" />
            <div className="w-full flex flex-row justify-end mt-6 cursor-pointer">
              <Image src={Send} width={24} height={24} alt="send" />
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full  bg-[red]  flex flex-col justify-end">
          <div className="w-full h-[120px]   bg-[#838CAC]">
            acceddddddddddddddpt
          </div>
        </div>
      )}
    </section>
  );
}

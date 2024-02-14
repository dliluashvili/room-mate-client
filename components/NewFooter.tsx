import React from "react";
import FooterLogo from "../public/newImages/footer-logo.svg";
import Image from "next/image";
import FooterPhone from "../public/newImages/footer-phone.svg";
import FooterLiveChat from "../public/newImages/footer-liveChat.svg";
import Footeremail from "../public/newImages/footer-email.svg";
import FooterMessanger from "../public/newImages/footer-messanger.svg";
import Facebook from "../public/newImages/social-fb.svg";
import Instagram from "../public/newImages/social-instagram.svg";
import Whatsapp from "../public/newImages/social-whatsapp.svg";
import Linkedin from "../public/newImages/social-linkedin.svg";
import Visa from "../public/newImages/Visa.svg";
import MasterCard from "../public/newImages/Mastercard.svg";
import Paypal from "../public/newImages/PayPal.svg";

export default function NewFooter() {
  return (
    <main className="flex flex-col w-full h-full pt-12">
      <div className="flex flex-col px-7 sm:px-16 md:px-20 md:flex-row md:justify-between md:items-start">
        <div>
          <div className=" w-60 h-10  relative">
            <Image src={FooterLogo} layout="fill" objectFit="cover" />
          </div>
        </div>
        <div className="flex flex-col gap-y-4  mt-8 md:mt-0">
          <p className="text-xs font-semibold ">მთავარი</p>
          <div className="grid lg:grid-cols-2 gap-y-4 lg:gap-x-20">
            <p className="text-xs">იპოვე ოთახის მეზობელი</p>
            <p className="text-xs">იპოვე ბინა</p>
            <p className="text-xs">გახდი ჩვენი პარტნიორი</p>
            <p className="text-xs">ხშირად დასმული შეკითხვები</p>
            <p className="text-xs">როგორ მუშაობს</p>
          </div>
        </div>
        <div className="flex flex-col mt-8 md:mt-0 ">
          <h1 className="font-semibold text-xs">კონტაქტი</h1>
          <div className="grid grid-cols-2  gap-4 mt-4 md:grid-cols-1 ">
            <div className="py-3 pl-2  bg-[#F2F5FF] rounded-lg flex flex-row items-center">
              <Image src={FooterPhone} width={16} height={16} />
              <p className="ml-2 text-xs">555 12 22 23</p>
            </div>
            <div className="py-3 pl-2  bg-[#F2F5FF] rounded-lg flex flex-row items-center">
              <Image src={Footeremail} width={16} height={16} />
              <p className="ml-2 text-xs">info@roommate.ge</p>
            </div>
            <div className="py-3 pl-2  bg-[#F2F5FF] rounded-lg flex flex-row items-center">
              <Image src={FooterMessanger} width={16} height={16} />
              <p className="ml-2 text-xs">roommate</p>
            </div>
            <div className="py-3 pl-2  bg-[#F2F5FF] rounded-lg flex flex-row items-center">
              <Image src={FooterLiveChat} width={16} height={16} />
              <p className="ml-2 text-xs">live chat</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row">
        <div className="flex flex-col mt-8">
          <h1 className="text-xs font-semibold lg:hidden">გამოგვყევით</h1>
          <div className="flex flex-row mt-4 gap-x-6">
            <Image src={Facebook} width={32} height={32} />
            <Image src={Instagram} width={32} height={32} />
            <Image src={Whatsapp} width={32} height={32} />
            <Image src={Linkedin} width={32} height={32} />
          </div>
        </div>
        <div className="h-[1px] w-full bg-[#7D7D7D] mt-8 px-7 lg:hidden "></div>
        <div className="mt-3  flex flex-row justify-between items-center ">
          <p className="text-xs font-bold">გადახდის მეთოდი:</p>
          <div className="flex flex-row gap-x-2">
            <Image src={Visa} width={34} height={24} />
            <Image src={MasterCard} width={34} height={24} />
            <Image src={Paypal} width={34} height={24} />
          </div>
        </div>
      </div>
      <div className="bg-[#F2F5FF] px-7 flex flex-row  mt-4 py-4 items-center justify-around sm:px-16 md:px-20 ">
        <p className=" text-[8px]">Copyrighyt 2022</p>
        <div className="w-[1px] h-3 bg-[#7D7D7D]"></div>
        <p className=" text-[8px]">წესები და პირობები </p>
        <div className="w-[1px] h-3 bg-[#7D7D7D]"></div>
        <p className=" text-[8px]">კონფიდენციალურობის პოლიტიკა </p>
      </div>
    </main>
  );
}

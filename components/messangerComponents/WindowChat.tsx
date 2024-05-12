import TestAvatar from "../../public/newImages/testAvatar.svg";
import Send from "../../public/newImages/send.svg";
import CloseCircle from "../../public/newImages/close-circle.svg";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import { useMediaQuery } from "react-responsive";

export default function WindowChat({ setIsOpen, name, id }) {
  const ref = useRef();
  const media = useMediaQuery({ maxWidth: 768 });

  useEffect(() => {
    if (ref.current && media) {
      disableBodyScroll(ref.current);
    }
  }, [setIsOpen]);

  const sendMessage = () => {};

  return (
    <div
      ref={ref}
      className="w-full h-full md:w-[375px] md:h-[415px] right-0 fixed bottom-0 md:right-20 bg-[#FFFFFF] flex  flex-col  border z-50 rounded-lg shadow-md"
    >
      <div className="flex flex-row w-full justify-between items-center p-6  shadow-md">
        <div className="flex flex-row w-full items-center justify-between">
          <div className="w-full flex flex-row  items-center justify-start">
            <Image src={TestAvatar} alt="123" width={40} height={40} />
            <div className="flex flex-col ml-6 justify-between">
              <span>{name}</span>
            </div>
          </div>
          <div className="h-full flex items-start justify-between">
            <Image
              onClick={() => {
                setIsOpen(false), enableBodyScroll(ref.current);
              }}
              src={CloseCircle}
              alt="123"
              width={32}
              height={32}
              className="cursor-pointer"
            />
          </div>
        </div>
      </div>
      <div className="w-full h-full px-6 "></div>

      <div className=" h-auto w-full flex flex-col justify-end items-end ">
        <div className="flex flex-col pt-5 pb-4 px-4 w-full h-full justify-end  ">
          <span className="w-[300px] text-xs mb-5">
            შემთხვევითად გენერირებული ტექსტი ეხმარება დიზაინერებს და
            ტიპოგრაფიული ნაწარმის შემთხვევითად გენერირებული ტექსტი
          </span>
          <textarea className="border-[#838CAC] border focus:outline-none rounded-md h-24 pl-1 text-md pt-1" />
          <div
            className="w-full flex flex-row justify-end mt-6 cursor-pointer"
            onClick={sendMessage}
          >
            <Image src={Send} width={24} height={24} alt="send" />
          </div>
        </div>
      </div>
    </div>
  );
}

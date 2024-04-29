import Image from "next/image";
import TestAvatar from "../../public/newImages/testAvatar.svg";
import Send from "../../public/newImages/send.svg";

export default function ChatField({ user, request }) {
  return (
    <section className="w-full flex-col  bg-[#FFFFFF] hidden ml-6 md:flex  rounded-md border-b-4 border-[gray] overflow-hidden">
      <div className="flex flex-row w-full justify-between items-center pt-4 pb-10 px-6 shadow-md">
        <div className="flex flex-row items-center">
          <Image src={TestAvatar} alt="123" width={40} height={40} />
          <div className="flex flex-col ml-6 justify-between">
            <span>{user}</span>
            <span>active now</span>
          </div>
        </div>
        
      </div>

      {!request ? (
        <div className="flex flex-col pt-5 pb-4 px-4 w-full h-full justify-end  ">
          <div className="flex w-full flex-row h-auto items-center px-6 py-4">
          <input
            placeholder="send message"
            className="w-full text-[14px] py-2 px-3 border border-[gray] rounded-3xl mr-2"
          />
          <Image
            src={Send}
            width={24}
            height={24}
            alt="!23"
            className="cursor-pointer"
          />
        </div>
        </div>
      ) : (
        <div className="w-full h-full flex flex-col justify-end p-4 ">
          <div className="w-full    bg-[#838CAC] rounded-lg flex  md:flex-col lg:flex-row items-center justify-between gap-14 p-10">
            <span className="text-[#FFFFFF]">
              if you reply Mako will be able to call you and see information
              such as you active statusand when you have read messages.
            </span>
            <div className=" flex gap-4 flex-row  items-center">
              <button className="py-3 px-14 bg-white rounded-xl text-[#838CAC]">
                accept
              </button>
              <button className="py-3 px-14 text-[#FFFFFF] border border-[#FFFFFF] rounded-xl">
                reject
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

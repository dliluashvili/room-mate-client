import React, { useState } from "react";
import Avatar from "../../public/newImages/testAvatar.svg";
import Image from "next/image";
import { useMediaQuery } from "react-responsive";


const data = [
  {
    img: Avatar,
    name: "Lado Asambadze",
    lastMessage: "last message...",
  },
  {
    img: Avatar,
    name: "Zura tsintsadze",
    lastMessage: "last message...",
    message: 1,
  },
  {
    img: Avatar,
    name: "Marika Khantadze",
    lastMessage: "last message...",
  },
  {
    img: Avatar,
    name: "Zura tsintsadze",
    lastMessage: "last message...",
    message: 5,
  },
  {
    img: Avatar,
    name: "Zura tsintsadze",
    lastMessage: "last message...",
    message: 1,
  },
  {
    img: Avatar,
    name: "Marika Khantadze",
    lastMessage: "last message...",
  },
  {
    img: Avatar,
    name: "Zura tsintsadze",
    lastMessage: "last message...",
    message: 5,
  },
  {
    img: Avatar,
    name: "Zura tsintsadze",
    lastMessage: "last message...",
    message: 1,
  },
  {
    img: Avatar,
    name: "Marika Khantadze",
    lastMessage: "last message...",
  },
  {
    img: Avatar,
    name: "Zura tsintsadze",
    lastMessage: "last message...",
    message: 5,
  },
  {
    img: Avatar,
    name: "Marika Khantadze",
    lastMessage: "last message...",
  },
  {
    img: Avatar,
    name: "Zura tsintsadze",
    lastMessage: "last message...",
    message: 5,
  },
  {
    img: Avatar,
    name: "Marika Khantadze",
    lastMessage: "last message...",
  },
  {
    img: Avatar,
    name: "Zura tsintsadze",
    lastMessage: "last message...",
    message: 5,
  },
  {
    img: Avatar,
    name: "Marika Khantadze",
    lastMessage: "last message...",
  },
  {
    img: Avatar,
    name: "zzzzzzzzzzzzzzzzz",
    lastMessage: "last message...",
    message: 52,
  },
  {
    img: Avatar,
    name: "Zura tsintsadze",
    lastMessage: "last message...",
    message: 5,
  },
  {
    img: Avatar,
    name: "Marika Khantadze",
    lastMessage: "last message...",
  },
  {
    img: Avatar,
    name: "oooooooooo",
    lastMessage: "last message...",
    message: 33,
  },
];

export default function List({ setUser, request, setRequest, setMobileOpen }) {
  const [search, setSearch] = useState("");
  const media = useMediaQuery({ query: "(max-width: 768px)" });

  return (
    <section className="flex flex-col w-full md:w-[100px]   lg:w-[400px] h-full items-start  rounded-md overflow-hidden  bg-[#FFFFFF] border-b-4 border-[gray]">
      <div className="block  w-full">
        <div className="flex relative   px-6 py-4 flex-row items-center justify-center md:hidden lg:block w-full">
          <input
            onChange={(e) => setSearch(e.target.value)}
            placeholder="search"
            className=" border border-[#838CAC] h-auto w-full rounded-[35px] py-2 px-5 "
          />
        </div>
        <div className="flex flex-row md:flex-col lg:flex-row items-center gap-6 justify-start px-6 py-2">
          <span
            className=" cursor-pointer"
            style={{ color: !request ? "#0A7CFF" : "#838CAC" }}
            onClick={() => setRequest(false)}
          >
            chat
          </span>
          <span
            className=" cursor-pointer"
            style={{ color: request ? "#0A7CFF" : "#838CAC" }}
            onClick={() => setRequest(true)}
          >
            request
          </span>
        </div>
        <div className="h-[1px] w-full bg-[#E3E3E3]"></div>
      </div>
      <div className="w-full  h-full overflow-auto">
        {data

          .filter((item) =>
            item.name.toLowerCase().includes(search.toLowerCase())
          )
          .map((item, index) => (
            <div
              onClick={() => {
                if (media) {
                  setMobileOpen(true);
                  setUser(item.name);
                } else {
                  setUser(item.name);
                }
              }}
              key={index}
              className="flex flex-row   cursor-pointer  items-center justify-center lg:justify-between px-6 md:p-0 py-2  lg:py-2 lg:px-4 border-b-2 border-[#E3E3E3] w-full"
            >
              <div className="w-full h-full relative overflow-auto flex flex-row justify-start md:justify-center md:py-2 lg:py-0  lg:justify-start">
                <Image
                  src={item.img}
                  width={48}
                  height={48}
                  className="rounded-full"
                  alt="123"
                />
                {item.message > 0 && (
                  <div className="bg-[#DB0505] left-12 absolute  hidden md:flex lg:hidden  text-white text-[10px] rounded-full w-5 h-5  items-center justify-center">
                    {item.message}
                  </div>
                )}
                <div className=" flex-col h-full   ml-6 flex md:hidden lg:flex">
                  <span className="text-[#484848] font-semibold   text-[14px]">
                    {item.name}
                  </span>
                  <span className="text-[#838CAC] text-xs mt-1">
                    {item.lastMessage}
                  </span>
                </div>
              </div>
              {item.message && (
                <div className="bg-[#DB0505]  flex md:hidden lg:flex  rounded-full  w-5 h-5  items-center justify-center">
                  <span className="text-white text-[10px] text-center">
                    {item.message}
                  </span>
                </div>
              )}
            </div>
          ))}
      </div>
    </section>
  );
}

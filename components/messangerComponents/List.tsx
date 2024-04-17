import React, { useState } from "react";

import Avatar from "../../public/newImages/testAvatar.svg";
import SearchLoop from "../../public/newImages/search-normal.svg";
import Image from "next/image";
import { BaseInput } from "../../@/components/ui/input";
import { useMediaQuery } from "react-responsive";
import { request } from "http";

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
    message: 522,
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
    message: 333,
  },
];

export default function List({ setUser, request, setRequest, setMobileOpen }) {
  const [search, setSearch] = useState("");
  const media = useMediaQuery({ query: "(max-width: 768px)" });

  return (
    <section className="flex flex-col w-full md:w-[100px]   lg:w-[400px] h-full items-start  rounded-md overflow-hidden  bg-[#FFFFFF] border-b-4 border-[gray]">
      
        <div className="block  w-full">
          <div className="flex p-4 flex-row items-center justify-center md:hidden lg:block w-full">
            <BaseInput
              onChange={(e) => setSearch(e.target.value)}
              placeholder="search"
              className=" rounded-[35px] py-4 px-5"
            />
          </div>
          <div className="flex flex-row md:flex-col lg:flex-row items-center gap-6 justify-start px-4 py-2">
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
                className="flex flex-row  py-2 cursor-pointer  items-center justify-center lg:justify-between pl-6  pr-16 md:p-0 py-2  lg:py-2 lg:px-4 border-b-2 border-[#E3E3E3] w-full"
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
                    <span className="text-[#484848] font-semibold ">
                      {item.name}
                    </span>
                    <span>{item.lastMessage}</span>
                  </div>
                </div>
                {item.message && (
                  <div className="bg-[#DB0505]  flex md:hidden lg:flex text-white text-[10px] rounded-full w-5 h-5  items-center justify-center">
                    {item.message}
                  </div>
                )}
              </div>
            ))}
        </div>
   
    </section>
  );
}

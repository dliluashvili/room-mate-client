import React from "react";
import { useMediaQuery } from "react-responsive";
import BannerDesktop from "../../public/newImages/banner-desktop.svg";
import Image from "next/image";

export default function Banner() {
  const media = useMediaQuery({ query: "(max-width: 768px)" });
  return (
    <>
      <main className="flex flex-col w-full">
        <Image src={BannerDesktop} alt="Page Banner" />
      </main>
    </>
  );
}

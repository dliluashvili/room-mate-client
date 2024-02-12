import React from "react";
import NewHeader from "../components/NewHeader";
import Banner from "../components/homeComponents/Banner";
import Features from "../components/homeComponents/Features";
import NewsCarousel from "../components/homeComponents/NewsCarousel";
import Contact from "../components/homeComponents/Contact";
import WhyUs from "../components/homeComponents/WhyUs";

export default function home() {
  return (
    <>
      <NewHeader />
      <main className="flex flex-col w-full min-h-screen  py-4 bg-mainBg md:py-6 ">
        {/* <Banner /> */}
        <Features />
        <NewsCarousel />
        <WhyUs />
        <Contact />
      </main>
    </>
  );
}

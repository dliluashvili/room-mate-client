import React from "react";
import NewHeader from "../components/NewHeader";
import Banner from "../components/homeComponents/Banner";
import Features from "../components/homeComponents/Features";
import NewsCarousel from "../components/homeComponents/NewsCarousel";
import Contact from "../components/homeComponents/Contact";

export default function home() {
  return (
    <>
      <NewHeader />
      <main className="flex flex-col w-full min-h-screen px-6 py-4 bg-mainBg md:py-6 md:px-24">
        <Banner />
        <Features />
        <NewsCarousel />
        <Contact />
      </main>
    </>
  );
}

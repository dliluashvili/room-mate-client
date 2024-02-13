import React from "react";
import NewHeader from "../components/NewHeader";
import Banner from "../components/homeComponents/Banner";
import Features from "../components/homeComponents/Features";
import NewsCarousel from "../components/homeComponents/NewsCarousel";
import Contact from "../components/homeComponents/Contact";
import WhyUs from "../components/homeComponents/WhyUs";
import Apartments from "../components/homeComponents/Apartments";
import axios from "axios";
import Partners from "../components/homeComponents/Partners";

export async function getServerSideProps() {
  const response = await axios.get("https://api.roommategeorgia.ge/flats");
  console.log(response.data);
  return { props: { flats: response.data } };
}

export default function Home({ flats }) {
  return (
    <>
      <NewHeader />
      <main className="flex flex-col w-full min-h-screen  py-4 bg-mainBg md:py-6  ">
        <Banner />
        <Features />
        <NewsCarousel />
        <WhyUs />
        <Apartments flats={flats.data} />
        <Partners />
        <Contact />
      </main>
    </>
  );
}

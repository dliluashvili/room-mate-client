import React from "react";
import NewHeader from "../components/NewHeader";
import Banner from "../components/homeComponents/Banner";
import Features from "../components/homeComponents/Features";
import NewsCarousel from "../components/homeComponents/NewsCarousel";
import Contact from "../components/homeComponents/Contact";
import WhyUs from "../components/homeComponents/WhyUs";
import Apartments from "../components/homeComponents/Apartments";
import Partners from "../components/homeComponents/Partners";
import Reviews from "../components/homeComponents/Reviews";
import { AccordionQuestions } from "../components/homeComponents/AccordionQuestions";
import NewFooter from "../components/NewFooter";
import { Flats } from "../services/flats/flats.http";

export async function getServerSideProps(searchParams: any) {
  try {
    const response = await Flats.getFlats({
      page: 1,
      locale: searchParams.locale,
    })
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        console.log({ err });
      });

    return { props: { flats: response } };
  } catch (error) {
    return { props: { errorMessage: error.message } };
  }
}

export default function Home({ flats }) {
  return (
    <>
      <main className="flex  flex-col w-full min-h-screen  pb-4 bg-mainBg md:pb-6">
        <NewHeader />
        <Banner />
        <Features />
        <NewsCarousel />
        <WhyUs />
        <Apartments flats={flats?.data} />
        <Partners />
        <Contact />
        <Reviews />
        <AccordionQuestions />
        <NewFooter />
      </main>
    </>
  );
}

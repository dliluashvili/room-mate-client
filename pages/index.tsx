import React from "react";
import { Flats } from "../services/flats/flats.http";
import dynamic from "next/dynamic";
const NewHeader = dynamic(() => import("../components/NewHeader"));
const Banner = dynamic(() => import("../components/homeComponents/Banner"));
const Features = dynamic(() => import("../components/homeComponents/Features"));
const NewsCarousel = dynamic(
  () => import("../components/homeComponents/NewsCarousel")
);
const Contact = dynamic(() => import("../components/homeComponents/Contact"));
const WhyUs = dynamic(() => import("../components/homeComponents/WhyUs"));
const Apartments = dynamic(
  () => import("../components/homeComponents/Apartments")
);
const Partners = dynamic(() => import("../components/homeComponents/Partners"));
const Reviews = dynamic(() => import("../components/homeComponents/Reviews"));
const AccordionQuestions = dynamic(
  () => import("../components/homeComponents/AccordionQuestions")
);
const NewFooter = dynamic(() => import("../components/NewFooter"));

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
      <main className="flex  flex-col w-full min-h-screen bg-mainBg ">
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

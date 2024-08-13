import React, { useEffect } from "react";
import { store } from "../redux/store";
import { Provider } from "react-redux";
import Head from "next/head";
import "../style/style.scss";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import { SearchProvider } from "../components/pages/search/context/searchContext";
import { HouseSearchProvider } from "../components/pages/houseSearch/houseSearchComponets/houseSearchContext";
import MessengerCustomerChat from "react-messenger-customer-chat";
import { hotjar } from "react-hotjar";
import { ApolloWrapper } from "../providers/apolloProvider";
import TwilioClientWrapper from "../components/TwilioClientWrapper";
import { Toaster } from "../@/components/ui/toaster";
import Facebook from "../components/tracking/Facebook";
import Script from "next/script";

// import { Html } from "next/document";

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    hotjar.initialize(3128732, 6);
  }, []);
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <meta charSet="utf-8" />
        <title>Roommate Georgia</title>
        <meta
          name="description"
          content="იპოვე ოთახის მეზობელი და გაიყავი ბინის ქირა"
          key="description"
        />
        <link rel="icon" href="/imgs/loop-04.png" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/imgs/loop-04.png"
        ></link>
        <meta property="og:title" content="Roommate Georgia" key="og:title" />
        <meta
          property="og:description"
          content="იპოვე ოთახის მეზობელი და
          გაიყავი ბინის ქირა"
          key="og:description"
        />
        <meta
          property="og:image"
          content="https://i.imgur.com/bT3AfXF.png"
          key="og:image"
        />

        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=G-90LQL896FN`}
        />

        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
            
              gtag('config', 'G-90LQL896FN')
          `,
          }}
        />

        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','GTM-586WWRZ6}');
        `}
        </Script>

        {/* <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet"> */}
      </Head>
      <div>
        <noscript
          dangerouslySetInnerHTML={{
            __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-586WWRZ6" height="0" width="0" style="display: none; visibility: hidden;"></iframe>`,
          }}
        />

        <Facebook />
        <MessengerCustomerChat
          pageId="103648229133196"
          appId="1116841412243862"
        />
        <HouseSearchProvider>
          <SearchProvider>
            <Provider store={store}>
              <ApolloWrapper>
                <TwilioClientWrapper>
                  <Facebook />
                  <Component {...pageProps} />

                  <Toaster />
                </TwilioClientWrapper>
              </ApolloWrapper>
            </Provider>
          </SearchProvider>
        </HouseSearchProvider>
      </div>
    </>
  );
}

export default MyApp;

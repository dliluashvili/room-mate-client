import React from "react";
import { store } from "../redux/store";
import { Provider } from "react-redux";
import Head from "next/head";
import "../style/style.scss";
import "react-toastify/dist/ReactToastify.css";
import { SearchProvider } from "../components/pages/search/context/searchContext";
import MessengerCustomerChat from "react-messenger-customer-chat";

// import { Html } from "next/document";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <title>Room Mate</title>

        {/* <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet"> */}
      </Head>
      <div>
        <MessengerCustomerChat
          pageId="103648229133196"
          appId="1116841412243862"
        />
        <SearchProvider>
          <Provider store={store}>
            <Component {...pageProps} />
          </Provider>
        </SearchProvider>
      </div>
    </>
  );
}

export default MyApp;

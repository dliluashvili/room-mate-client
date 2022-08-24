import React from "react";
import { store } from "../redux/store";
import { Provider } from "react-redux";
import Head from "next/head";
import "../style/style.scss";
import "react-toastify/dist/ReactToastify.css";
import { SearchProvider } from "../components/pages/search/context/searchContext";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <title>Room Mate</title>

        {/* <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet"> */}
      </Head>
      <div>
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

import builder from "@builder.io/react";
import type { AppProps } from "next/app";
import Head from "next/head";

import "../styles/index.css";

builder.init("c33bcd23c29e45789677ba9aaaa7ce1d");

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      {/* <DefaultSeo {...SEO} /> */}

      <Head>
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
      </Head>

      <Component {...pageProps} />
    </>
  );
}

export default MyApp;

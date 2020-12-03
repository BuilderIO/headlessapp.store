import type { AppProps } from "next/app";
import Head from "next/head";
// import { DefaultSeo } from "next-seo";

import "../styles/index.css";

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

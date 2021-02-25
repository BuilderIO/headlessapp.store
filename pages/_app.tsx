import builder, { Builder } from "@builder.io/react";
import type { AppProps } from "next/app";
import dynamic from "next/dynamic";
import Head from "next/head";
import { tabsConfig } from "@builder.io/widgets/dist/lib/components/Tabs.config";
import { accordionConfig } from "@builder.io/widgets/dist/lib/components/Accordion.config";

Builder.registerComponent(
  dynamic(() =>
    import("@builder.io/widgets/dist/lib/components/Tabs").then(
      (mod) => mod.TabsComponent
    )
  ),
  tabsConfig
);

Builder.registerComponent(
  dynamic(() =>
    import("@builder.io/widgets/dist/lib/components/Accordion").then(
      (mod) => mod.AccordionComponent
    )
  ),
  accordionConfig
);

Error.stackTraceLimit = 1000;

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

import builder, { Builder, BuilderContent } from '@builder.io/react';
import { accordionConfig } from '@builder.io/widgets/dist/lib/components/Accordion.config';
import { tabsConfig } from '@builder.io/widgets/dist/lib/components/Tabs.config';
import type { AppContext, AppProps } from 'next/app';
import App from 'next/app';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { LayoutContext } from '../context/layout';

import '../styles/tailwind.css';
import '../styles/index.css';

Builder.registerComponent(
  dynamic(() =>
    import('@builder.io/widgets/dist/lib/components/Tabs').then(mod => mod.TabsComponent)
  ),
  tabsConfig
);

Builder.registerComponent(
  dynamic(() =>
    import('@builder.io/widgets/dist/lib/components/Accordion').then(mod => mod.AccordionComponent)
  ),
  accordionConfig
);

Error.stackTraceLimit = 1000;

builder.init('c33bcd23c29e45789677ba9aaaa7ce1d');

type Resolved<PromiseT> = PromiseT extends PromiseLike<infer T> ? T : never;
type MyAppInitialProps = Resolved<ReturnType<typeof MyApp.getInitialProps>>;
type MyAppProps = AppProps & MyAppInitialProps;

function MyApp({ Component, pageProps, layoutProps }: MyAppProps) {
  return (
    <>
      {/* <DefaultSeo {...SEO} /> */}

      <Head>
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
      </Head>

      <LayoutContext.Provider value={layoutProps}>
        <Component {...pageProps} />
      </LayoutContext.Provider>
    </>
  );
}

MyApp.getInitialProps = async (appCtx: AppContext) => {
  const appProps = await App.getInitialProps(appCtx);

  const footerContent: BuilderContent = await builder.get('footer', { url: appCtx.ctx.asPath }).promise();

  const layoutProps = { footerContent };

  return { ...appProps, layoutProps };
};

export default MyApp;

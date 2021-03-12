import React, { ReactNode } from "react";
import builder, { BuilderComponent, BuilderContent } from "@builder.io/react";
import { GetStaticProps } from "next";
import Head from "next/head";
import Navigation from "./Navigation";

type Props = {
  children?: ReactNode;
  title?: string;
  ogImage?: string;
  description?: string;
  hideHeaderAndFooter?: boolean;
  footerContent?: BuilderContent;
};

const Layout = ({
  children,
  title = "HeadlessApp.Store | Blazing fast ecommerce integrations",
  ogImage = "https://headlessapp.store/assets/new-one.png",
  description = "Request early access now",
  hideHeaderAndFooter = false,
  footerContent
}: Props) => (
  <div>
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:type" content="website" />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
    </Head>
    {!hideHeaderAndFooter && (
      <>
        <header>
          <Navigation />
        </header>
      </>
    )}
    {children}
    {!hideHeaderAndFooter && (
      <footer className="p-16 text-center">
        <BuilderComponent content={footerContent} model="footer" />
      </footer>
    )}
  </div>
);

export const getStaticProps: GetStaticProps = async (context: any) => {
  const footerContent: BuilderContent = await builder
    .get("footer", { url: context.resolvedUrl })
    .promise();

  return {
    props: { footerContent },
    revalidate: true,
    notFound: !footerContent
  };
};

export default Layout;

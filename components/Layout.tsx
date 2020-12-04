import React, { ReactNode } from "react";
import Head from "next/head";
import Navigation from "./Navigation";

type Props = {
  children?: ReactNode;
  title?: string;
};

const Layout = ({ children, title = "This is the default title" }: Props) => (
  <div>
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <header className="pt-6 md:pt-8">
      <Navigation />
    </header>
    {children}
  </div>
);

export default Layout;

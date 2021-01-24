import React, { ReactNode } from "react";
import Head from "next/head";
import Navigation from "./Navigation";

type Props = {
  children?: ReactNode;
  title?: string;
  ogImage?: string;
  description?: string;
  hideHeaderAndFooter?: boolean;
};

const Layout = ({
  children,
  title = "HeadlessApp.Store | Blazing fast ecommerce integrations",
  ogImage = "https://headlessapp.store/assets/new-one.png",
  description = "Request early access now",
  hideHeaderAndFooter = false,
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
      <footer className="text-center p-16">
        <div className="text-lg">
          Made with ❤️ by{" "}
          <a
            className="text-link"
            target="_blank"
            rel="nooppener"
            href="https://www.builder.io"
          >
            Builder.io
          </a>
          .
        </div>
        <div className="mt-3">
          Built with{" "}
          <a className="text-link" href="https://www.builder.io">
            Builder.io
          </a>
          ,{" "}
          <a
            className="text-link"
            rel="nooppener"
            target="_blank"
            href="https://github.com/BuilderIO/jsx-lite"
          >
            JSX Lite
          </a>
          ,{" "}
          <a
            className="text-link"
            rel="nooppener"
            target="_blank"
            href="https://github.com/vercel/next.js/"
          >
            Next.js
          </a>
          ,{" "}
          <a
            className="text-link"
            rel="nooppener"
            target="_blank"
            href="https://github.com/tailwindlabs/tailwindcss"
          >
            TailwindCSS
          </a>
          . Hosted by{" "}
          <a
            className="text-link"
            rel="nooppener"
            target="_blank"
            href="https://vercel.com/"
          >
            Vercel
          </a>
        </div>
      </footer>
    )}
  </div>
);

export default Layout;

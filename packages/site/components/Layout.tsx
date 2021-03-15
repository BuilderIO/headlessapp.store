import { BuilderComponent } from '@builder.io/react';
import Head from 'next/head';
import React, { ReactNode } from 'react';
import { LayoutContext } from '../context/layout';
import Navigation from './Navigation';

type Props = {
  children?: ReactNode;
  title?: string;
  ogImage?: string;
  description?: string;
  hideHeaderAndFooter?: boolean;
};

const Layout = ({
  children,
  title = 'HeadlessApp.Store | Blazing fast ecommerce integrations',
  ogImage = 'https://headlessapp.store/assets/new-one.png',
  description = 'Request early access now',
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
      <LayoutContext.Consumer>
        {({ footerContent }) => (
          <footer className="p-16 text-center">
            <BuilderComponent content={footerContent} model="footer" />
          </footer>
        )}
      </LayoutContext.Consumer>
    )}
  </div>
);

export default Layout;

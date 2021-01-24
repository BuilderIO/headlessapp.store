import Image from "next/image";
import Layout from "../components/Layout";

export const Index = () => (
  <Layout hideHeaderAndFooter>
    <div
      style={{ marginLeft: "calc(50% - 50vw)" }}
      className="h-screen w-screen flex items-center justify-center pb-10 bg-dark"
    >
      <div className="m-auto w-11/12 max-w-4xl flex-col flex">
        <Image
          src="/assets/new-one.png"
          width="2490"
          height="1182"
          alt="logo"
        />

        <a
          rel="noreferrer"
          href="mailto:has-invite@builder.io?subject=Please%20add%20me%20to%20the%20waitlist%20for%20HeadlessApp.Store&body=Thanks!"
          className="text-center text-offwhite block mx-auto px-6 py-4 border-offwhite border-2 rounded"
        >
          Request early access
        </a>
        <a
          rel="noreferrer"
          href="mailto:has-partners@builder.io"
          className="text-center text-offwhite block mx-auto px-6 py-4 border-offwhite opacity-50 rounded mt-4"
        >
          Request to be a partner
        </a>
      </div>
    </div>
  </Layout>
);

export default Index;

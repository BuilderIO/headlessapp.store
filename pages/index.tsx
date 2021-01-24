import Image from "next/image";

export const Index = () => (
  <div
    style={{ background: "#0E201A", marginLeft: "calc(50% - 50vw)" }}
    className="h-screen w-screen flex items-center justify-center pb-10"
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
        href="mailto:goheadless@builder.io?subject=Please%20add%20me%20to%20the%20waitlist%20for%20HeadlessApp.Store&body=Thanks!"
        className="text-center text-offwhite block mx-auto px-6 py-4 border-offwhite border-2 rounded"
      >
        Request early access
      </a>
    </div>
  </div>
);

export default Index;

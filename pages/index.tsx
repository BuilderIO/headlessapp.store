import Link from "next/link";
import Layout from "../components/Layout";
import { builder } from "@builder.io/react";
import { GetStaticProps } from "next";

builder.init("c33bcd23c29e45789677ba9aaaa7ce1d");

type AppInfo = {
  data: {
    handle: string;
  };
};

const GridItem = ({ app }: { app: AppInfo }) => {
  const logo = false;
  return (
    <Link href="/components/101">
      <a className="p-8 bg-gray-600 rounded relative shadow group overflow-hidden md:py-16 text-center transition duration-150 ease-in-out">
        <div className="relative z-10">
          <div className="mb-4">
            {logo ? (
              <img
                src=""
                className="inline-block"
                style={{ maxWidth: 200, maxHeight: 50 }}
              />
            ) : null}
          </div>

          <div>
            <h3 className="text-xl leading-7 font-semibold text-gray-100">
              I am a cool component
            </h3>
            <p className="mt-1 text-gray-400 text-sm leading-6">
              Hello there hi
            </p>
          </div>
        </div>
      </a>
    </Link>
  );
};

const IndexPage = ({ data }: { data: AppInfo[] }) => {
  return (
    <Layout title="Home">
      <main className="bg-gray-100 px-6 mt-8">
        <div className="py-8 grid md:grid-cols-2 gap-8 lg:grid-cols-3">
          {data.map((appInfo, i) => (
            <GridItem app={appInfo} key={i} />
          ))}
        </div>
      </main>
    </Layout>
  );
};

// This function gets called at build time on server-side.
// It won't be called on client-side, so you can even do
// direct database queries.
export const getStaticProps: GetStaticProps = async () => {
  try {
    const data = await builder.getAll("app", {
      key: "apps:all",
      fields: "data.image,data.handle,data.title",
    });

    return { props: { data } };
  } catch (err) {
    return { props: { errors: err.message } };
  }
};

export default IndexPage;

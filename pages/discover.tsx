import Link from "next/link";
import Layout from "../components/Layout";
import { builder } from "@builder.io/react";
import { GetStaticProps } from "next";
import { AppInfo } from "../interfaces/app";

const GridItem = ({ app }: { app: AppInfo }) => {
  const logo = app.data.image;
  return (
    <Link href={`/apps/${app.data.handle}`}>
      <a className="p-8 rounded relative shadow group overflow-hidden text-center transition duration-150 ease-in-out bg-white">
        <div className="relative z-10">
          <div className="mb-4">
            {logo ? (
              <img
                src={app.data.image}
                className="object-center object-contain p-6"
                style={{ width: "100%", height: 140 }}
              />
            ) : null}
          </div>

          <div className="mt-12">
            <h3 className="text-xl leading-7 font-semibold ">
              {app.data.title}
            </h3>
          </div>
        </div>
      </a>
    </Link>
  );
};

const IndexPage = ({ data }: { data: AppInfo[] }) => {
  return (
    <Layout title="Home">
      <main className="px-6 mt-8">
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

    return { props: { data: JSON.parse(JSON.stringify(data)) }, revalidate: 1 };
  } catch (err) {
    return { props: { errors: err.message } };
  }
};

export default IndexPage;

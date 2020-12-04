import { GetStaticProps, GetStaticPaths } from "next";

import { User } from "../../interfaces";
import { sampleUserData } from "../../utils/sample-data";
import Layout from "../../components/Layout";

type Props = {
  item?: User;
  errors?: string;
};

const StaticPropsDetail = ({ item, errors }: Props) => {
  if (errors) {
    return (
      <Layout title="Error | Next.js + TypeScript Example">
        <p>
          <span style={{ color: "red" }}>Error:</span> {errors}
        </p>
      </Layout>
    );
  }

  return (
    <Layout
      title={`${
        item ? item.name : "User Detail"
      } | Next.js + TypeScript Example`}
    >
      <main className="bg-gray-50 border-b border-t border-gray-200 px-6 mt-8">
        <div className="p-60 gap-8 text-center">Preview of the component</div>
      </main>
      <nav className="flex flex-col sm:flex-row border-b border-gray-200  overflow-auto lg:justify-center">
        <button className="text-gray-600 py-4 px-6 block hover:text-blue-500 focus:outline-none text-blue-500 border-b-2 font-medium border-blue-500">
          JSX Lite
        </button>
        <button className="text-gray-600 py-4 px-6 block hover:text-blue-500 focus:outline-none">
          Builder
        </button>
        <button className="text-gray-600 py-4 px-6 block hover:text-blue-500 focus:outline-none">
          React
        </button>
        <button className="text-gray-600 py-4 px-6 block hover:text-blue-500 focus:outline-none">
          Vue
        </button>
        <button className="text-gray-600 py-4 px-6 block hover:text-blue-500 focus:outline-none">
          Svelte
        </button>
        <button className="text-gray-600 py-4 px-6 block hover:text-blue-500 focus:outline-none">
          Solid
        </button>
        <button className="text-gray-600 py-4 px-6 block hover:text-blue-500 focus:outline-none">
          Angular
        </button>
        <button className="text-gray-600 py-4 px-6 block hover:text-blue-500 focus:outline-none">
          HTML/CSS/JS
        </button>
        <button className="text-gray-600 py-4 px-6 block hover:text-blue-500 focus:outline-none">
          Figma
        </button>
      </nav>
      <main className="bg-gray-800 border-b border-gray-200 px-6">
        <div className="p-60 grid md:grid-cols-2 gap-8 lg:grid-cols-3">
          {/* Stuff */}
        </div>
      </main>
    </Layout>
  );
};

export default StaticPropsDetail;

export const getStaticPaths: GetStaticPaths = async () => {
  // Get the paths we want to pre-render based on users
  const paths = sampleUserData.map((user) => ({
    params: { id: user.id.toString() },
  }));

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: false };
};

// This function gets called at build time on server-side.
// It won't be called on client-side, so you can even do
// direct database queries.
export const getStaticProps: GetStaticProps = async () => {
  try {
    // By returning { props: item }, the StaticPropsDetail component
    // will receive `item` as a prop at build time
    return { props: { item: true } };
  } catch (err) {
    return { props: { errors: err.message } };
  }
};

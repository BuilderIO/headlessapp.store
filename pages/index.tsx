import Link from "next/link";
import Layout from "../components/Layout";

const IndexPage = () => (
  <Layout title="Home | Next.js + TypeScript Example">
    <h2 className="text-2xl sm:text-5xl md:text-6xl tracking-tight font-extrabold leading-tight text-transparent bg-gradient-to-r from-red-600 via-indigo-600 to-purple-700 bg-clip-text">
      Hello World
    </h2>
  </Layout>
);

export default IndexPage;

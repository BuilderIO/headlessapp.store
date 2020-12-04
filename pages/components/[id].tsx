import { BuilderComponent } from "@builder.io/react";
import {
  componentToAngular,
  componentToBuilder,
  componentToHtml,
  componentToLiquid,
  componentToReact,
  componentToSolid,
  componentToSvelte,
  componentToVue,
  parseJsx,
} from "@jsx-lite/core";
import { GetStaticPaths, GetStaticProps } from "next";
import { useEffect, useState } from "react";
// import MonacoEditor from "react-monaco-editor";
import Layout from "../../components/Layout";
import { User } from "../../interfaces";
import data from "../../utils/example.builder";
import { sampleUserData } from "../../utils/sample-data";

const defaultCode = require("raw-loader!../../content/components/rebuy.lite")
  .default;

type Props = {
  item?: User;
  errors?: string;
};

const StaticPropsDetail = ({ item, errors }: Props) => {
  const [code] = useState(defaultCode);
  const [outputTab] = useState("react");
  const [, setOutput] = useState("");

  useEffect(() => {
    const json = parseJsx(code);
    setOutput(
      outputTab === "liquid"
        ? componentToLiquid(json)
        : outputTab === "html"
        ? componentToHtml(json)
        : outputTab === "react"
        ? componentToReact(json, {
            // stylesType: options.reactStyleType,
            // stateType: options.reactStateType,
          })
        : outputTab === "solid"
        ? componentToSolid(json)
        : outputTab === "angular"
        ? componentToAngular(json)
        : outputTab === "svelte"
        ? componentToSvelte(json, {
            // stateType: options.svelteStateType,
          })
        : outputTab === "json"
        ? JSON.stringify(json, null, 2)
        : outputTab === "builder"
        ? JSON.stringify(componentToBuilder(json), null, 2)
        : componentToVue(json)
    );
  }, [code]);

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
      <div className="bg-gray-50 border-b border-t border-gray-200 mt-8">
        <div
          style={{
            minHeight: "50vh",
            maxHeight: "80vh",
            overflow: "auto",
          }}
        >
          <div
            style={{
              position: "relative",
              transform: "scale(0.8)",
              top: "-10%",
            }}
          >
            <BuilderComponent content={data as any} />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2">
        <div className="">
          <nav className="flex flex-col sm:flex-row  overflow-auto lg:justify-center">
            <button className="text-gray-600 py-4 px-6 block hover:text-blue-500 focus:outline-none text-blue-500 border-b-2 font-medium border-blue-500">
              JSX Lite
            </button>
          </nav>
          <div className="bg-gray-800 px-6 border-gray-600 border-r">
            <div className="p-60 grid md:grid-cols-2 gap-8 lg:grid-cols-3">
              {/* <MonacoEditor value={code} onChange={(value) => setCode(value)} /> */}
            </div>
          </div>
        </div>
        <div>
          <nav className="flex flex-col sm:flex-row border-l border-gray-200  overflow-auto lg:justify-center">
            <button className="text-gray-600 py-4 px-6 block hover:text-blue-500 focus:outline-none text-blue-500 border-b-2 font-medium border-blue-500">
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
              HTML
            </button>
            {/* TODO (maybe) */}
            {/* <button className="text-gray-600 py-4 px-6 block hover:text-blue-500 focus:outline-none">
              Figma
            </button> */}
          </nav>
          <div className="bg-gray-800  px-6">
            <div className="p-60 grid md:grid-cols-2 gap-8 lg:grid-cols-3">
              {/* <MonacoEditor options={{ readOnly: true }} value={output} /> */}
            </div>
          </div>
        </div>
      </div>
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

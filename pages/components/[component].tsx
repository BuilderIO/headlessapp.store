import React from "react";
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
import MonacoEditor, { monaco } from "@monaco-editor/react";
import Layout from "../../components/Layout";
import { User } from "../../interfaces";
import data from "../../utils/example.builder";
import { sampleUserData } from "../../utils/sample-data";

if (typeof window !== "undefined") {
  monaco.init().then((monaco) => {
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.Latest,
      allowNonTsExtensions: true,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: monaco.languages.typescript.ModuleKind.CommonJS,
      noEmit: true,
      esModuleInterop: true,
      jsx: monaco.languages.typescript.JsxEmit.React,
      reactNamespace: "React",
      allowJs: true,
      typeRoots: ["node_modules/@types"],
    });

    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: false,
      noSyntaxValidation: false,
    });
  });
}

// const defaultCode = require("raw-loader!../../content/components/rebuy.lite")
//   .default;

type Props = {
  item?: User;
  errors?: string;
};

const StaticPropsDetail = ({ item, errors }: Props) => {
  const [code] = useState(defaultCode);
  const [outputTab, setOutputTab] = useState("react");
  const [output, setOutput] = useState("");

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
  }, [code, outputTab]);

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
      <style>{`
        .monaco-editor .margin, .monaco-editor, .monaco-editor-background, .monaco-editor .inputarea.ime-input {
          background-color: transparent !important;
        }
      `}</style>
      <nav
        style={{
          marginTop: -30,
        }}
        className="flex flex-col sm:flex-row  overflow-auto lg:justify-center"
      >
        <button className="text-gray-600 py-4 px-6 block hover:text-blue-500 focus:outline-none text-blue-500 border-b-2 font-medium border-blue-500">
          View
        </button>
        <button className="text-gray-600 py-4 px-6 block hover:text-blue-500 focus:outline-none">
          Edit
        </button>
      </nav>
      <div className="bg-gray-50 border-b border-t border-gray-200">
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
              Info
            </button>
            <button className="text-gray-600 py-4 px-6 block hover:text-blue-500 focus:outline-none">
              JSX Lite
            </button>
          </nav>
          {/* <div className="bg-gray-800 border-gray-600 border-r">
            <div>
              <MonacoEditor
                language="typescript"
                theme="vs-dark"
                value={code}
                height="500px"
                options={{ minimap: { enabled: false } }}
                onChange={(value) => setCode(value)}
              >
              </MonacoEditor>
            </div>
          </div> */}
          <div className="bg-gray-800 border-gray-600 border-r h-full"></div>
        </div>
        <div>
          <nav className="flex flex-col sm:flex-row border-l border-gray-200  overflow-auto lg:justify-center">
            {["React", "Vue", "Svelte", "Solid", "Angular", "HTML"].map(
              (name, index) => {
                const lowerName = name.toLowerCase();
                const isActive = lowerName === outputTab;
                return (
                  <React.Fragment key={index}>
                    <button
                      onClick={() => {
                        setOutputTab(lowerName);
                      }}
                      className={`text-gray-600 py-4 px-6 block hover:text-blue-500 focus:outline-none ${
                        isActive
                          ? "text-blue-500 border-b-2 font-medium border-blue-500"
                          : ""
                      }`}
                    >
                      {name}
                    </button>
                  </React.Fragment>
                );
              }
            )}
          </nav>
          <div className="bg-gray-800">
            <MonacoEditor
              theme="vs-dark"
              language={
                outputTab === "json" || outputTab === "builder"
                  ? "json"
                  : outputTab === "react" ||
                    outputTab === "angular" ||
                    outputTab === "solid"
                  ? "typescript"
                  : "html"
              }
              height="500px"
              options={{ readOnly: true, minimap: { enabled: false } }}
              value={output}
            />
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
    params: { component: user.id.toString() },
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

const defaultCode = `
import { useState, For } from "@jsx-lite/core";

export default function MyComponent() {
  const state = useState({
    list: [{ text: "hello" }, { text: "world" }],
    newItemName: "New item",
    addItem() {
      state.list = [...state.list, { text: state.newItemName }];
    },
  });

  return (
    <div css={{ padding: "10px" }}>
      <link
        href="https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css"
        rel="stylesheet"
      />
      <input
        class="shadow-md rounded w-full px-4 py-2"
        value={state.newItemName}
        onChange={(event) => (state.newItemName = event.target.value)}
      />
      <button
        class="bg-blue-500 rounded w-full text-white font-bold py-2 px-4 "
        css={{ margin: "10px 0" }}
        onClick={() => state.addItem()}
      >
        Add list item
      </button>
      <div class="shadow-md rounded">
        <For each={state.list}>
          {(item) => (
            <div class="border-gray-200 border-b" css={{ padding: "10px" }}>
              {item.text}
            </div>
          )}
        </For>
      </div>
    </div>
  );
}
`;

import React from "react";
import { BuilderComponent } from "@builder.io/react";
import {
  componentToAngular,
  componentToBuilder,
  componentToCustomElement,
  componentToHtml,
  componentToLiquid,
  componentToReact,
  componentToReactNative,
  componentToSolid,
  componentToSvelte,
  componentToSwift,
  componentToVue,
  parseJsx,
} from "@jsx-lite/core";
import { GetStaticPaths, GetStaticProps } from "next";
import { useEffect, useState } from "react";
import { monaco, ControlledEditor as MonacoEditor } from "@monaco-editor/react";
import Layout from "../../components/Layout";
import { User } from "../../interfaces";
import { sampleUserData } from "../../utils/sample-data";
import { Show } from "./show";

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
  const [code, setCode] = useState(defaultCode);
  const [builderJson, setBuilderJson] = useState(null as any);
  const [outputTab, setOutputTab] = useState("react");
  const [inputTab, setInputTab] = useState("info");
  const [output, setOutput] = useState("");

  useEffect(() => {
    const json = parseJsx(code);
    if (code) {
      const builderJson = componentToBuilder(json, { includeIds: true });
      console.log({ builderJson });
      setBuilderJson(builderJson);
    }
    setOutput(
      outputTab === "liquid"
        ? componentToLiquid(json)
        : outputTab === "html"
        ? componentToHtml(json)
        : outputTab === "webcomponents"
        ? componentToCustomElement(json)
        : outputTab === "react"
        ? componentToReact(json, {
            // stylesType: state.options.reactStyleType,
            // stateType: state.options.reactStateType,
          })
        : outputTab === "swift"
        ? componentToSwift(json)
        : outputTab === "react native"
        ? componentToReactNative(json, {
            // stateType: state.options.reactStateType,
          })
        : outputTab === "solid"
        ? componentToSolid(json)
        : outputTab === "angular"
        ? componentToAngular(json)
        : outputTab === "svelte"
        ? componentToSvelte(json, {
            // stateType: state.options.svelteStateType,
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
    <Layout title="What a cool component">
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
            <Show when={builderJson}>
              <BuilderComponent content={builderJson} />
            </Show>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2">
        <div className="">
          <nav className="flex flex-col sm:flex-row  overflow-auto lg:justify-center">
            <button
              onClick={() => {
                setInputTab("info");
              }}
              className={`text-gray-600 py-4 px-6 block hover:text-blue-500 focus:outline-none ${
                inputTab === "info"
                  ? "text-blue-500 border-b-2 font-medium border-blue-500"
                  : ""
              }`}
            >
              Info
            </button>
            <button
              onClick={() => {
                setInputTab("jsx");
              }}
              className={`text-gray-600 py-4 px-6 block hover:text-blue-500 focus:outline-none ${
                inputTab === "jsx"
                  ? "text-blue-500 border-b-2 font-medium border-blue-500"
                  : ""
              }`}
            >
              JSX Lite
            </button>
          </nav>

          <div className="bg-gray-800 border-gray-600 border-r">
            <Show when={inputTab === "info"}>
              <div className="text-gray-100 p-5 prose">
                <h2 className="text-gray-100">Hello I am info</h2>
                <p>All sorts of good things</p>
              </div>
            </Show>
            <Show when={inputTab === "jsx"}>
              <MonacoEditor
                language="typescript"
                theme="vs-dark"
                value={code}
                height="500px"
                options={{ minimap: { enabled: false } }}
                onChange={(_e, value) => {
                  if (value !== code) {
                    // setCode(value || "");
                  }
                }}
              ></MonacoEditor>
            </Show>
          </div>
          <div className="bg-gray-800 border-gray-600 border-r h-full"></div>
        </div>
        <div>
          <nav className="flex flex-col sm:flex-row border-l border-gray-200  overflow-auto">
            {[
              "React",
              "Vue",
              "Svelte",
              "Solid",
              "Angular",
              "HTML",
              "React Native",
              "Swift",
              "Webcomponents",
            ].map((name, index) => {
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
                    style={{
                      whiteSpace: "nowrap",
                    }}
                  >
                    {name}
                  </button>
                </React.Fragment>
              );
            })}
          </nav>
          <div className="bg-gray-800">
            <MonacoEditor
              theme="vs-dark"
              language={
                outputTab === "swift"
                  ? "swift"
                  : outputTab === "json" || outputTab === "builder"
                  ? "json"
                  : outputTab === "react" ||
                    outputTab === "react native" ||
                    outputTab === "angular" ||
                    outputTab === "webcomponents" ||
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
import { useState, For } from '@jsx-lite/core';

export default function MyComponent() {
  const state = useState({
    list: ['hello', 'world'],
    newItemName: 'New item',
    addItem() {
      state.list = [...state.list, state.newItemName]
    }
  });

  return (
    <div css={{ padding: '10px' }}>
      <link href="https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css" rel="stylesheet" />          
      <input 
        class="shadow-md rounded w-full px-4 py-2"
        value={state.newItemName} 
        onChange={event => state.newItemName = event.target.value} />
      <button 
        class="bg-blue-500 rounded w-full text-white font-bold py-2 px-4 "
        css={{ margin: '10px 0' }} 
        onClick={() => state.addItem()}>
        Add list item
      </button>
      <div class="shadow-md rounded">
        <For each={state.list}>
          {item => (
            <div class="border-gray-200 border-b" css={{ padding: '10px' }}>
              {item}
            </div>
          )}
        </For>
      </div>
    </div>
  );
}
`.trim();

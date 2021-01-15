import React from "react";
import builder, { BuilderComponent } from "@builder.io/react";
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
import { Show } from "../../components/show";
import { AppInfo } from "../../interfaces/app";

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

type Props = {
  app?: AppInfo;
  errors?: string;
};

const StaticPropsDetail = ({ app, errors }: Props) => {
  const [code, setCode] = useState(app?.data.code || "");
  const [builderJson, setBuilderJson] = useState(null as any);
  const [outputTab, setOutputTab] = useState("react");
  const [inputTab, setInputTab] = useState("info");
  const [output, setOutput] = useState("");

  useEffect(() => {
    if (app?.data.code) {
      setCode(app.data.code);
    }
  }, [app?.data.code]);

  useEffect(() => {
    if (!code) {
      return;
    }
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

      <div className="bg-gray-800 border-gray-600 border-r">
        <Show when={inputTab === "info"}>
          <div className="text-gray-100 p-5 prose">
            <h2 className="text-gray-100">{app?.data.title}</h2>
            <p>{app?.data.subtitle}</p>
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
      <BuilderComponent model="app" content={app as any} />
    </Layout>
  );
};

export default StaticPropsDetail;

export const getStaticPaths: GetStaticPaths = async () => {
  const results = await builder.getAll("app", {
    key: "apps:all",
    fields: "data.handle",
  });

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return {
    paths: results
      .map((item) => ({ params: { app: item.data!.handle } }))
      .concat([{ params: { app: "_" /* For previewing and editing */ } }]),
    fallback: true,
  };
};

// This function gets called at build time on server-side.
// It won't be called on client-side, so you can even do
// direct database queries.
export const getStaticProps: GetStaticProps = async (context) => {
  try {
    const data = await builder
      .get("app", {
        query: {
          // Get the specific article by handle
          "data.handle": context.params!.app,
        },
        ...{
          options: {
            includeRefs: true,
          } as any,
        },
      })
      .promise();
    // By returning { props: item }, the StaticPropsDetail component
    // will receive `item` as a prop at build time
    return { props: { app: JSON.parse(JSON.stringify(data)) }, revalidate: 1 };
  } catch (err) {
    return { props: { errors: err.message } };
  }
};

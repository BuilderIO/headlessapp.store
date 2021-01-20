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
import React from "react";
import { useEffect, useState } from "react";
import { AppInfo } from "../interfaces/app";
import { ControlledEditor as MonacoEditor, monaco } from "@monaco-editor/react";
import { Show } from "./show";
import { BuilderComponent } from "@builder.io/react";

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

export function GetApp(props: { app: AppInfo }) {
  const { app } = props;
  const [code, setCode] = useState("");
  const [builderJson, setBuilderJson] = useState(null as any);
  const [outputTab, setOutputTab] = useState("react");
  const [output, setOutput] = useState("");
  const [activeTemplate, setActiveTemplate] = useState(0);

  useEffect(() => {
    const code = app?.data.templates?.[activeTemplate]?.code;
    setCode(code || "");
  }, [app?.data, activeTemplate]);

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
    try {
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
    } catch (err) {
      console.warn(err);
    }
  }, [code, outputTab]);

  return (
    <div>
      <div className="mt-8">
        <nav className="flex justify-center flex-col sm:flex-row overflow-auto">
          {app?.data.templates?.map(({ name }, index) => {
            const isActive = index === activeTemplate;
            return (
              <button
                key={index}
                onClick={() => {
                  setActiveTemplate(index);
                }}
                className={`whitespace-nowrap text-gray-600 py-4 px-6 block hover:text-primary focus:outline-none ${
                  isActive
                    ? "text-primary border-b-2 font-medium border-primary"
                    : ""
                }`}
              >
                {name}
              </button>
            );
          })}
        </nav>
        <div
          className="bg-offwhite p-5"
          style={{
            height: "40vh",
            maxHeight: "60vh",
            minHeight: "200px",
          }}
        >
          <Show when={builderJson}>
            <BuilderComponent content={builderJson} />
          </Show>
        </div>
      </div>
      <nav id="get-app-code" className="flex flex-col sm:flex-row overflow-auto justify-center">
        {[
          "Builder",
          "React",
          "Vue",
          "Angular",
          "Svelte",
          "Solid",
          "HTML",
          "Webcomponents",
          "JSX Lite",
        ].map((name, index) => {
          const lowerName = name.toLowerCase();
          const isActive = lowerName === outputTab;
          return (
            <button
              key={index}
              onClick={() => {
                setOutputTab(lowerName);
              }}
              className={`text-gray-600 whitespace-nowrap py-4 px-6 block hover:text-primary focus:outline-none ${
                isActive
                  ? "text-primary border-b-2 font-medium border-primary"
                  : ""
              }`}
            >
              {name}
            </button>
          );
        })}
      </nav>
      <div className="grid grid-cols-2 gap-4">
        <div>How to</div>
        <div className="m-6">
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
            height="50vh"
            className="bg-gray-800 rounded pt-2"
            options={{ readOnly: true, minimap: { enabled: false } }}
            value={output}
          />
        </div>
      </div>
    </div>
  );
}

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
  const [code, setCode] = useState(app?.data.code || "");
  const [builderJson, setBuilderJson] = useState(null as any);
  const [outputTab, setOutputTab] = useState("react");
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

  return (
    <div>
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
  );
}

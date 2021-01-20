import {
  builderContentToJsxLiteComponent,
  componentToAngular,
  componentToBuilder,
  componentToCustomElement,
  componentToHtml,
  componentToJsxLite,
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
import { Builder, BuilderComponent } from "@builder.io/react";
import { BuilderContent } from "@builder.io/sdk";
import { adapt } from "webcomponents-in-react";
import { Portal } from "react-portal";
import { getQueryParam } from "./functions/get-query-param";

const BuilderEditor = adapt("builder-editor");

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

const builderOptions = {
  useDefaultStyles: false,
  hideAnimateTab: true,
  previewUrl: "https://jsx-lite.builder.io/preview.html",
};

export function GetApp(props: {
  app: AppInfo;
  showBuilderDrawer?: boolean;
  onCloseDrawer: () => void;
}) {
  // For direct mutation without triggering a rerender (mostly for performance)
  const [privateState] = useState({
    latestBuilderJson: null as null | BuilderContent,
  });
  const { app } = props;
  const [code, setCode] = useState("");
  const [builderJson, setBuilderJson] = useState(null as any);
  const [outputTab, setOutputTab] = useState("react");
  const [output, setOutput] = useState("");
  const [activeTemplate, setActiveTemplate] = useState(0);
  const [loadBuilder, setLoadBuilder] = useState(false);

  const builderEnvParam = Builder.isBrowser && getQueryParam("builderEnv");

  const { showBuilderDrawer } = props;

  useEffect(() => {
    if (showBuilderDrawer && !loadBuilder) {
      setLoadBuilder(true);
    }
    if (showBuilderDrawer) {
      privateState.latestBuilderJson = null;
    }
  }, [showBuilderDrawer, loadBuilder]);

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
      <nav
        id="get-app-code"
        className="flex flex-col sm:flex-row overflow-auto justify-center"
      >
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
            className="bg-gray-800 rounded pt-2 shadow-lg"
            options={{ readOnly: true, minimap: { enabled: false } }}
            value={output}
          />
        </div>
      </div>

      <Portal>
        <div
          className="fixed bg-black top-0 left-0 right-0 bottom-0"
          style={{
            opacity: showBuilderDrawer ? 0.3 : 0,
            transition: "opacity 0.2s ease-in-out",
            pointerEvents: showBuilderDrawer ? "auto" : "none",
          }}
          onClick={() => {
            props.onCloseDrawer?.();

            if (privateState.latestBuilderJson) {
              setCode(
                componentToJsxLite(
                  builderContentToJsxLiteComponent(
                    privateState.latestBuilderJson
                  )
                )
              );
            }
          }}
        ></div>
        <div
          style={{
            transform: `translate3d(0, ${showBuilderDrawer ? "0" : "20%"}, 0)`,
            opacity: showBuilderDrawer ? 1 : 0,
            transition: "transform 0.2s ease-in-out, opacity 0.2s ease-in-out",
            pointerEvents: showBuilderDrawer ? "auto" : "none",
          }}
          className="bg-white p-12 shadow-2xl z-10 fixed bottom-0 left-0 right-0 top-16"
        >
          <div className="absolute top-0 left-0 items-center justify-center flex h-full w-full opacity-60">
            Loading...
          </div>
          <Show when={loadBuilder}>
            <BuilderEditor
              class="absolute top-0 right-0 bottom-0 left-0 width-full"
              onChange={(e: CustomEvent) => {
                privateState.latestBuilderJson = e.detail;
              }}
              data={builderJson}
              options={builderOptions}
              env={builderEnvParam || undefined}
            />
          </Show>
        </div>
      </Portal>
    </div>
  );
}

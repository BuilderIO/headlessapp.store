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
  const [reactStateType, setReactStateType] = useState("useState");
  const [reactStyleType, setReactStyleType] = useState("styled-jsx");
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
              stylesType: reactStyleType as any,
              stateType: reactStateType as any,
            })
          : outputTab === "swift"
          ? componentToSwift(json)
          : outputTab === "react native"
          ? componentToReactNative(json, {
              stateType: reactStateType as any,
            })
          : outputTab === "solid"
          ? componentToSolid(json)
          : outputTab === "angular"
          ? componentToAngular(json)
          : outputTab === "svelte"
          ? componentToSvelte(json, {
              stateType: "variables",
            })
          : outputTab === "json"
          ? JSON.stringify(json, null, 2)
          : outputTab === "builder"
          ? JSON.stringify(componentToBuilder(json), null, 2)
          : outputTab === "jsx lite"
          ? componentToJsxLite(json)
          : componentToVue(json)
      );
    } catch (err) {
      console.warn(err);
    }
  }, [code, outputTab, reactStateType, reactStyleType]);

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
            maxHeight: "70vh",
            minHeight: "200px",
            overflow: "auto",
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
          // "JSON",
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
      <div className="grid grid-cols-6 gap-4">
        <div className="col-span-2">How to</div>
        <div className="m-6 col-span-4">
          {outputTab === "react" && (
            <div className="grid grid-cols-2 gap-4 pb-4">
              <div>
                <label
                  for="reactStateType"
                  className="block text-sm font-medium text-gray-700"
                >
                  State Library
                </label>
                <select
                  value={reactStateType}
                  onChange={(e) => setReactStateType(e.target.value)}
                  id="reactStateType"
                  name="reactStateType"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="useState">useState</option>
                  <option value="mobx">Mobx</option>
                  <option value="solid">Solid</option>
                </select>
              </div>
              <div>
                <label
                  for="reactStyleType"
                  className="block text-sm font-medium text-gray-700"
                >
                  Style Library
                </label>
                <select
                  value={reactStyleType}
                  onChange={(e) => setReactStyleType(e.target.value)}
                  id="reactStyleType"
                  name="reactStyleType"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="styled-jsx">Styled JSX</option>
                  <option value="styled-components">Styled Components</option>
                  <option value="emotion">Emotion</option>
                </select>
              </div>
            </div>
          )}
          <MonacoEditor
            theme="vs-dark"
            language={
              outputTab === "swift"
                ? "swift"
                : outputTab === "json" || outputTab === "builder"
                ? "json"
                : outputTab === "react" ||
                  outputTab === "jsx lite" ||
                  outputTab === "react native" ||
                  outputTab === "angular" ||
                  outputTab === "webcomponents" ||
                  outputTab === "solid"
                ? "typescript"
                : "html"
            }
            height="50vh"
            className="bg-gray-800 rounded pt-2 shadow-lg"
            onChange={(_event, value) => {
              setCode(value || "");
            }}
            options={{
              readOnly: outputTab !== "jsx lite",
              minimap: { enabled: false },
            }}
            value={output}
          />
          <div className="text-center mt-4">
            {outputTab === "jsx lite" ? (
              <>Edit the code above to update the preview and generate code!</>
            ) : (
              <>
                Code generated by{" "}
                <a
                  target="_blank"
                  className="text-primary font-bold"
                  href="https://github.com/builderio/jsx-lite"
                >
                  JSX Lite
                </a>
              </>
            )}
          </div>
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
          className="bg-white p-12 shadow-2xl z-10 fixed bottom-0 left-0 right-0 top-1/6"
        >
          <div className="absolute top-0 left-0 items-center justify-center flex h-full w-full opacity-60">
            Loading Builder.io visual editor...
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

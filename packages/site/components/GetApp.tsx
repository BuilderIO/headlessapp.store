import React from "react";
import { useEffect, useState } from "react";
import { AppInfo } from "../interfaces/app";
import { Show } from "./show";
import { Builder, BuilderComponent } from "@builder.io/react";
import { BuilderContent } from "@builder.io/sdk";
import { adapt } from "webcomponents-in-react";
import { Portal } from "react-portal";
import { getQueryParam } from "./functions/get-query-param";
import Image from "next/image";
import useEventListener from "use-typed-event-listener";
import dynamic from "next/dynamic";
import type { ControlledEditor } from "@monaco-editor/react";
import { useDebouncedCallback } from "use-debounce";

const MonacoEditor: typeof ControlledEditor = dynamic(() =>
  import("@monaco-editor/react").then((mod) => {
    if (typeof window !== "undefined") {
      mod.monaco.init().then((monaco) => {
        monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
          target: monaco.languages.typescript.ScriptTarget.Latest,
          allowNonTsExtensions: true,
          moduleResolution:
            monaco.languages.typescript.ModuleResolutionKind.NodeJs,
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
    return mod.ControlledEditor as any;
  })
) as any;

const LOGOS = {
  builder:
    "https://cdn.builder.io/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2F256484ef7be24bfba55633cdd810fe06",
  "jsx lite":
    "https://cdn.builder.io/api/v1/image/assets%2Fc33bcd23c29e45789677ba9aaaa7ce1d%2Ff028acdb0af4483a9d93433d30271c6c",
  react:
    "https://cdn.builder.io/api/v1/image/assets%2Fc33bcd23c29e45789677ba9aaaa7ce1d%2F10faa410dcd24f77a9d0f3208d3074df",
  vue:
    "https://cdn.builder.io/api/v1/image/assets%2Fc33bcd23c29e45789677ba9aaaa7ce1d%2F0b6e43efb489414ea0c31239b278308c",
  angular:
    "https://cdn.builder.io/api/v1/image/assets%2Fc33bcd23c29e45789677ba9aaaa7ce1d%2F91488e25b95a489eb32dc25e8adf3d0c",
  solid:
    "https://cdn.builder.io/api/v1/image/assets%2Fc33bcd23c29e45789677ba9aaaa7ce1d%2F5b73ceac3ac84801b4d303efdaf2ffa3",
  html:
    "https://cdn.builder.io/api/v1/image/assets%2Fc33bcd23c29e45789677ba9aaaa7ce1d%2Ff9aa1f008e404b7181d8f7ef6d4e3b57",
  webcomponents:
    "https://cdn.builder.io/api/v1/image/assets%2Fc33bcd23c29e45789677ba9aaaa7ce1d%2Fb23612fe023642a9a8f402f3cbee7f68",
  svelte:
    "https://cdn.builder.io/api/v1/image/assets%2Fc33bcd23c29e45789677ba9aaaa7ce1d%2Fc5693ddcb3f24ab8932b98df1786240c",
};

const BuilderEditor = adapt("builder-editor");

const builderOptions = {
  useDefaultStyles: false,
  hideAnimateTab: true,
  previewUrl: "https://jsx-lite.builder.io/preview.html",
};

export function GetApp(props: {
  app: AppInfo;
  showBuilderDrawer?: boolean;
  onCloseDrawer: () => void;
  activeTemplate?: number;
  initialBuilderJson?: BuilderContent | null;
  onShowBuilderDrawer: () => void;
}) {
  const [loadMonaco, setLoadMonaco] = useState(false);

  if (Builder.isBrowser) {
    useEventListener(
      window,
      "scroll",
      () => {
        setLoadMonaco(true);
      },
      {
        once: true,
        passive: true,
      }
    );
  }

  // For direct mutation without triggering a rerender (mostly for performance)
  const [privateState] = useState({
    latestBuilderJson: null as null | BuilderContent,
    lastCode: "",
  });
  const { app } = props;
  const [code, setCode] = useState("");
  const [builderJson, setBuilderJson] = useState(
    props.initialBuilderJson || null
  );
  const [outputTab, setOutputTab] = useState("jsx lite");
  const [reactStateType, setReactStateType] = useState("useState");
  const [reactStyleType, setReactStyleType] = useState("styled-jsx");
  const [output, setOutput] = useState("");

  const [loadBuilder, setLoadBuilder] = useState(false);

  const builderEnvParam = Builder.isBrowser && getQueryParam("builderEnv");

  const { showBuilderDrawer } = props;

  const debouncedUpdateBuilderContent = useDebouncedCallback(
    async () => {
      const {
        componentToBuilder,

        parseJsx,
      } = await import("@jsx-lite/core");
      const json = parseJsx(code);
      if (code && code !== privateState.lastCode) {
        const builderJson = componentToBuilder(json, { includeIds: true });
        setBuilderJson(builderJson as BuilderComponent);
      }
    },
    800,
    {
      leading: false,
      trailing: true,
    }
  );

  useEffect(() => {
    if (showBuilderDrawer) {
      privateState.latestBuilderJson = null;

      const editorScriptId = "builder-editor-script";
      if (!document.getElementById(editorScriptId)) {
        const script = document.createElement("script");
        script.async = true;
        script.src = "https://cdn.builder.io/js/editor";
        script.id = editorScriptId;
        script.onload = () => {
          setLoadBuilder(true);
        };
        document.body.appendChild(script);
      }
    }
  }, [showBuilderDrawer, loadBuilder]);

  useEffect(() => {
    const code = app?.data.templates?.[props.activeTemplate!]?.code;
    setCode(code || "");
  }, [app?.data, props.activeTemplate]);

  useEffect(() => {
    if (!code || !loadMonaco) {
      return;
    }
    if (outputTab === "jsx lite") {
      setOutput(code);
      return;
    }
    (async () => {
      const {
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
      } = await import("@jsx-lite/core");
      const json = parseJsx(code);
      if (code && code !== privateState.lastCode) {
        const builderJson = componentToBuilder(json, { includeIds: true });
        setBuilderJson(builderJson as BuilderComponent);
      }
      privateState.lastCode = code;
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
    })();
  }, [code, outputTab, reactStateType, reactStyleType, loadMonaco]);

  useEffect(() => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      // Large screen that has no room to scroll
      setLoadMonaco(true);
    }
  }, []);

  return (
    <div>
      <div>
        <div
          className="bg-offwhite px-5 py-15 lg:px-15 full-width"
          style={{
            maxHeight: "70vh",
            minHeight: "200px",
            overflow: "auto",
          }}
        >
          <Show when={builderJson}>
            <BuilderComponent
              data={app?.data?.defaultInputValues || {}}
              key={props.activeTemplate}
              content={builderJson as BuilderContent}
            />
          </Show>
        </div>
      </div>
      <div className="bg-gradient-to-br from-dark to-primary-dark full-width shadow-md text-white">
        <div className="m-auto container w-full flex flex-col pb-16">
          <nav
            id="get-app-code"
            style={{
              maxWidth: "100%",
            }}
            className="flex flex-row overflow-auto md:justify-center rounded-full bg-dark shadow-lg mx-auto mt-10 mb-6 border-black border-opacity-30 border-2"
          >
            {[
              "Builder",
              "JSX Lite",
              "React",
              "Vue",
              "Angular",
              "Svelte",
              "Solid",
              "HTML",
              "Webcomponents",
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
                  className={` text-xs tracking-widest uppercase  whitespace-nowrap py-4 px-6 block hover:font-bold focus:outline-none ${
                    isActive
                      ? "bg-primary-light font-extrabold text-dark"
                      : "bg-offwhite text-primary-dark font-bold"
                  } ${
                    lowerName === "jsx lite"
                      ? " border-primary-dark border-r-2"
                      : ""
                  }`}
                >
                  {name}
                </button>
              );
            })}
          </nav>
          <div className="grid grid-cols-6 gap-16">
            <div className="col-span-6 lg:col-span-2 text-white flex flex-col">
              <Show when={outputTab === "builder"}>
                <div className="m-auto flex flex-col items-stretch text-center">
                  <div className="pb-6 mx-auto text-center mb-4">
                    <Image
                      className="object-contain"
                      width="auto"
                      height="100"
                      src={LOGOS.builder}
                    />
                  </div>
                  <div className="text-lg pb-4">
                    Visually install, edit, personalize, and publish this app
                    remotely with Builder.io.
                  </div>
                  <div
                    onClick={() => {
                      const url = `${
                        window.location.hostname === "localhost"
                          ? "http://localhost:1234"
                          : "https://builder.io"
                      }/login?installHASApp=${app.id}:${props.activeTemplate}`;
                      open(url, "_blank", "noopener");
                    }}
                    className="font-sans text-center text-offwhite block px-6 py-4 border-offwhite border-2 rounded cursor-pointer mt-8"
                  >
                    Install with Builder.io
                  </div>
                  <a
                    onClick={props.onShowBuilderDrawer}
                    className="text-center text-offwhite block px-6 py-2 border-offwhite opacity-70 rounded mt-4 cursor-pointer"
                  >
                    Edit with Builder.io
                  </a>
                </div>
              </Show>
              <Show when={outputTab === "jsx lite"}>
                <div className="m-auto font-mono w-full flex flex-col items-stretch text-center">
                  <div className="pb-6 mx-auto text-center mb-4">
                    <Image
                      className="object-contain"
                      width="auto"
                      height="100"
                      src={LOGOS["jsx lite"]}
                    />
                  </div>
                  <div>
                    Edit the code to the right to update all of the generated
                    code in the other tabs!
                  </div>
                  <a
                    rel="noopenner"
                    target="_blank"
                    href="https://github.com/builderio/jsx-lite"
                    className="text-center text-offwhite block mx-auto px-6 py-2 border-offwhite opacity-70 rounded mt-4 cursor-pointer"
                  >
                    Learn more
                  </a>
                </div>
              </Show>
              <Show when={outputTab !== "builder" && outputTab !== "jsx lite"}>
                <div className="m-auto font-mono text-center w-full">
                  <Show when={(LOGOS as any)[outputTab]}>
                    <div className="pb-6 mx-auto text-center mb-4">
                      <Image
                        className="object-contain"
                        width="auto"
                        height="100"
                        src={(LOGOS as any)[outputTab]}
                      />
                    </div>
                  </Show>
                  {[
                    "angular",
                    "vue",
                    "react",
                    "solid",
                    "svelte",
                    "webcomponents",
                  ].includes(outputTab) && (
                    <>
                      <>
                        <pre className="w-full overflow-auto rounded bg-black bg-opacity-10 py-2 px-4 my-2">
                          npm install @headlessapp.store/{app.data.handle}
                        </pre>
                        {outputTab === "webcomponents" ? (
                          <pre className="w-full overflow-auto rounded bg-black bg-opacity-10 py-2 px-4 my-2">
                            import '@headlessapp.store/{app.data.handle}/
                            {outputTab}'
                          </pre>
                        ) : (
                          <pre className="w-full overflow-auto rounded bg-black bg-opacity-10 py-2 px-4 my-2">
                            import{" "}
                            {`{ ${app?.data.templates?.[
                              props.activeTemplate!
                            ]?.name?.replace(/\s+/g, "")} }`}{" "}
                            from '@headlessapp.store/{app.data.handle}/
                            {outputTab}'
                          </pre>
                        )}
                        <div className="py-5">- Or -</div>
                      </>
                    </>
                  )}
                  <div>
                    Copy and paste this code into your project and edit as
                    desired.
                  </div>
                  <div className="py-5">- Or -</div>
                  <div
                    onClick={() => setOutputTab("builder")}
                    className="font-sans text-center text-offwhite block mx-auto px-6 py-4 border-offwhite border-2 rounded cursor-pointer"
                  >
                    Install with one click in Builder.io
                  </div>
                </div>
              </Show>
            </div>
            <div className="m-6 col-span-6 lg:col-span-4">
              {outputTab === "react" && (
                <div className="grid grid-cols-2 gap-4 pb-4">
                  <div>
                    <label
                      htmlFor="reactStateType"
                      className="block text-xs opacity-70"
                    >
                      State Library
                    </label>
                    <select
                      value={reactStateType}
                      onChange={(e) => setReactStateType(e.target.value)}
                      id="reactStateType"
                      name="reactStateType"
                      className="mt-1 bg-primary-dark block w-full pl-3 pr-10 py-2 text-base broder-primary-light focus:outline-none focus:ring-indigo-500 focus:border-primary sm:text-sm rounded-md"
                    >
                      <option value="useState">useState</option>
                      <option value="mobx">Mobx</option>
                      <option value="solid">Solid</option>
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="reactStyleType"
                      className="block text-xs opacity-70"
                    >
                      Style Library
                    </label>
                    <select
                      value={reactStyleType}
                      onChange={(e) => setReactStyleType(e.target.value)}
                      id="reactStyleType"
                      name="reactStyleType"
                      className="mt-1 bg-primary-dark block w-full pl-3 pr-10 py-2 text-base broder-primary-light focus:outline-none focus:ring-indigo-500 focus:border-primary sm:text-sm rounded-md"
                    >
                      <option value="styled-jsx">Styled JSX</option>
                      <option value="styled-components">
                        Styled Components
                      </option>
                      <option value="emotion">Emotion</option>
                    </select>
                  </div>
                </div>
              )}
              {outputTab === "builder" && (
                <video
                  style={{ height: "50vh" }}
                  muted
                  autoPlay
                  loop
                  className="shadow-lg rounded bg-dark"
                >
                  <source
                    type="video/mp4"
                    src="https://cdn.builder.io/o/assets%2FYJIGb4i01jvw0SRdL5Bt%2F3e6c8c72d2cd416cb04450e498962049?alt=media&token=b17aa0d5-525c-49b0-b806-3e58503df0b9&apiKey=YJIGb4i01jvw0SRdL5Bt"
                  />
                </video>
              )}
              {outputTab !== "builder" && loadMonaco && (
                <>
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
                    className="bg-dark rounded pt-2 shadow-lg"
                    onChange={(_event, value) => {
                      setCode(value || "");
                      debouncedUpdateBuilderContent();
                    }}
                    options={{
                      readOnly: outputTab !== "jsx lite",
                      minimap: { enabled: false },
                    }}
                    value={output}
                  />

                  <div className="text-center mt-4">
                    {outputTab === "jsx lite" ? null : (
                      <>
                        Code generated by{" "}
                        <a
                          target="_blank"
                          className="text-primary-light font-bold"
                          href="https://github.com/builderio/jsx-lite"
                        >
                          JSX Lite
                        </a>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
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
          onClick={async () => {
            props.onCloseDrawer?.();

            if (privateState.latestBuilderJson) {
              const {
                componentToJsxLite,
                builderContentToJsxLiteComponent,
              } = await import("@jsx-lite/core");
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
            <div className="absolute top-0 right-0 left-0 bg-offwhite text-center border-b border-gray-80">
              <div className="p-4 font-bold uppercase tracking-widest">
                Edit in Builder.io
              </div>
              <div
                className="absolute top-3 z-10 right-4 text-2xl opacity-40 cursor-pointer"
                onClick={() => props.onCloseDrawer()}
                style={{
                  transform: "rotateZ(45deg)",
                }}
              >
                +
              </div>
            </div>
            <BuilderEditor
              class="absolute top-15 right-0 bottom-0 left-0 width-full"
              onChange={(e: CustomEvent) => {
                privateState.latestBuilderJson = e.detail;
              }}
              data={builderJson}
              options={builderOptions}
              env={
                builderEnvParam ||
                (Builder.isBrowser &&
                  window.location.hostname === "localhost" &&
                  "dev") ||
                undefined
              }
            />
          </Show>
        </div>
      </Portal>
    </div>
  );
}

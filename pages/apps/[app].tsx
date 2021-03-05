import builder, { BuilderComponent, BuilderContent } from "@builder.io/react";
import { GetStaticPaths, GetStaticProps } from "next";
import React, { useState } from "react";
import { GetApp } from "../../components/GetApp";
import Layout from "../../components/Layout";
import { AppInfo } from "../../interfaces/app";

builder.init("c33bcd23c29e45789677ba9aaaa7ce1d");

type Props = {
  app?: AppInfo;
  errors?: string;
};

const AppPage = ({ app, errors }: Props) => {
  const [showBuilderDrawer, setShowBuilderDrawer] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState(0);

  if (errors) {
    return (
      <Layout title="Error | Next.js + TypeScript Example">
        <p>
          <span className="text-red-800">Error:</span> {errors}
        </p>
      </Layout>
    );
  }

  return (
    <BuilderContent modelName="app" content={app as any}>
      {(_data, _loading, app) => (
        <>
          <Layout title={`${app?.data?.title || ""} | HeadlessApp.Store`}>
            <style>{`
        .monaco-editor .margin, .monaco-editor, .monaco-editor-background, .monaco-editor .inputarea.ime-input {
          background-color: transparent !important;
        }
      `}</style>

            <div className="bg-white shadow-md full-width">
              <div className="container mx-auto py-16">
                <div className="flex flex-col lg:flex-row">
                  <img
                    src={app?.data.image}
                    className="w-96 h-80 rounded-xl bg-white lg:mr-20 self-center object-contain object-center shadow-lg p-6 m-auto lg:m-0"
                  />
                  <div className="my-auto text-center lg:text-left mt-12 lg:mt-0">
                    <h2 className="text-6xl">{app?.data.title}</h2>
                    <p className="text-gray-700 mt-6 text-xl">
                      {app?.data.subtitle}
                    </p>

                    <div className="flex-row mt-10">
                      <a
                        onClick={() => {
                          document
                            .getElementById("get-app-code")
                            ?.scrollIntoView({
                              behavior: "smooth",
                              block: "start",
                            });
                        }}
                        className="bg-gradient-to-r from-dark to-primary rounded-full text-white font-semibold py-6 px-10 cursor-pointer uppercase tracking-widest"
                      >
                        Get app
                      </a>
                      <button
                        className="border-primary border-2 rounded-full text-primary font-semibold py-3 px-6 cursor-pointer uppercase tracking-widest ml-6"
                        onClick={() => {
                          setShowBuilderDrawer(true);
                        }}
                      >
                        Customize
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <nav className="flex justify-center flex-col sm:flex-row overflow-auto">
                {app?.data.templates?.map(({ name }, index) => {
                  const isActive = index === activeTemplate;
                  return (
                    <button
                      key={index}
                      onClick={() => {
                        setActiveTemplate(index);
                      }}
                      className={`whitespace-nowrap text-gray-600 py-4 px-6 block hover:text-primary focus:outline-none uppercase tracking-widest font-bold ${
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
            </div>

            {app && (
              <GetApp
                activeTemplate={activeTemplate}
                onCloseDrawer={() => setShowBuilderDrawer(false)}
                showBuilderDrawer={showBuilderDrawer}
                onShowBuilderDrawer={() => setShowBuilderDrawer(true)}
                app={app}
              />
            )}
            <BuilderComponent model="app" content={app as any} />
          </Layout>
        </>
      )}
    </BuilderContent>
  );
};

export default AppPage;

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

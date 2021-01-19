import builder, { BuilderComponent } from "@builder.io/react";
import { GetStaticPaths, GetStaticProps } from "next";
import React from "react";
import { GetApp } from "../../components/GetApp";
import Layout from "../../components/Layout";
import { Show } from "../../components/show";
import { AppInfo } from "../../interfaces/app";

type Props = {
  app?: AppInfo;
  errors?: string;
};

const StaticPropsDetail = ({ app, errors }: Props) => {
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

      <div className="p-5 prose">
        <h2 className="text-gray-100">{app?.data.title}</h2>
        <p>{app?.data.subtitle}</p>
      </div>

      {app && <GetApp app={app} />}
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

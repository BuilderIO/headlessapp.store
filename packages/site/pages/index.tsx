import builder, { BuilderComponent } from '@builder.io/react';
import { InferGetStaticPropsType } from 'next';
import Layout from '../components/Layout';

type Props = Exclude<InferGetStaticPropsType<typeof getStaticProps>, { errors: any }>;

export const Index = ({ content }: Props) => {
  return (
    <Layout hideHeaderAndFooter>
      <div
        style={{ marginLeft: 'calc(50% - 50vw)' }}
        className="flex items-center justify-center w-screen h-screen pb-10 bg-dark"
      >
        <BuilderComponent model="page" content={content} />
      </div>
    </Layout>
  );
};

export const getStaticProps = async () => {
  return builder
    .get('page', { url: '/' })
    .promise()
    .then((content: any) => ({ props: { content, revalidate: true, notFound: !content } }))
    .catch((err: { message: any }) => ({ props: { errors: err.message } }));
};

export default Index;

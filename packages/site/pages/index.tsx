import { BuilderComponent } from '@builder.io/react';
import Layout from '../components/Layout';

export const Index = () => {
  return (
    <Layout hideHeaderAndFooter>
      <div
        style={{ marginLeft: 'calc(50% - 50vw)' }}
        className="flex items-center justify-center w-screen h-screen pb-10 bg-dark"
      >
        <BuilderComponent model="page" />
      </div>
    </Layout>
  );
};

export default Index;

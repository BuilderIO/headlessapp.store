import Link from "next/link";
import Layout from "../components/Layout";

const GridItem = () => {
  const logo = false;
  return (
    <Link href="/components/101">
      <a className="p-8 bg-gray-600 rounded relative shadow group overflow-hidden md:py-16 text-center transition duration-150 ease-in-out">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-50 w-full h-full transform transition duration-100 ease-in-out z-10"></div>
        <div className="relative z-10">
          <div className="mb-4">
            {logo ? (
              <img
                src=""
                className="inline-block"
                style={{ maxWidth: 200, maxHeight: 50 }}
              />
            ) : null}
          </div>

          <div>
            <h3 className="text-xl leading-7 font-semibold text-gray-100">
              I am a cool component
            </h3>
            <p className="mt-1 text-gray-400 text-sm leading-6">
              Hello there hi
            </p>
          </div>
        </div>
      </a>
    </Link>
  );
};

const IndexPage = () => {
  return (
    <Layout title="Home | Next.js + TypeScript Example">
      <div className="p-6 py-12 md:py-32 lg:py-36 bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl sm:text-5xl md:text-6xl tracking-tight font-extrabold leading-tight text-transparent bg-gradient-to-r from-teal-500 via-blue-600 to-purple-600 bg-clip-text">
            Headless App Store
          </h2>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 opacity-75 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Apps for the <b className="text-blue-600">component</b> generation
          </p>
        </div>
      </div>
      <main className="bg-gray-800 px-6">
        <div className="py-8 grid md:grid-cols-2 gap-8 lg:grid-cols-3">
          {Array.from({ length: 10 }).map((_, i) => (
            <GridItem key={i} />
          ))}
        </div>
      </main>
    </Layout>
  );
};

export default IndexPage;

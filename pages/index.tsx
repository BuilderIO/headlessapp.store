import Link from "next/link";
import Layout from "../components/Layout";

const IndexPage = () => {
  const logo = false;
  return (
    <Layout title="Home | Next.js + TypeScript Example">
      <div className="p-6 py-12 md:py-32 lg:py-36 bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl sm:text-5xl md:text-6xl tracking-tight font-extrabold leading-tight text-transparent bg-gradient-to-r from-red-600 via-indigo-600 to-purple-700 bg-clip-text">
            Headless App Store
          </h2>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 opacity-75 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            A community curated list of commerce products, services, podcasts,
            books, and more. A heads-up for modern store builders.
          </p>
          <div className="pt-6 md:pt-10">
            <a
              className="relative inline-flex items-center text-center px-3 py-2 rounded-md border border-gray-200 bg-white text-sm leading-5 font-medium text-gray-500 hover:text-black focus:z-10 focus:outline-none active:bg-gray-100 active:text-black transition ease-in-out duration-150"
              href="/about"
            >
              Learn more
            </a>
          </div>
        </div>
      </div>
      <main className="bg-gray-50 border-b border-gray-200 px-6">
        <div className="py-8 grid md:grid-cols-2 gap-8 lg:grid-cols-3">
          <article className="p-8 bg-white rounded relative shadow group overflow-hidden md:py-16 text-center transition duration-150 ease-in-out">
            <div>
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
                <h3 className="text-xl leading-7 font-semibold text-gray-900">
                  I am a service
                </h3>
                <p className="mt-1 text-gray-400 text-sm leading-6">
                  Hello there hi
                </p>
              </div>
            </div>

            <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-purple-700 opacity-0 group-hover:opacity-50 w-full h-full transform transition duration-100 ease-in-out z-10"></div>
          </article>
        </div>
      </main>
    </Layout>
  );
};

export default IndexPage;

import Layout from "../components/Layout";

const AboutPage = () => (
  <Layout title="About | Next.js + TypeScript Example">
    <div className="p-6 py-12 md:py-32 lg:py-36 shadow-sm border-b border-gray-200">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-2xl sm:text-5xl md:text-6xl tracking-tight font-extrabold leading-tight text-transparent bg-gradient-to-r from-red-600 via-indigo-600 to-purple-700 bg-clip-text">
          About Us
        </h2>
        <p className="mt-3 max-w-md mx-auto text-base text-gray-500 opacity-75 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          Lorem ipsum dolor kismet
        </p>
      </div>
    </div>
    <main className="bg-gray-800 border-b border-gray-200 px-6">
      <div className="max-w-5xl mx-auto prose md:prose-lg py-6 md:py-12 lg:py-24 text-gray-300">
        <h2 className="text-gray-500">Foobar</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque
          eget sem in diam varius iaculis in non ante. Cras ante enim, vehicula
          et enim fringilla, condimentum malesuada est. Nulla laoreet euismod
          justo sit amet interdum. Orci varius natoque penatibus et magnis dis
          parturient montes, nascetur ridiculus mus. Nam sit amet nunc purus.
          Interdum et malesuada fames ac ante ipsum primis in faucibus. Morbi
          dignissim magna sit amet turpis semper, id accumsan turpis sodales.
          Vestibulum commodo venenatis orci, non luctus nibh suscipit nec. Proin
          pharetra turpis eget mauris ullamcorper, et consequat augue ultricies.
          Duis molestie tellus quis ipsum ornare commodo. Etiam tempor turpis a
          congue lacinia. Vestibulum tincidunt nulla vitae consectetur
          consequat. Etiam scelerisque orci ante, non vulputate nunc auctor at.
          Nam volutpat laoreet est, eget pulvinar ante sollicitudin vitae.
          Pellentesque lobortis ligula nec massa placerat, a placerat arcu
          aliquet. Sed vitae tempus nisl.
        </p>
      </div>
    </main>
  </Layout>
);

export default AboutPage;

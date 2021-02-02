const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");
const withPlugins = require("next-compose-plugins");
const withTM = require("next-transpile-modules")([
  // "monaco-editor"
]);

const ONE_YEAR_IN_SECONDS = 959220000;

const longCacheExtensions = ["jpg", "jpeg", "svg", "webp", "png"];

module.exports = withPlugins([withTM], {
  images: {
    domains: ["cdn.builder.io"],
  },
  webpack: (config, { isServer }) => {
    // Fixes npm packages that depend on `fs` module
    if (!isServer) {
      config.node = {
        fs: "empty",
      };
    }

    config.plugins.push(new MonacoWebpackPlugin());

    return config;
  },
  async headers() {
    return [
      ...longCacheExtensions.map((ext) => ({
        source: `/(.*).${ext}`,
        headers: [
          {
            key: "Cache-Control",
            value: `public, max-age=${ONE_YEAR_IN_SECONDS}, s-maxage=${ONE_YEAR_IN_SECONDS}, stale-while-revalidate=${ONE_YEAR_IN_SECONDS}`,
          },
        ],
      })),
    ];
  },

  async redirects() {
    return [
      {
        source: "/apps",
        destination: "/",
        permanent: true,
      },
    ];
  },
});

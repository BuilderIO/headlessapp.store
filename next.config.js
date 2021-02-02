const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");
const withPlugins = require("next-compose-plugins");
const withTM = require("next-transpile-modules")([
  // "monaco-editor"
]);

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

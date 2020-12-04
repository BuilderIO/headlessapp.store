const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");

module.exports = {
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
        source: "/components",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

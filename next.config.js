module.exports = {
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

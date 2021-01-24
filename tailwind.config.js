const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
  purge: ["./**/*.tsx"],
  plugins: [require("@tailwindcss/typography"), require("@tailwindcss/ui")],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Avenir", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        primary: "#365C42",
        secondary: "#ecc94b",
        offwhite: "#F4F3E9",
        dark: "#0E201A",
        // ...
      },
    },
  },
  variants: {
    translate: ({ after }) => after(["group-hover"], "responsive"),
    opacity: ({ after }) => after(["group-hover"], "responsive"),
    scale: ({ after }) => after(["group-hover"], "responsive"),
  },
};

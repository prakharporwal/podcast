/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontSize: {
        "2xs": "0.675rem",
      },
      fontFamily: {
        sans: ["Proxima Nova", ...defaultTheme.fontFamily.sans],
      },
      gridTemplateColumns: { player: "1fr 2fr 1fr" },
      colors: {
        mygreen: "#1ed760",
        mygrey: {
          200: "#acacac",
          400: "#535353",
          500: "#171717",
          600: "#121212",
          700: "#242424",
          800: "#282828",
          900: "#a1a1a1",
        },
      },
      screens: {
        tall: { raw: "(min-height: 800px)" },
        xs: "320px",
      },
    },
  },
  plugins: [],
};

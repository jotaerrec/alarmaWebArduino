const colors = require("tailwindcss/colors");
module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
    colors: {
      accent: {
        50: "#fff",
        100: "#BFE1F7",
        200: "#A4D3F1",
        300: "#86C8F4",
        400: "#70C0F6",
        500: "#0099ff", //
        600: "#29A0F0",
        700: "#128BDD",
        750: "#0C75BB",
        800: "#2778AE",
      },
      black: colors.black,
      white: colors.white,
      red: colors.red,
      yellow: colors.amber,
      green: colors.emerald,
      blue: colors.lightBlue,
      pink: colors.pink,
      purple: colors.purple,
      gray: colors.gray,
    },
  },
  variants: {
    extend: {
      ringWidth: ["hover", "active", "focus"],
      ringColor: ["hover", "active", "focus"],
      backgroundColor: ["active"],
    },
  },
  plugins: [require("@tailwindcss/forms")],
};

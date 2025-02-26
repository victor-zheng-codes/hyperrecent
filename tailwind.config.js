module.exports = {
  mode: "jit",
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./design-system/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      xs: "400px",
      sm: "575px",
      md: "812px",
      lg: "1080px",
      xl: "1440px",
    },
    fontFamily: {
      sans: ["var(--font-inter)", "system-ui", "sans-serif"],
    },
    extend: {
      maxWidth: {
        standard: "var(--max-width)",
      },
      transitionProperty: {
        border: "border",
      },
      transitionDuration: {
        DEFAULT: "200ms",
        300: "300ms",
        400: "400ms",
      },
      transitionTimingFunction: {
        DEFAULT: "ease",
      },
      letterSpacing: {
        tag: "0.04em",
        heading: "-0.03em",
      },
      spacing: {
        outer: "var(--outer-gutter)",
        "header-height": "var(--header-height)",
      },
    },
  },
  plugins: [require("@tailwindcss/container-queries")],
};

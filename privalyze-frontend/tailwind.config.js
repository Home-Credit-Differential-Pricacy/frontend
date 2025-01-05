module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#ff6363",
        secondary: "#5856d6",
        accent: "#ffcc00",
      },
      fontFamily: {
        display: ["Poppins", "sans-serif"],
        body: ["Roboto", "sans-serif"],
      },
      backgroundImage: {
        'hero-gradient': "linear-gradient(to right, #ff7e5f, #feb47b)",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#ff6363",
          secondary: "#5856d6",
          accent: "#ffcc00",
          neutral: "#f4f4f9",
          "base-100": "#ffffff",
          info: "#3abff8",
          success: "#36d399",
          warning: "#fbbd23",
          error: "#f87272",
        },
      },
    ],
  },
};

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#ff6363",
        secondary: "#5856d6",
        accent: "#ffcc00",
        neutral: "#f4f4f9",
        info: "#3abff8",
        success: "#36d399",
        warning: "#fbbd23",
        error: "#f87272",
        darkBackground: "#1a1a2e", // Karanlık mod için ek renk
        lightBackground: "#ffffff", // Aydınlık mod için ek renk
      },
      fontFamily: {
        display: ["Poppins", "sans-serif"],
        body: ["Roboto", "sans-serif"],
        heading: ["Montserrat", "sans-serif"], // Başlık fontu
      },
      backgroundImage: {
        "hero-gradient": "linear-gradient(to right, #ff7e5f, #feb47b)",
        "dark-gradient": "linear-gradient(to right, #1a1a2e, #16213e)", // Karanlık mod için
        "light-gradient": "linear-gradient(to right, #ffffff, #f4f4f9)", // Aydınlık mod için
      },
      spacing: {
        72: "18rem",
        84: "21rem",
        96: "24rem",
      },
      boxShadow: {
        custom: "0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.06)", // Hafif gölge efekti
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
      {
        dark: {
          primary: "#1a1a2e",
          secondary: "#16213e",
          accent: "#ffcc00",
          neutral: "#0f3460",
          "base-100": "#1a1a2e",
          info: "#0078d7",
          success: "#21bf73",
          warning: "#ffb347",
          error: "#e63946",
        },
      },
    ],
  },
};

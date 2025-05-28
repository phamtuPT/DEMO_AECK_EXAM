/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      backgroundColor: {
        global: "#f8f8f8",
        primary: "#ce1628",
        secondary: "#db3b46",
        buttonDisable: "#f5f5f5",
      },
      boxShadow: {
        button: "0 2px 0 rgba(0, 0, 0, 0.045)",
        examItem: "0 4px 20px rgba(0,0,0,.03)",
      },
      fontFamily: {
        Lato: ["Lato", "sans-serif"],
      },
      colors: {
        primary: "#ce1628",
        secondary: "#db3b46",
        borderAuth: "#f5f5f5",
        authForm: "#252b2f",
        textAuth: "#262626",
        gray: "#8c8c8c",
        darkBlue: "#011F5B",
        borderDisable: "#d9d9d9",
        textDisable: "rgba(0,0,0,.25)",
        success: "#2eb553",
        successHover: "#4fc26a"
      },
      // transformOrigin: {
      //   model: "563.6px -23.6px",
      // },
    },
    screens: {
      xs: "380px",
      ss: "576px",
      sm: "768px",
      md: "992px",
      lg: "1200px",
    },
  },
  important: true,
  plugins: [],
};

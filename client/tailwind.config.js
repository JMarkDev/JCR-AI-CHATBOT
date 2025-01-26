/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class", // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        bgmain: "#f9f9f9",
      },
      height: {
        "screen-minus-navbar": "calc(100vh - 3.5rem)", // 3.5rem = 56px
      },
    },
  },
  plugins: [],
};

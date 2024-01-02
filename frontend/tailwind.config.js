/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        kowloon: {
          primary: "#003399",
          secondary: "#003366",
          accent: "#ff99ff",
          neutral: "#999999",
          "base-100": "#ffffff",
        },
      },
      "dark",
    ],
  },
};

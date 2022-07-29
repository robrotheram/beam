/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        'green': {
          '50': '#edfcf4',
          '100': '#d3f8e3',
          '200': '#aaf0cd',
          '300': '#73e2b1',
          '400': '#57d4a1',
          '500': '#17b278',
          '600': '#0b9061',
          '700': '#097350',
          '800': '#0a5b40',
          '900': '#094b37',
        },

        "blacks": {
          "50": "#E6E6E6",
          "100": "#CCCCCC",
          "200": "#9C9C9C",
          "300": "#696969",
          "400": "#383838",
          "500": "#050505",
          "600": "#050505",
          "700": "#030303",
          "800": "#030303",
          "900": "#000000"
        }
      },
    },
  },
  plugins: [],
}
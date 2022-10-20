/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/views/**/*.ejs',
    './node_modules/tw-elements/dist/js/**/*.js',
    './node_modules/popper.js/dist/cjs/**/*.js',
    './node_modules/popper.js/dist/esm/**/*.js',
    './node_modules/popper.js/dist/umd/**/*.js',
  ],
  theme: {
    extend: {
      colors: {
        black: '#01011A',
        primary: {
          100: '#0C3C62',
          200: '#0B3658',
          300: '#0A304E',
          400: '#082A45',
          500: '#07243B',
          600: '#061E31',
          700: '#051827',
          800: '#04121D',
          900: '#020C14',
        },
        secondary: {
          100: '#00909A',
          200: '#00828B',
          300: '#00737B',
          400: '#00656C',
          500: '#00565C',
          600: '#00484D',
          700: '#003A3E',
          800: '#002B2E',
          900: '#001D1F',
        },
        light: {
          100: '#F0FAFF',
          200: '#F1F1E6',
        },
      },
      fontFamily: {
        roboto: ['roboto', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('tailwindcss-debug-screens'),
    require('prettier-plugin-tailwindcss'),
    require('tw-elements/dist/plugin'),
  ],
};

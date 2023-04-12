/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './App.{js,jsx,ts,tsx}',
    './screens/**/*.{js,jsx,ts,tsx}',
    './layouts/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primaryDark: '#070707',
        secondaryDark: '#1E1E1E',
        tertiaryDark: '#444444',
        primaryWhite: '#fff',
        secondaryWhite: '#CCC9C9',
        accent: '#724CF9',
      },
      fontFamily: {
        MontserratBold: ['MontserratBold'],
        MontserratMedium: ['MontserratMedium'],
        MontserratRegular: ['MontserratRegular'],
      },
    },
  },
  plugins: [],
};

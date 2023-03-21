/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}', './index.html'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        nunito: ['Nunito', 'sans-serif']
      },
      padding: {
        18: '4.5rem'
      },
      margin: {
        18: '4.5rem'
      }
    }
  },
  plugins: [require('@headlessui/tailwindcss')]
}

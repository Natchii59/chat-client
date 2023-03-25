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
      },
      animation: {
        bar: 'bar-loader 3s ease-in-out infinite alternate'
      },
      colors: {
        blue: {
          450: '#4E94F8'
        },
        green: {
          450: '#36D26F'
        },
        red: {
          450: '#F45B5B'
        }
      }
    }
  },
  plugins: [require('@headlessui/tailwindcss')]
}

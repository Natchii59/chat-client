/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}', './index.html'],
  darkMode: 'media',
  theme: {
    extend: {
      padding: {
        18: '4.5rem'
      },
      margin: {
        18: '4.5rem'
      }
    }
  },
  plugins: []
}

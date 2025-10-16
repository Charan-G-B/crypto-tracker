const forms = require('@tailwindcss/forms')
const typography = require('@tailwindcss/typography')

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Poppins"', 'sans-serif'], // clean modern font
      },
      colors: {
        primary: {
          light: '#60a5fa', // Tailwind blue-400
          DEFAULT: '#3b82f6', // Tailwind blue-500
          dark: '#2563eb', // Tailwind blue-600
        },
      },
      boxShadow: {
        'soft': '0 4px 10px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [forms, typography],
}

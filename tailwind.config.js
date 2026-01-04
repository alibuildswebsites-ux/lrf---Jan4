/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./hooks/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
    "./*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
      },
      colors: {
        brand: {
          DEFAULT: '#4ADE80',
          dark: '#16A34A',
          light: '#ECFDF5',
          accent: '#22C55E',
          gradient: '#34D399',
        },
        charcoal: {
          DEFAULT: '#1F2937',
          dark: '#1A1A1A',
          stroke: '#374151',
        }
      }
    },
  },
  plugins: [],
}
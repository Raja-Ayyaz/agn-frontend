/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        orange: '#f65215',
        light: '#eae9ea',
        dark: '#0d0a09',
        muted: '#8a8b8c',
      },
    },
  },
  plugins: [],
}


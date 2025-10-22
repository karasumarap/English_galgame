/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'vn-bg': '#1a1a2e',
        'vn-dialog': '#16213e',
        'vn-text': '#eef1ff',
        'vn-accent': '#ff6b9d',
        'vn-choice': '#4a5568',
        'vn-choice-hover': '#718096',
      },
      fontFamily: {
        'ja': ['"Noto Sans JP"', 'sans-serif'],
        'en': ['"Inter"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

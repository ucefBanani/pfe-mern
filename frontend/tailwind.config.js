/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: '#0f172a',
        darkCard: '#1e293b',
        glassBorder: 'rgba(255, 255, 255, 0.08)',
        glassBg: 'rgba(30, 41, 59, 0.7)',
        accentPurple: '#8b5cf6',
        accentIndigo: '#6366f1',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          navy: '#0f172a',      // Slate 900 for deep institutional headers/bars
          dark: '#1e293b',      // Slate 800 for sidebars and primary nav
          blue: '#1d4ed8',      // Blue 700 for primary institutional actions
          blueHover: '#1e40af', // Blue 800
          lightBlue: '#eff6ff', // Blue 50 for active states
          saffron: '#d97706',   // Amber 600 for limited highlights
          success: '#15803d',   // Green 700 for resolved
          successBg: '#f0fdf4', // Green 50
          warning: '#b45309',   // Amber 700
          warningBg: '#fffbeb', // Amber 50
          danger: '#b91c1c',    // Red 700 for urgent
          dangerBg: '#fef2f2',  // Red 50
          border: '#e2e8f0',    // Slate 200
          surface: '#ffffff',
          background: '#f8fafc',// Slate 50
          muted: '#64748b'      // Slate 500
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

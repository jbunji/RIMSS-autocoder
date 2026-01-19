/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary military/professional theme
        primary: {
          DEFAULT: '#1E40AF',
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
        },
        // Status colors
        success: {
          DEFAULT: '#059669',
          light: '#10B981',
        },
        warning: {
          DEFAULT: '#D97706',
          light: '#F59E0B',
        },
        danger: {
          DEFAULT: '#DC2626',
        },
        // PMI color coding
        pmi: {
          red: '#DC2626',    // Due within 7 days
          yellow: '#F59E0B', // Due 8-30 days
          green: '#10B981',  // Due after 30 days
        },
        // CUI Banner
        cui: {
          bg: '#FEF3C7',
          text: '#000000',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'monospace'],
      },
    },
  },
  plugins: [],
}

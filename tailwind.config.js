/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx,css}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        brand: {
          DEFAULT: '#1767F6',
          hover: '#0E58DE',
          light: '#EBF2FE',
          subtle: '#D2E3FC',
        },
        page: '#FAF8F5',
        espresso: {
          DEFAULT: '#2C180E',
          dark: '#1F1109',
          card: '#351E12',
        },
      },
      borderRadius: {
        pill: '9999px',
      },
    },
  },
  plugins: [],
}

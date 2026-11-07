/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Prisma hero palette
        primary: '#DEDBC8',
        cream: '#E1E0CC',
        // Portfolio palette
        ivory: '#F5F0E6',
        sand: '#D9CBB8',
        sage: '#7F927A',
        olive: '#344438',
        terracotta: '#C88769',
        lavender: '#B9A9C9',
        // Text-safe deep variants (AA on ivory)
        clay: '#9C5B3F',
        moss: '#56684F',
      },
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['"DM Serif Display"', 'Georgia', 'serif'],
        mono: ['"Space Mono"', 'ui-monospace', 'monospace'],
        hand: ['Caveat', 'cursive'],
      },
    },
  },
  plugins: [],
}

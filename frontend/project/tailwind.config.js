import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Space Grotesk"', 'Inter', ...defaultTheme.fontFamily.sans],
        display: ['"Space Grotesk"', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        // Core dark palette
        midnight: '#010409',
        abyss: '#050b1d',
        onyx: '#0b1229',
        graphite: '#1c233b',

        // Accent cyan
        accent: {
          300: '#4dd3ff',
          400: '#31c3ff',
          500: '#1fb4f5',
        },

        // Muted neutrals
        slate: {
          100: '#dfe4ee',
          300: '#9ba5bb',
          500: '#6a738d',
          700: '#3a4054',
          900: '#121625',
        },

        // Updated navy-focused primary scale
        primary: {
          50: '#e5ecff',
          100: '#c3d1ff',
          200: '#93aefe',
          300: '#6387f4',
          400: '#3c5fdc',
          500: '#2343b4',
          600: '#172f84',
          700: '#101f59',
          800: '#0a1335',
          900: '#040918',
        },

        white: '#ffffff',
        black: '#000000',
      },
    },
  },
  plugins: [],
};

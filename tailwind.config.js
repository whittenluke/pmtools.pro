/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  safelist: [
    {
      pattern: /bg-(indigo|green|blue|purple|pink|yellow)-(50|900)/,
      variants: ['dark'],
    },
    {
      pattern: /border-(indigo|green|blue|purple|pink|yellow)-(200|800)/,
      variants: ['dark'],
    },
  ],
  theme: {
    extend: {
      keyframes: {
        'fade-out': {
          '0%, 75%': { opacity: '1' },
          '100%': { opacity: '0' }
        }
      },
      animation: {
        'fade-out': 'fade-out 1.5s ease-out forwards'
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar')({ nocompatible: true }),
  ],
};

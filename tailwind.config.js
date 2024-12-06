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
    extend: {},
  },
  plugins: [
    require('tailwind-scrollbar')({ nocompatible: true }),
  ],
};

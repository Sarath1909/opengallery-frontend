import { writeFileSync } from 'fs';

const tailwindConfig = `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {},
  },
  plugins: [],
};`;

const postcssConfig = `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};`;

writeFileSync('tailwind.config.js', tailwindConfig);
writeFileSync('postcss.config.js', postcssConfig);

console.log("Tailwind and PostCSS config files created!");

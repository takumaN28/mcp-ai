/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./content/**/*.{md,mdx}", // ナレッジMarkdownのスタイリングにも対応
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        reunion: {
          50: "#effef7",
          100: "#dafeef",
          200: "#b7fbde",
          300: "#7ef6c3",
          400: "#3ee8a1",
          500: "#15d07f",
          600: "#0aac67",
          700: "#0c8754",
          800: "#0f6a44",
          900: "#0e573a",
          950: "#01301f",
        },
        warmth: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
        },
        coral: {
          50: "#fff5f5",
          100: "#ffe0e0",
          200: "#ffc7c7",
          300: "#ffa0a0",
          400: "#ff6b6b",
          500: "#f94144",
          600: "#e53535",
          700: "#c12727",
          800: "#9f2222",
          900: "#832222",
        },
      },
    },
  },
  plugins: [],
};

export default config;

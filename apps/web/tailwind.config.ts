import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      colors: {
        sidebar: {
          DEFAULT: "rgb(30 41 59)",
          foreground: "rgb(226 232 240)",
          hover: "rgb(51 65 85)",
          active: "rgb(59 130 246)",
        },
      },
    },
  },
  plugins: [],
};
export default config;

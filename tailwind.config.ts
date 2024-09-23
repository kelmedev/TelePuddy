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
        primary: "#0094FF",   
        secondary: "#FF9800", 
        warning: "#FFC107",   
        success: "#4CAF50",   
      },
      fontFamily: {
        roboto: ['"Roboto"', 'sans-serif'], 
      },
    },
  },
  plugins: [],
};

export default config;

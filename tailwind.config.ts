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
        background: "#f8f9fc",
        foreground: "#1a1a2e",
        accent: {
          teal: "#14b8a6",
          "teal-light": "#99f6e4",
          orange: "#f97316",
          dark: "#1e293b",
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '20px',
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)',
        'card-hover': '0 4px 15px rgba(0,0,0,0.08)',
        'sidebar': '2px 0 15px rgba(0,0,0,0.04)',
      },
    },
  },
  plugins: [],
};
export default config;

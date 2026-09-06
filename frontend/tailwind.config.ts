import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        warm: {
          bg: '#faf9f6',        // Warm off-white
          surface: '#ffffff',   // White for cards
          primary: '#f97316',   // Saffron / Warm Orange
          secondary: '#16a34a', // Earthy Green
          text: '#1f2937',      // Deep Charcoal
          muted: '#6b7280',     // Gray 500
          border: '#e5e7eb',    // Gray 200
          hover: '#fff7ed',     // Light orange for hover states
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
export default config;

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
        terminal: {
          bg: '#000000',
          amber: '#ffb000',
          cyan: '#00ffff',
          green: '#00ff00',
          red: '#ff003c',
          text: '#cccccc'
        },
        warm: {
          bg: '#faf9f6',        // Off-white/cream
          surface: '#ffffff',
          primary: '#e65c00',   // Deep orange/rust
          secondary: '#2563eb', // Friendly blue
          text: '#1f2937',      // Slate 800
          muted: '#6b7280',     // Gray 500
          border: '#e5e7eb'     // Gray 200
        }
      },
      typography: {
        terminal: {
          css: {
            '--tw-prose-body': '#cccccc',
            '--tw-prose-headings': '#ffffff',
            '--tw-prose-links': '#00ffff',
            '--tw-prose-bold': '#ffffff',
            '--tw-prose-counters': '#00ffff',
            '--tw-prose-bullets': '#ffb000',
            '--tw-prose-hr': '#3f3f46',
            '--tw-prose-quotes': '#ffb000',
            '--tw-prose-quote-borders': '#ffb000',
            '--tw-prose-captions': '#666666',
            '--tw-prose-code': '#00ffff',
            '--tw-prose-pre-code': '#00ffff',
            '--tw-prose-pre-bg': '#000000',
            '--tw-prose-th-borders': '#3f3f46',
            '--tw-prose-td-borders': '#3f3f46',
          }
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
export default config;

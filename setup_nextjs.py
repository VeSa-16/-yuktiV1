import os
import json
from pathlib import Path

base = Path(r"d:\yukti\frontend")

# 1. package.json
package_json = {
  "name": "yukti-frontend",
  "version": "0.1.0",
  "private": True,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "14.2.5",
    "react": "^18",
    "react-dom": "^18"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "autoprefixer": "^10.4.19",
    "postcss": "^8",
    "tailwindcss": "^3.4.1",
    "typescript": "^5"
  }
}

with open(base / "package.json", "w") as f:
    json.dump(package_json, f, indent=2)

# 2. tsconfig.json
tsconfig = {
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": True,
    "skipLibCheck": True,
    "strict": True,
    "noEmit": True,
    "esModuleInterop": True,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": True,
    "isolatedModules": True,
    "jsx": "preserve",
    "incremental": True,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}

with open(base / "tsconfig.json", "w") as f:
    json.dump(tsconfig, f, indent=2)

# 3. tailwind.config.ts
tailwind_config = """import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
export default config;
"""
with open(base / "tailwind.config.ts", "w") as f:
    f.write(tailwind_config)

# 4. postcss.config.js
postcss_config = """module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
"""
with open(base / "postcss.config.js", "w") as f:
    f.write(postcss_config)

# 5. next.config.mjs
next_config = """/** @type {import('next').NextConfig} */
const nextConfig = {};

export default nextConfig;
"""
with open(base / "next.config.mjs", "w") as f:
    f.write(next_config)

# 6. app/layout.tsx
layout_tsx = """import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "YUKTI",
  description: "YUKTI Prototype",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
"""
with open(base / "app/layout.tsx", "w") as f:
    f.write(layout_tsx)

# 7. app/globals.css
globals_css = """@tailwind base;
@tailwind components;
@tailwind utilities;
"""
with open(base / "app/globals.css", "w") as f:
    f.write(globals_css)

print("Next.js boilerplate generated.")

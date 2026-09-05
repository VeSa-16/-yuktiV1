import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import { CopilotOverlay } from "@/components/CopilotOverlay";
import Link from "next/link";

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
      <body className={`${inter.className} min-h-screen flex flex-col bg-black text-terminal-text font-mono`}>
        <StoreProvider>
          {/* Global Header */}
          <header className="bg-black border-b-2 border-terminal-amber text-terminal-text shadow-none">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center justify-between">
              <Link href="/" className="flex items-center space-x-4">
                <span className="text-xl font-bold tracking-widest text-terminal-amber">YUKTI<span className="text-terminal-text ml-2">TERMINAL</span></span>
                <span className="text-xs font-mono text-terminal-cyan hidden sm:block border-l border-zinc-800 pl-4">
                  MARKET_INTELLIGENCE_SYS // CONNECTED
                </span>
              </Link>
            </div>
          </header>
          
          {/* Main Content Area */}
          <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
            {children}
          </main>
          
          <CopilotOverlay />
        </StoreProvider>
      </body>
    </html>
  );
}

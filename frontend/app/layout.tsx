import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import { CopilotOverlay } from "@/components/CopilotOverlay";
import { Sidebar } from "@/components/Sidebar";
import Link from "next/link";
import { Home, Compass, Map, PieChart, Target, Zap, Folder, FileText, MessageSquare, HelpCircle, Settings, User } from "lucide-react";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter", 
});

import { Viewport } from "next";

export const metadata: Metadata = {
  title: "YUKTI",
  description: "YUKTI 2.0 Platform",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "YUKTI",
  },
};

export const viewport: Viewport = {
  themeColor: "#f97316",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans min-h-screen flex bg-warm-bg text-warm-text`}>
        <StoreProvider>
          <Sidebar />

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
            {/* Mobile Header (Hidden on Desktop) */}
            <header className="md:hidden bg-warm-surface h-14 flex items-center px-4 border-b border-warm-border shadow-sm">
              <span className="text-xl font-bold tracking-tight text-warm-primary">YUKTI</span>
            </header>

            <main className="flex-1 overflow-y-auto bg-warm-bg">
              {children}
            </main>
          </div>
          
          <CopilotOverlay />
        </StoreProvider>
      </body>
    </html>
  );
}

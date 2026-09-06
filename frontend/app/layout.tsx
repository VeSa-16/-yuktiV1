import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import { CopilotOverlay } from "@/components/CopilotOverlay";
import Link from "next/link";
import { Home, Compass, Map, PieChart, Target, Zap, Folder, FileText, MessageSquare, HelpCircle, Settings, User } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "YUKTI",
  description: "YUKTI 2.0 Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex bg-warm-bg text-warm-text`}>
        <StoreProvider>
          {/* Persistent Sidebar */}
          <aside className="w-64 bg-black text-terminal-text hidden md:flex flex-col border-r border-zinc-800">
            <div className="p-6 border-b border-zinc-800">
              <Link href="/dashboard" className="flex items-center space-x-2">
                <span className="text-2xl font-bold tracking-widest text-terminal-amber font-mono">YUKTI</span>
              </Link>
            </div>
            
            <nav className="flex-1 overflow-y-auto py-4 px-3 font-mono text-sm space-y-1">
              <Link href="/dashboard" className="flex items-center px-3 py-2 rounded-md hover:bg-zinc-900 hover:text-white transition-colors">
                <Home size={18} className="mr-3 text-terminal-cyan" /> Dashboard
              </Link>
              <Link href="/discover" className="flex items-center px-3 py-2 rounded-md hover:bg-zinc-900 hover:text-white transition-colors">
                <Compass size={18} className="mr-3 text-terminal-cyan" /> Discover Business
              </Link>
              <Link href="/compare" className="flex items-center px-3 py-2 rounded-md hover:bg-zinc-900 hover:text-white transition-colors">
                <Map size={18} className="mr-3 text-terminal-cyan" /> Compare
              </Link>
              <Link href="/financials" className="flex items-center px-3 py-2 rounded-md hover:bg-zinc-900 hover:text-white transition-colors">
                <PieChart size={18} className="mr-3 text-terminal-cyan" /> Financials
              </Link>
              <Link href="/score/demo" className="flex items-center px-3 py-2 rounded-md hover:bg-zinc-900 hover:text-white transition-colors">
                <Target size={18} className="mr-3 text-terminal-cyan" /> YUKTI Score
              </Link>
              <Link href="/simulator" className="flex items-center px-3 py-2 rounded-md hover:bg-zinc-900 hover:text-white transition-colors">
                <Zap size={18} className="mr-3 text-terminal-cyan" /> What-If Simulator
              </Link>
              <Link href="/plans" className="flex items-center px-3 py-2 rounded-md hover:bg-zinc-900 hover:text-white transition-colors">
                <Folder size={18} className="mr-3 text-terminal-cyan" /> My Business Plans
              </Link>

              <div className="mt-8 mb-2 px-3 text-xs uppercase tracking-widest text-zinc-500">Tools</div>
              
              <Link href="/documents" className="flex items-center px-3 py-2 rounded-md hover:bg-zinc-900 hover:text-white transition-colors">
                <FileText size={18} className="mr-3 text-zinc-400" /> Documents
              </Link>
              <button className="w-full flex items-center px-3 py-2 rounded-md hover:bg-zinc-900 hover:text-white transition-colors">
                <MessageSquare size={18} className="mr-3 text-zinc-400" /> AI Copilot
              </button>
              <Link href="/help" className="flex items-center px-3 py-2 rounded-md hover:bg-zinc-900 hover:text-white transition-colors">
                <HelpCircle size={18} className="mr-3 text-zinc-400" /> Help & Guidance
              </Link>
            </nav>

            <div className="p-4 border-t border-zinc-800 font-mono text-xs">
              <Link href="/settings" className="flex items-center px-3 py-2 rounded-md hover:bg-zinc-900 hover:text-white transition-colors">
                <Settings size={16} className="mr-3" /> Settings
              </Link>
              <Link href="/profile" className="flex items-center px-3 py-2 rounded-md hover:bg-zinc-900 hover:text-white transition-colors">
                <User size={16} className="mr-3" /> Profile
              </Link>
              <div className="mt-2 px-3 flex items-center space-x-2 text-zinc-500">
                <span className="text-white">EN</span> | <span>हिं</span> | <span>मर</span>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
            {/* Mobile Header (Hidden on Desktop) */}
            <header className="md:hidden bg-black h-14 flex items-center px-4 border-b border-zinc-800">
              <span className="text-xl font-bold tracking-widest text-terminal-amber font-mono">YUKTI</span>
            </header>

            <main className="flex-1 overflow-y-auto">
              {children}
            </main>
          </div>
          
          <CopilotOverlay />
        </StoreProvider>
      </body>
    </html>
  );
}

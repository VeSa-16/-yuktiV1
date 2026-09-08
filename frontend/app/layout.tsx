import type { Metadata, Viewport } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import { Sidebar } from "@/components/Sidebar";
import NextTopLoader from 'nextjs-toploader';
import dynamic from "next/dynamic";
import Image from "next/image";

// Lazy-load CopilotOverlay: it imports framer-motion + API client.
// We don't need those on the initial page load for every route.
const CopilotOverlay = dynamic(
  () => import("@/components/CopilotOverlay").then((m) => ({ default: m.CopilotOverlay })),
  { ssr: false }
);

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});
export const metadata: Metadata = {
  title: "YUKTI — Business Planning Platform",
  description: "AI-powered business planning and market intelligence for Indian entrepreneurs.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "YUKTI",
  },
};

export const viewport: Viewport = {
  themeColor: "#f97316",
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className={`${fraunces.variable} ${jakarta.variable} font-sans min-h-screen bg-[#fdfbf6] text-ink antialiased flex flex-col`}>
        <NextTopLoader color="#ea580c" showSpinner={false} shadow="0 0 10px #ea580c,0 0 5px #ea580c" />
        <StoreProvider>
          <div className="flex min-h-screen w-full">
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-h-screen w-full">
              {/* Mobile Header (Hidden on Desktop) */}
              <header className="md:hidden bg-white h-14 flex items-center px-4 border-b border-premium-border shadow-sm shrink-0">
                <Image
                  src="/yukti-logo-transparent.png"
                  alt="YUKTI Logo"
                  width={32}
                  height={32}
                  className="object-contain mr-2 drop-shadow-sm -mt-0.5"
                  priority
                />
                <span className="text-xl font-bold tracking-tight text-[#ea580c]">YUKTI</span>
              </header>

              <main className="flex-1 w-full bg-[#fdfbf6]">
                {children}
              </main>
            </div>
            
            <CopilotOverlay />
          </div>
        </StoreProvider>
      </body>
    </html>
  );
}

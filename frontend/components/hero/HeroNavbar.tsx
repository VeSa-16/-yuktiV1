import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function HeroNavbar({ onGetStarted }: { onGetStarted: () => void }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="w-full absolute top-0 left-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-premium-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center group">
            <img
              src="/india-emblem.png"
              alt="Government of India"
              className="h-12 w-12 object-contain mr-3 transition-transform group-hover:scale-105"
            />
            <div className="flex flex-col justify-center">
              <span className="font-display font-bold text-3xl text-forest-deep tracking-tight leading-none group-hover:text-[#ea580c] transition-colors">YUKTI</span>
              <span className="text-[10px] font-bold text-ink-soft uppercase tracking-[0.2em] mt-1">Initiative by Government of India</span>
            </div>
          </Link>

          {/* Desktop Center Nav */}
          <div className="hidden md:flex space-x-8">
            <Link href="/" className="text-saffron font-bold text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron rounded">Home</Link>
            <Link href="/how-it-works" className="text-ink-soft hover:text-ink font-medium text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron rounded">How It Works</Link>
            <Link href="/about" className="text-ink-soft hover:text-ink font-medium text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron rounded">About</Link>
            <Link href="/support" className="text-ink-soft hover:text-ink font-medium text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron rounded">Support</Link>
          </div>

          {/* Desktop Right Nav */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="flex items-center text-ink-soft hover:text-ink text-sm font-bold bg-cream px-3 py-2 rounded-lg border border-premium-border">
              EN <ChevronDown size={16} className="ml-1" />
            </button>
            
            <button 
              onClick={onGetStarted}
              className="bg-[#f97316] hover:bg-[#ea580c] text-white px-6 py-2.5 rounded-lg text-sm font-bold flex items-center shadow-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-saffron"
            >
              Get Started
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-ink-soft hover:text-ink p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron rounded-md"
              aria-expanded={isMobileMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="md:hidden absolute top-24 left-4 right-4 bg-white rounded-2xl border border-premium-border shadow-card z-40"
          >
            <div className="px-4 pt-2 pb-6 space-y-2 flex flex-col">
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-3 rounded-md text-base font-bold text-saffron">Home</Link>
              <Link href="/how-it-works" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-3 rounded-md text-base font-medium text-ink hover:bg-cream">How It Works</Link>
              <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-3 rounded-md text-base font-medium text-ink hover:bg-cream">About</Link>
              <Link href="/support" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-3 rounded-md text-base font-medium text-ink hover:bg-cream">Support</Link>
              
              <div className="pt-4 mt-2 border-t border-premium-border-strong flex justify-between items-center px-3">
                <button className="flex items-center text-ink-soft text-sm font-bold bg-cream px-3 py-2 rounded-lg border border-premium-border">
                  EN <ChevronDown size={16} className="ml-1" />
                </button>
                <button 
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onGetStarted();
                  }}
                  className="bg-[#f97316] text-white px-5 py-2.5 rounded-lg text-sm font-bold flex items-center shadow-sm"
                >
                  Get Started
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

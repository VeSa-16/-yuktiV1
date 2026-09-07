"use client";

import React from 'react';
import { HeroNavbar } from './HeroNavbar';
import { HeroIntelligencePanel } from './HeroIntelligencePanel';
import { HeroFeatureStrip } from './HeroFeatureStrip';
import { ArrowRight } from 'lucide-react';
import { motion, useReducedMotion, Variants } from 'framer-motion';

interface HeroSectionProps {
  onStartEntrepreneur: () => void;
  onStartAdvisor: () => void;
}

export function HeroSection({ onStartEntrepreneur }: HeroSectionProps) {
  const shouldReduceMotion = useReducedMotion();

  const titleVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#fdfbf6] flex flex-col font-sans selection:bg-saffron-tint selection:text-saffron-deep">
      {/* Background Image Layer */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-no-repeat opacity-40 md:opacity-100"
          style={{ 
            backgroundImage: `url('/hero-bg.png')`,
            backgroundPosition: '80% bottom'
          }}
        />
        {/* Stronger gradient overlay to ensure text readability on the left */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#fdfbf6] from-30% via-[#fdfbf6]/90 via-55% to-transparent w-full z-0 pointer-events-none" />
        
        {/* Bottom fade into the feature strip */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#fdfbf6] to-transparent z-0 pointer-events-none" />
      </div>

      <HeroNavbar onGetStarted={onStartEntrepreneur} />

      {/* Main Hero Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 flex flex-col justify-center z-10 pt-28 pb-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full">
          
          {/* Left Column */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <motion.div
              initial="hidden"
              animate="show"
              variants={{
                hidden: { opacity: 0 },
                show: { opacity: 1, transition: { staggerChildren: 0.2 } }
              }}
            >
              <motion.h1 variants={titleVariants} className="font-display font-bold text-5xl lg:text-6xl xl:text-[64px] text-forest-deep leading-tight mb-6 tracking-tight max-w-2xl">
                Know what business works.<br />
                <span className="text-[#ea580c]">Know what</span> it <span className="text-[#ea580c]">takes</span> to <span className="text-[#ea580c]">build it</span>.
              </motion.h1>
              
              <motion.p variants={titleVariants} className="text-lg text-ink-soft mb-8 font-medium leading-relaxed max-w-lg">
                YUKTI helps aspiring entrepreneurs discover viable local business opportunities, understand market conditions, structure their finances, and build a practical business plan.
              </motion.p>

              <motion.div variants={titleVariants} className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={onStartEntrepreneur}
                  className="bg-[#ea580c] hover:bg-[#c2410c] text-white px-8 py-3.5 rounded-full text-sm font-bold flex items-center justify-center shadow-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-saffron"
                >
                  Start My Business Journey <ArrowRight size={18} className="ml-2" />
                </button>
                <button 
                  className="bg-white/50 backdrop-blur-sm hover:bg-white text-forest-deep border border-forest px-8 py-3.5 rounded-full text-sm font-bold flex items-center justify-center transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-forest shadow-sm"
                >
                  See How It Works
                </button>
              </motion.div>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-5 flex justify-end relative">
            <HeroIntelligencePanel />
          </div>

        </div>
      </main>

      <HeroFeatureStrip />
      
    </div>
  );
}

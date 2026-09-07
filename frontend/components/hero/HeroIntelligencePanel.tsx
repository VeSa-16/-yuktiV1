"use client";

import React from 'react';
import { motion, useReducedMotion, Variants } from 'framer-motion';
import { MapPin, Shield, ArrowDown, Leaf, Target, TrendingUp, Wallet, ShieldAlert, User, ChevronDown } from 'lucide-react';

export function HeroIntelligencePanel() {
  const shouldReduceMotion = useReducedMotion();

  // Floating animation configuration
  const floatAnim = {
    y: shouldReduceMotion ? 0 : [0, -8, 0],
    transition: {
      duration: 6,
      ease: "easeInOut" as const,
      repeat: Infinity,
    }
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <div className="relative w-full max-w-sm mx-auto lg:ml-auto z-10 pt-10 lg:pt-0">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="flex flex-col items-center w-full"
      >
        {/* 1. Profile Card */}
        <motion.div variants={itemVariants} animate={floatAnim} className="w-full bg-white rounded-2xl p-4 shadow-sm border border-forest z-30 relative">
          <h3 className="text-base font-bold text-forest-deep mb-2">
            <span className="text-[#ea580c]">Y</span>our Profile
          </h3>
          <div className="space-y-2">
            <div className="flex items-center text-sm font-medium text-ink">
              <User className="w-5 h-5 text-forest mr-3" />
              <span>₹1,00,000</span>
            </div>
            <div className="flex items-center text-sm font-medium text-ink">
              <MapPin className="w-5 h-5 text-forest mr-3" />
              <span>Solapur, Maharashtra</span>
            </div>
            <div className="flex items-center text-sm font-medium text-ink">
              <Shield className="w-5 h-5 text-forest mr-3" />
              <span>Transport</span>
            </div>
          </div>
        </motion.div>

        {/* Connector 1 */}
        <motion.div variants={itemVariants} className="flex flex-col items-center z-20 -my-1">
          <div className="w-px h-5 bg-forest opacity-50"></div>
          <ChevronDown size={14} className="text-forest -mt-1" />
        </motion.div>

        {/* 2. Intelligence Card */}
        <motion.div variants={itemVariants} animate={{...floatAnim, transition: {...floatAnim.transition, delay: 0.5}}} className="w-full bg-white rounded-2xl p-4 shadow-sm border border-forest z-30 mt-1 relative">
          <div className="flex items-center mb-3">
            <Leaf className="w-4 h-4 text-saffron mr-2" fill="currentColor" />
            <h3 className="text-base font-bold text-forest-deep">YUKTI Intelligence</h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center text-ink font-medium">
                <TrendingUp className="w-4 h-4 text-forest mr-3" /> Demand
              </div>
              <span className="font-bold text-forest">High</span>
            </div>
            
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center text-ink font-medium">
                <Target className="w-4 h-4 text-forest mr-3" /> Competition
              </div>
              <span className="font-bold text-forest-deep">Medium</span>
            </div>
            
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center text-ink font-medium">
                <Wallet className="w-4 h-4 text-forest mr-3" /> Capital Fit
              </div>
              <span className="font-bold text-forest">High</span>
            </div>
            
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center text-ink font-medium">
                <ShieldAlert className="w-4 h-4 text-forest mr-3" /> Risk
              </div>
              <span className="font-bold text-forest">Low</span>
            </div>
          </div>
        </motion.div>

        {/* Connector 2 */}
        <motion.div variants={itemVariants} className="flex flex-col items-center z-20 -my-1">
          <div className="w-px h-5 bg-forest opacity-50"></div>
          <ChevronDown size={14} className="text-forest -mt-1" />
        </motion.div>

        {/* 3. Score Card */}
        <motion.div variants={itemVariants} animate={{...floatAnim, transition: {...floatAnim.transition, delay: 1}}} className="w-[85%] bg-white rounded-2xl p-4 shadow-sm border border-premium-border z-30 mt-1 flex flex-col items-center justify-center relative">
          <h3 className="text-base font-bold text-forest-deep mb-2">
            <span className="text-[#ea580c]">Y</span>UKTI Score
          </h3>
          
          <div className="relative w-20 h-20 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle 
                cx="50" cy="50" r="38" 
                stroke="currentColor" strokeWidth="8" fill="transparent"
                className="text-forest-tint"
              />
              <motion.circle
                cx="50" cy="50" r="38"
                stroke="currentColor" strokeWidth="8" fill="transparent"
                strokeLinecap="round"
                className="text-forest"
                initial={{ strokeDasharray: 238.76, strokeDashoffset: 238.76 }}
                whileInView={{ strokeDashoffset: 238.76 - (84 / 100) * 238.76 }}
                viewport={{ once: true }}
                transition={{ duration: shouldReduceMotion ? 0 : 1.5, ease: "easeOut", delay: 0.5 }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-display font-bold text-3xl text-forest-deep leading-none">84</span>
            </div>
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
}

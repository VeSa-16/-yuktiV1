"use client";

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export function YuktiScoreCard() {
  const shouldReduceMotion = useReducedMotion();
  const circleCircumference = 2 * Math.PI * 38; // r=38
  const score = 84;
  const strokeDashoffset = circleCircumference - (score / 100) * circleCircumference;

  return (
    <div className="bg-white rounded-3xl p-5 shadow-card border border-premium-border flex-1 min-w-[200px]">
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-sm font-bold text-ink">YUKTI Score</h3>
        {/* Breathing dot */}
        <motion.div 
          className="w-2 h-2 rounded-full bg-forest"
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{ 
            duration: shouldReduceMotion ? 0 : 4, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
      </div>

      <div className="flex items-center gap-4 mb-3">
        {/* Animated SVG Ring */}
        <div className="relative w-20 h-20 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background track */}
            <circle 
              cx="50" cy="50" r="38" 
              stroke="currentColor" strokeWidth="8" fill="transparent"
              className="text-forest-tint"
            />
            {/* Progress ring */}
            <motion.circle
              cx="50" cy="50" r="38"
              stroke="currentColor" strokeWidth="8" fill="transparent"
              strokeLinecap="round"
              className="text-forest"
              initial={{ strokeDasharray: circleCircumference, strokeDashoffset: circleCircumference }}
              whileInView={{ strokeDashoffset }}
              viewport={{ once: true }}
              transition={{ duration: shouldReduceMotion ? 0 : 1.5, ease: "easeOut", delay: 0.5 }}
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <span className="font-display font-bold text-2xl text-forest">{score}</span>
          </div>
        </div>

        <div>
          <div className="text-base font-bold text-forest">Strong<br/>Opportunity</div>
        </div>
      </div>

      <p className="text-xs text-ink-soft leading-relaxed">
        Based on market opportunity, capital fit, demand, competition and risk.
      </p>
    </div>
  );
}

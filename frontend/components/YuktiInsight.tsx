import React from 'react';
import { Bot, Sparkles, TrendingUp, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

export type InsightType = 'info' | 'positive' | 'warning' | 'terminal';

interface YuktiInsightProps {
  title?: string;
  message: string | React.ReactNode;
  type?: InsightType;
  className?: string;
}

export function YuktiInsight({ title = "YUKTI INSIGHT", message, type = 'terminal', className = "" }: YuktiInsightProps) {
  
  const getStyles = () => {
    switch (type) {
      case 'info':
        return 'bg-blue-500/10 border-blue-500/30 text-blue-400';
      case 'positive':
        return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400';
      case 'warning':
        return 'bg-amber-500/10 border-amber-500/30 text-amber-400';
      case 'terminal':
      default:
        return 'bg-black border-terminal-cyan/30 text-terminal-cyan shadow-[0_0_15px_rgba(0,255,255,0.1)]';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'info': return <Sparkles size={16} className="mr-2 flex-shrink-0" />;
      case 'positive': return <TrendingUp size={16} className="mr-2 flex-shrink-0" />;
      case 'warning': return <AlertTriangle size={16} className="mr-2 flex-shrink-0" />;
      case 'terminal':
      default: return <Bot size={16} className="mr-2 flex-shrink-0" />;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className={`border p-4 flex flex-col sm:flex-row items-start font-mono ${getStyles()} ${className}`}
    >
      <div className="flex items-center mb-2 sm:mb-0 sm:mr-4 mt-0.5">
        {getIcon()}
        <span className="text-[10px] font-bold uppercase tracking-widest block sm:hidden">{title}</span>
      </div>
      <div>
        <h4 className="text-[10px] font-bold uppercase tracking-widest mb-1 hidden sm:block opacity-70">{title}</h4>
        <div className="text-sm leading-relaxed text-zinc-300">
          {message}
        </div>
      </div>
    </motion.div>
  );
}

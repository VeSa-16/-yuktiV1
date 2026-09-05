"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { api } from "@/lib/api-client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProgressStepper } from "@/components/ProgressStepper";
import { formatCurrency, formatPercentage } from "@/lib/formatters";
import { MapPin, TrendingUp, Users, ArrowRight, CheckCircle2, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const itemVariants: any = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function ResultsPage() {
  const router = useRouter();
  const { state, updateState } = useStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!state.sessionId) {
      router.push("/");
      return;
    }

    const fetchResults = async () => {
      try {
        const res = await api.rankOpportunities({
          session_id: state.sessionId!,
          location_id: state.locationId!,
          margin_capital: state.marginCapital!
        });
        updateState({ opportunities: res.rankings });
      } catch (err: any) {
        setError(err.message || "Failed to load opportunities");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [state.sessionId, router, updateState]);

  const handleSelect = (categoryId: string, categoryName: string) => {
    updateState({ categoryId, categoryName });
    router.push(`/category/${categoryId}`);
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto mt-10">
        <ProgressStepper />
        <div className="h-64 flex flex-col items-center justify-center space-y-4">
          <div className="w-12 h-12 border-4 border-zinc-800 border-t-terminal-cyan rounded-none animate-spin"></div>
          <p className="text-terminal-cyan font-mono uppercase tracking-widest animate-pulse">Running demographic models...</p>
        </div>
      </div>
    );
  }

  if (error || !state.opportunities.length) {
    return <div className="text-red-500 p-4">{error || "No opportunities found."}</div>;
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-5xl mx-auto mt-10 pb-20"
    >
      <ProgressStepper />
      
      <div className="mb-10 text-center sm:text-left border-b border-zinc-800 pb-4">
        <h1 className="text-2xl font-mono text-white tracking-widest uppercase mb-2">Ranked Opportunities</h1>
        <p className="text-terminal-cyan font-mono text-xs uppercase tracking-widest">
          SYS_QUERY: {state.locationName} | CAPITAL_CAP: {state.marginCapital}
        </p>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-6"
      >
        {state.opportunities.map((opp: any, index: number) => (
          <motion.div key={opp.category_id} variants={itemVariants}>
            <Card className="hover:border-terminal-cyan transition-colors duration-100 group cursor-pointer overflow-hidden border-zinc-800" onClick={() => handleSelect(opp.category_id, opp.category_name)}>
              <div className="flex flex-col md:flex-row">
                <div className="p-4 flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-xl font-bold font-mono text-white mb-1 group-hover:text-terminal-cyan transition-colors uppercase">{opp.category_name}</h2>
                      <div className="flex items-center space-x-4 text-xs font-mono text-zinc-500 uppercase tracking-widest">
                        <span className="flex items-center"><MapPin size={12} className="mr-1" /> {state.locationName}</span>
                        <span className="flex items-center"><TrendingUp size={12} className="mr-1" /> Conf: {opp.confidence}</span>
                      </div>
                    </div>
                    
                    <div className="bg-black text-terminal-amber px-3 py-1 border border-terminal-amber font-mono text-xl flex flex-col items-center justify-center leading-none">
                      {opp.yukti_score.toFixed(0)}
                      <span className="text-[9px] text-zinc-500 uppercase mt-1 tracking-widest">Score</span>
                    </div>
                  </div>
                  
                  <p className="text-terminal-text mb-4 font-mono text-sm bg-zinc-900 p-2 border-l-2 border-zinc-700">"{opp.verdict}"</p>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div className="bg-black p-2 border border-zinc-800">
                      <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Net Profit</p>
                      <p className="font-mono text-terminal-green font-bold">{opp.net_profit ? formatCurrency(opp.net_profit) : "N/A"}</p>
                    </div>
                    <div className="bg-black p-2 border border-zinc-800">
                      <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">ROI</p>
                      <p className="font-mono text-terminal-text font-bold">{opp.roi ? `${opp.roi.toFixed(1)}%` : "N/A"}</p>
                    </div>
                    <div className="bg-black p-2 border border-zinc-800">
                      <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">DSCR</p>
                      <p className="font-mono text-terminal-text font-bold">{opp.dscr ? opp.dscr.toFixed(2) : "N/A"}</p>
                    </div>
                    <div className="bg-black p-2 border border-zinc-800">
                      <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">EMI</p>
                      <p className="font-mono text-terminal-red font-bold">{opp.emi ? formatCurrency(opp.emi) : "N/A"}</p>
                    </div>
                  </div>
                  
                  {opp.highlights && opp.highlights.length > 0 && (
                    <div className="mt-4 flex gap-2 flex-wrap">
                      {opp.highlights.map((h: string, i: number) => (
                        <span key={i} className="bg-zinc-900 text-zinc-400 border border-zinc-700 px-2 py-0.5 text-[10px] uppercase font-mono tracking-widest">{h}</span>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="bg-zinc-900 md:w-48 p-4 flex flex-col justify-center items-center border-t md:border-t-0 md:border-l border-zinc-800">
                  <h4 className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest mb-3">AI Verdict</h4>
                  <div className="flex flex-col items-center text-center space-y-3">
                    {opp.yukti_score >= 70 ? (
                      <CheckCircle2 size={24} className="text-terminal-green" />
                    ) : (
                      <ShieldAlert size={24} className="text-terminal-amber" />
                    )}
                    <span className="text-xs font-mono text-zinc-300 uppercase">
                      {opp.yukti_score >= 70 ? "HIGHLY VIABLE" : "VIABLE WITH RISK"}
                    </span>
                    <Button variant="outline" className="mt-2 w-full text-xs" onClick={(e) => { e.stopPropagation(); handleSelect(opp.category_id, opp.category_name); }}>
                      EXEC_DEEP_DIVE <ArrowRight size={14} className="ml-2" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}

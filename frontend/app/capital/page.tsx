"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProgressStepper } from "@/components/ProgressStepper";
import { useStore } from "@/lib/store";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function CapitalPage() {
  const router = useRouter();
  const { state, updateState } = useStore();
  const [marginCapital, setMarginCapital] = useState("50000");

  useEffect(() => {
    if (!state.sessionId) {
      router.push("/");
    }
  }, [state.sessionId, router]);

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!marginCapital) return;
    
    updateState({ marginCapital: parseInt(marginCapital) });
    router.push("/results");
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 flex flex-col items-center justify-center p-4"
    >
      <div className="w-full max-w-2xl mb-8">
        <ProgressStepper />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full max-w-lg"
      >
        <Card className="border-t-4 border-t-terminal-cyan">
          <CardHeader className="text-left pb-4 border-b border-zinc-800 mb-4">
            <CardTitle className="text-sm font-mono text-zinc-400 uppercase tracking-widest">Input Parameter: Capital</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-terminal-text font-mono mb-6 uppercase tracking-wider">
              ENTER MARGIN CAPITAL TO INITIALIZE LOAN STRUCTURE SIMULATION
            </p>
            <form onSubmit={handleContinue} className="space-y-5">
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-terminal-cyan font-bold text-lg">₹</span>
                <input
                  type="number"
                  className="w-full rounded-none border border-zinc-700 bg-black pl-10 pr-4 py-4 text-2xl font-mono text-terminal-cyan transition-all duration-100 focus:outline-none focus:border-terminal-cyan focus:ring-1 focus:ring-terminal-cyan"
                  placeholder="50000"
                  value={marginCapital}
                  onChange={(e) => setMarginCapital(e.target.value)}
                  required
                />
              </div>
              <div className="flex justify-between text-xs font-mono text-zinc-500 px-2 uppercase tracking-widest">
                <span>Min: ₹10,000</span>
                <span>Max: ₹5,00,000</span>
              </div>
              
              <Button type="submit" variant="secondary" className="w-full mt-6 py-4" disabled={!marginCapital}>
                Execute Market Analysis <ArrowRight size={16} className="ml-2" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

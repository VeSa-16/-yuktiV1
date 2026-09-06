"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProgressStepper } from "@/components/ProgressStepper";
import { formatCurrency, formatPercentage } from "@/lib/formatters";
import { api } from "@/lib/api-client";
import { Loader2, TrendingUp, AlertTriangle, ArrowRight, Settings2, BarChart4, ArrowDown, ArrowUp } from "lucide-react";
import { motion } from "framer-motion";
import { YuktiInsight } from "@/components/YuktiInsight";

export default function SimulatorPage() {
  const router = useRouter();
  const state = useStore();
  const [loading, setLoading] = useState(true);
  
  const [baseParams, setBaseParams] = useState<any>(null);
  
  const [simParams, setSimParams] = useState({
    demand_multiplier: 1.0,
    cost_multiplier: 1.0,
    price_multiplier: 1.0
  });

  const [simResults, setSimResults] = useState<any>(null);
  const [simLoading, setSimLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!state.sessionId || !state.categoryId) {
      router.push("/");
      return;
    }

    const fetchBase = async () => {
      try {
        const res = await api.getRecommendation({
          session_id: state.sessionId!
        });
        setBaseParams(res);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || "Failed to load base parameters");
        setLoading(false);
      }
    };

    fetchBase();
  }, [state, router]);

  const runSimulation = async () => {
    setSimLoading(true);
    try {
      const res = await api.simulate({
        session_id: state.sessionId!,
        revenue_delta_pct: simParams.demand_multiplier,
        cost_delta_pct: simParams.cost_multiplier,
      });
      setSimResults(res);
    } catch (err: any) {
      setError(err.message || "Simulation failed");
    } finally {
      setSimLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto mt-10">
        <ProgressStepper />
        <div className="h-64 flex justify-center items-center">
          <Loader2 size={48} className="animate-spin text-terminal-cyan" />
        </div>
      </div>
    );
  }

  if (error || !baseParams) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-5xl mx-auto mt-10 pb-20"
    >
      <ProgressStepper />
      
      <div className="flex flex-col sm:flex-row justify-between items-center sm:items-end mb-8 gap-4 border-b border-zinc-800 pb-4">
        <div>
          <h1 className="text-2xl font-mono text-white tracking-widest uppercase">What-If <span className="text-terminal-cyan">Simulator</span></h1>
          <p className="text-terminal-cyan mt-2 text-xs font-mono uppercase tracking-widest">STRESS TEST FOR // {state.categoryName}</p>
        </div>
        <Button onClick={() => router.push('/report')} variant="outline" className="text-xs">
          GENERATE_FINAL_REPORT <ArrowRight size={14} className="ml-2" />
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls */}
        <Card className="lg:col-span-1 border-zinc-800">
          <CardHeader className="bg-zinc-900 pb-4 border-b border-zinc-800">
            <CardTitle className="text-xs font-mono text-zinc-400 uppercase tracking-widest flex items-center">
              <Settings2 size={14} className="mr-2 text-terminal-cyan" />
              Scenario Variables
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-8">
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-[10px] font-mono text-zinc-300 uppercase tracking-widest">Demand Volume</label>
                <span className="text-[10px] font-mono font-bold text-black bg-terminal-cyan px-2 py-0.5 uppercase tracking-widest">{(simParams.demand_multiplier * 100).toFixed(0)}%</span>
              </div>
              <input 
                type="range" 
                min="0.5" max="1.5" step="0.1" 
                value={simParams.demand_multiplier}
                onChange={(e) => setSimParams({...simParams, demand_multiplier: parseFloat(e.target.value)})}
                className="w-full h-1 bg-zinc-800 appearance-none cursor-pointer accent-terminal-cyan"
              />
              <div className="flex justify-between text-[9px] font-mono text-zinc-600 uppercase tracking-widest mt-2">
                <span>-50% (Recession)</span>
                <span>+50% (Boom)</span>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-[10px] font-mono text-zinc-300 uppercase tracking-widest">Operating Costs</label>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 text-black uppercase tracking-widest ${simParams.cost_multiplier > 1 ? 'bg-terminal-red' : 'bg-terminal-green'}`}>{(simParams.cost_multiplier * 100).toFixed(0)}%</span>
              </div>
              <input 
                type="range" 
                min="0.8" max="1.5" step="0.1" 
                value={simParams.cost_multiplier}
                onChange={(e) => setSimParams({...simParams, cost_multiplier: parseFloat(e.target.value)})}
                className="w-full h-1 bg-zinc-800 appearance-none cursor-pointer accent-terminal-red"
              />
              <div className="flex justify-between text-[9px] font-mono text-zinc-600 uppercase tracking-widest mt-2">
                <span>-20% (Optimized)</span>
                <span>+50% (Inflation)</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-[10px] font-mono text-zinc-300 uppercase tracking-widest">Selling Price</label>
                <span className="text-[10px] font-mono font-bold text-black bg-terminal-amber px-2 py-0.5 uppercase tracking-widest">{(simParams.price_multiplier * 100).toFixed(0)}%</span>
              </div>
              <input 
                type="range" 
                min="0.8" max="1.3" step="0.05" 
                value={simParams.price_multiplier}
                onChange={(e) => setSimParams({...simParams, price_multiplier: parseFloat(e.target.value)})}
                className="w-full h-1 bg-zinc-800 appearance-none cursor-pointer accent-terminal-amber"
              />
              <div className="flex justify-between text-[9px] font-mono text-zinc-600 uppercase tracking-widest mt-2">
                <span>-20% (Price War)</span>
                <span>+30% (Premium)</span>
              </div>
            </div>

            <Button 
              className="w-full mt-4 bg-terminal-cyan text-black hover:bg-terminal-cyan/80 font-bold" 
              onClick={runSimulation}
              disabled={simLoading}
            >
              {simLoading ? <Loader2 className="animate-spin mr-2" size={18} /> : <BarChart4 className="mr-2" size={18} />}
              Run Stress Test
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        <Card className="lg:col-span-2 border-zinc-800 bg-black">
          <CardHeader className="bg-zinc-900 pb-4 border-b border-zinc-800">
            <CardTitle className="text-xs font-mono text-zinc-400 uppercase tracking-widest flex items-center">
              <TrendingUp size={14} className="mr-2 text-terminal-cyan" />
              Impact Analysis (BEFORE / AFTER)
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {!simResults ? (
              <div className="h-64 flex flex-col items-center justify-center text-zinc-600 border border-dashed border-zinc-800 bg-black">
                <Settings2 size={48} className="mb-4 opacity-50" />
                <p className="text-[10px] font-mono uppercase tracking-widest">Adjust variables and run simulation to see impact.</p>
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-2 gap-4">
                  {/* BEFORE Card */}
                  <div className="bg-zinc-900 border border-zinc-800 p-4">
                    <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-4 border-b border-zinc-800 pb-2">Original State</div>
                    <div className="space-y-4">
                      <div>
                        <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">ROI</div>
                        <div className="text-2xl font-mono text-white">{baseParams.roi.toFixed(1)}%</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">DSCR</div>
                        <div className="text-2xl font-mono text-white">{baseParams.dscr.toFixed(2)}x</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* AFTER Card */}
                  <div className={`border p-4 ${simResults.survives_stress ? 'bg-terminal-green/5 border-terminal-green/30' : 'bg-terminal-red/5 border-terminal-red/30'}`}>
                    <div className="text-[10px] font-mono text-zinc-300 uppercase tracking-widest mb-4 border-b border-zinc-800 pb-2 flex justify-between items-center">
                      Simulated State
                      {simResults.survives_stress ? (
                        <span className="bg-terminal-green/20 text-terminal-green px-2 py-0.5 text-[8px]">PASS</span>
                      ) : (
                        <span className="bg-terminal-red/20 text-terminal-red px-2 py-0.5 text-[8px]">FAIL</span>
                      )}
                    </div>
                    <div className="space-y-4">
                      <div>
                        <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">ROI</div>
                        <div className="flex items-center">
                          <div className={`text-2xl font-mono font-bold ${simResults.simulated_roi >= baseParams.roi ? 'text-terminal-green' : 'text-terminal-red'}`}>
                            {simResults.simulated_roi.toFixed(1)}%
                          </div>
                          {simResults.simulated_roi >= baseParams.roi ? <ArrowUp size={14} className="text-terminal-green ml-2" /> : <ArrowDown size={14} className="text-terminal-red ml-2" />}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">DSCR</div>
                        <div className="flex items-center">
                          <div className={`text-2xl font-mono font-bold ${simResults.simulated_dscr >= baseParams.dscr ? 'text-terminal-green' : 'text-terminal-red'}`}>
                            {simResults.simulated_dscr.toFixed(2)}x
                          </div>
                          {simResults.simulated_dscr >= baseParams.dscr ? <ArrowUp size={14} className="text-terminal-green ml-2" /> : <ArrowDown size={14} className="text-terminal-red ml-2" />}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <YuktiInsight 
                  type={simResults.survives_stress ? 'positive' : 'warning'}
                  title={simResults.survives_stress ? "BUSINESS SURVIVES STRESS" : "HIGH RISK OF DEFAULT"}
                  message={simResults.ai_insight}
                />
              </motion.div>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}

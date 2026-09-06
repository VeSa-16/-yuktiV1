"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProgressStepper } from "@/components/ProgressStepper";
import { api } from "@/lib/api-client";
import { Loader2, TrendingUp, AlertTriangle, ArrowRight, Settings2, BarChart4, ArrowDown, ArrowUp, Activity } from "lucide-react";
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
          <Loader2 size={48} className="animate-spin text-warm-primary" />
        </div>
      </div>
    );
  }

  if (error || !baseParams) {
    return <div className="text-red-500 p-4 font-bold bg-red-50 rounded-xl m-4 border border-red-200">{error}</div>;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-5xl mx-auto p-4 md:p-8 pb-20 font-sans"
    >
      <ProgressStepper />
      
      <div className="flex flex-col sm:flex-row justify-between items-center sm:items-end mb-8 gap-4 border-b border-warm-border pb-6 mt-4">
        <div>
          <h1 className="text-3xl font-bold text-warm-text flex items-center">
            <Activity className="mr-3 text-warm-primary" size={32} />
            What-If Simulator
          </h1>
          <p className="text-warm-muted mt-2 font-medium">Test different scenarios for <strong className="text-warm-text">{state.categoryName}</strong></p>
        </div>
        <Button onClick={() => router.push('/report')} className="bg-warm-bg text-warm-primary border border-warm-primary hover:bg-warm-primary hover:text-white transition-colors shadow-sm font-bold">
          Generate Final Report <ArrowRight size={16} className="ml-2" />
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls */}
        <Card className="lg:col-span-1 border-warm-border shadow-sm bg-warm-surface rounded-2xl overflow-hidden">
          <CardHeader className="bg-warm-bg/50 pb-4 border-b border-warm-border">
            <CardTitle className="text-sm font-bold text-warm-text flex items-center uppercase tracking-wider">
              <Settings2 size={16} className="mr-2 text-warm-primary" />
              Scenario Variables
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-8">
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-bold text-warm-text">Demand Volume</label>
                <span className="text-xs font-bold text-white bg-warm-primary px-2 py-1 rounded-md">{(simParams.demand_multiplier * 100).toFixed(0)}%</span>
              </div>
              <input 
                type="range" 
                min="0.5" max="1.5" step="0.1" 
                value={simParams.demand_multiplier}
                onChange={(e) => setSimParams({...simParams, demand_multiplier: parseFloat(e.target.value)})}
                className="w-full h-2 bg-warm-border rounded-lg appearance-none cursor-pointer accent-warm-primary"
              />
              <div className="flex justify-between text-xs font-semibold text-warm-muted mt-2">
                <span>-50% (Low)</span>
                <span>+50% (High)</span>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-bold text-warm-text">Operating Costs</label>
                <span className={`text-xs font-bold text-white px-2 py-1 rounded-md ${simParams.cost_multiplier > 1 ? 'bg-red-500' : 'bg-emerald-500'}`}>{(simParams.cost_multiplier * 100).toFixed(0)}%</span>
              </div>
              <input 
                type="range" 
                min="0.8" max="1.5" step="0.1" 
                value={simParams.cost_multiplier}
                onChange={(e) => setSimParams({...simParams, cost_multiplier: parseFloat(e.target.value)})}
                className="w-full h-2 bg-warm-border rounded-lg appearance-none cursor-pointer accent-red-500"
              />
              <div className="flex justify-between text-xs font-semibold text-warm-muted mt-2">
                <span>-20% (Optimized)</span>
                <span>+50% (Inflation)</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-bold text-warm-text">Selling Price</label>
                <span className="text-xs font-bold text-white bg-amber-500 px-2 py-1 rounded-md">{(simParams.price_multiplier * 100).toFixed(0)}%</span>
              </div>
              <input 
                type="range" 
                min="0.8" max="1.3" step="0.05" 
                value={simParams.price_multiplier}
                onChange={(e) => setSimParams({...simParams, price_multiplier: parseFloat(e.target.value)})}
                className="w-full h-2 bg-warm-border rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <div className="flex justify-between text-xs font-semibold text-warm-muted mt-2">
                <span>-20% (Drop)</span>
                <span>+30% (Premium)</span>
              </div>
            </div>

            <Button 
              className="w-full mt-4 bg-warm-primary text-white hover:bg-orange-600 font-bold py-6 rounded-xl shadow-md transition-all text-base" 
              onClick={runSimulation}
              disabled={simLoading}
            >
              {simLoading ? <Loader2 className="animate-spin mr-2" size={20} /> : <BarChart4 className="mr-2" size={20} />}
              Run Stress Test
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        <Card className="lg:col-span-2 border-warm-border bg-warm-surface shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="bg-warm-bg/50 pb-4 border-b border-warm-border">
            <CardTitle className="text-sm font-bold text-warm-text flex items-center uppercase tracking-wider">
              <TrendingUp size={16} className="mr-2 text-warm-primary" />
              Impact Analysis (Before & After)
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {!simResults ? (
              <div className="h-64 flex flex-col items-center justify-center text-warm-muted border-2 border-dashed border-warm-border rounded-xl bg-warm-bg/50">
                <Settings2 size={48} className="mb-4 text-warm-border" />
                <p className="font-semibold">Adjust the sliders and run the test to see the impact.</p>
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* BEFORE Card */}
                  <div className="bg-warm-bg border border-warm-border rounded-xl p-6 shadow-sm">
                    <div className="text-xs font-bold text-warm-muted uppercase tracking-wider mb-4 border-b border-warm-border pb-2">Original State</div>
                    <div className="space-y-6">
                      <div>
                        <div className="text-xs font-bold text-warm-muted uppercase tracking-wider mb-1">Return on Investment (ROI)</div>
                        <div className="text-3xl font-black text-warm-text">{baseParams.roi.toFixed(1)}%</div>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-warm-muted uppercase tracking-wider mb-1">Debt Service Coverage (DSCR)</div>
                        <div className="text-3xl font-black text-warm-text">{baseParams.dscr.toFixed(2)}x</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* AFTER Card */}
                  <div className={`border rounded-xl p-6 shadow-sm ${simResults.survives_stress ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
                    <div className="text-xs font-bold text-warm-muted uppercase tracking-wider mb-4 border-b border-warm-border/50 pb-2 flex justify-between items-center">
                      Simulated State
                      {simResults.survives_stress ? (
                        <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-black tracking-widest shadow-sm border border-emerald-200">SAFE</span>
                      ) : (
                        <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-[10px] font-black tracking-widest shadow-sm border border-red-200">AT RISK</span>
                      )}
                    </div>
                    <div className="space-y-6">
                      <div>
                        <div className="text-xs font-bold text-warm-muted uppercase tracking-wider mb-1">Return on Investment (ROI)</div>
                        <div className="flex items-center">
                          <div className={`text-3xl font-black ${simResults.simulated_roi >= baseParams.roi ? 'text-emerald-600' : 'text-red-600'}`}>
                            {simResults.simulated_roi.toFixed(1)}%
                          </div>
                          {simResults.simulated_roi >= baseParams.roi ? <ArrowUp size={20} className="text-emerald-500 ml-2" /> : <ArrowDown size={20} className="text-red-500 ml-2" />}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-warm-muted uppercase tracking-wider mb-1">Debt Service Coverage (DSCR)</div>
                        <div className="flex items-center">
                          <div className={`text-3xl font-black ${simResults.simulated_dscr >= baseParams.dscr ? 'text-emerald-600' : 'text-red-600'}`}>
                            {simResults.simulated_dscr.toFixed(2)}x
                          </div>
                          {simResults.simulated_dscr >= baseParams.dscr ? <ArrowUp size={20} className="text-emerald-500 ml-2" /> : <ArrowDown size={20} className="text-red-500 ml-2" />}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <YuktiInsight 
                  type={simResults.survives_stress ? 'positive' : 'warning'}
                  title={simResults.survives_stress ? "BUSINESS REMAINS PROFITABLE" : "HIGH RISK OF LOSS"}
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

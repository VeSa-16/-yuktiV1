"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ProgressStepper } from "@/components/ProgressStepper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SourceTooltip } from "@/components/SourceTooltip";
import dynamic from "next/dynamic";
const MapRadiusOverlay = dynamic(() => import("@/components/MapRadiusOverlay").then(mod => mod.MapRadiusOverlay), { ssr: false });
import { api } from "@/lib/api-client";
import { useStore } from "@/lib/store";
import { formatNumber } from "@/lib/formatters";
import { Loader2, ArrowRight, ShieldAlert, Zap, Search, Target } from "lucide-react";
import { motion } from "framer-motion";
import { MarketRadar } from "@/components/MarketRadar";

export default function CategoryDeepDivePage({ params }: { params: { categoryId: string } }) {
  const router = useRouter();
  const state = useStore();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!state.sessionId) {
      router.push("/");
      return;
    }

    const fetchMarket = async () => {
      try {
        const res = await api.analyzeMarket({
          session_id: state.sessionId!,
          location_id: state.locationId!,
          category_id: params.categoryId,
        });
        setData(res);
      } catch (err: any) {
        setError(err.message || "Failed to fetch market analysis");
      } finally {
        setLoading(false);
      }
    };

    fetchMarket();
  }, [state, params.categoryId, router]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto mt-10">
        <ProgressStepper />
        <div className="h-64 flex flex-col items-center justify-center space-y-4">
          <Loader2 size={48} className="animate-spin text-terminal-cyan" />
          <p className="text-terminal-cyan font-mono uppercase tracking-widest animate-pulse">Gathering market intelligence...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  const mapCenter = { lat: 18.2334, lng: 75.6910 };

  // Generate fake radar data based on the gap score
  const radarData = [
    { subject: 'Local Demand', A: Math.min(100, data.opportunity_gaps.gap_score + 20), fullMark: 100 },
    { subject: 'Purchasing Power', A: 65, fullMark: 100 },
    { subject: 'Logistics', A: 80, fullMark: 100 },
    { subject: 'Competitor Density', A: 100 - (data.competitors.count * 10), fullMark: 100 },
    { subject: 'Raw Material', A: 75, fullMark: 100 },
    { subject: 'Market Growth', A: data.opportunity_gaps.gap_score, fullMark: 100 },
  ];

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
          <h1 className="text-2xl font-mono text-white tracking-widest uppercase">{data.category_name}</h1>
          <p className="text-terminal-cyan mt-2 text-xs font-mono uppercase tracking-widest">MARKET INTELLIGENCE // LOC: {state.locationName}</p>
        </div>
        <Button onClick={() => router.push(`/score/${params.categoryId}`)} variant="outline" className="text-xs">
          RUN_FINANCIAL_MODELS <ArrowRight size={14} className="ml-2" />
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Demographics & Map */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-zinc-800">
            <CardHeader className="bg-zinc-900 pb-4 border-b border-zinc-800">
              <CardTitle className="text-xs font-mono text-zinc-400 uppercase tracking-widest flex items-center">
                <Target size={14} className="mr-2 text-terminal-cyan" />
                Market Reach
                <div className="ml-auto">
                  <SourceTooltip source={data.market_reach.data_origin || "Curated"} confidence={data.market_reach.confidence} />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-4xl font-mono font-bold text-white">
                {data.market_reach.consumer_base ? formatNumber(data.market_reach.consumer_base) : "Unknown"}
              </div>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">Est. consumers in radius</p>
              
              <div className="mt-6 pt-6 border-t border-zinc-800">
                <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">Demand vs Supply Gap:</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className={`px-2 py-1 text-[10px] font-mono font-bold uppercase border ${data.opportunity_gaps.gap_score >= 70 ? 'bg-black text-terminal-green border-terminal-green' : 'bg-black text-terminal-amber border-terminal-amber'}`}>
                    Score: {data.opportunity_gaps.gap_score || "N/A"}/100
                  </span>
                  <span className="text-[10px] font-mono text-terminal-text uppercase">{data.opportunity_gaps.assessment}</span>
                </div>
              </div>

              <div className="mt-4 border-t border-slate-200/50">
                <MarketRadar data={radarData} />
              </div>
            </CardContent>
          </Card>

          <Card className="border-zinc-800 overflow-hidden">
            <CardHeader className="bg-zinc-900 pb-4 border-b border-zinc-800">
              <CardTitle className="text-xs font-mono text-zinc-400 uppercase tracking-widest flex items-center">
                <Search size={14} className="mr-2 text-terminal-cyan" />
                Competition ({data.competitors.count} found)
                <div className="ml-auto">
                  <SourceTooltip source={data.competitors.data_origin || "Curated"} confidence={data.competitors.confidence} />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <MapRadiusOverlay 
                lat={mapCenter.lat} 
                lng={mapCenter.lng} 
                radiusKm={10} 
                competitors={data.competitors.records} 
              />
            </CardContent>
          </Card>
        </div>

        {/* Right Column: SWOT & Risks */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-zinc-800">
            <CardHeader className="bg-zinc-900 pb-4 border-b border-zinc-800">
              <CardTitle className="text-xs font-mono text-zinc-400 uppercase tracking-widest flex items-center">
                <Zap size={14} className="mr-2 text-terminal-amber" />
                SWOT Analysis (Data-Driven)
                <div className="ml-auto">
                  <SourceTooltip source="Derived from structured signals" confidence={data.overall_confidence} />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div whileHover={{ scale: 1.01 }} className="bg-black p-4 border border-terminal-green">
                <h4 className="font-mono font-bold text-terminal-green mb-2 text-xs uppercase tracking-widest">Strengths</h4>
                <ul className="list-disc pl-4 text-xs font-mono text-zinc-300 space-y-1">
                  {data.swot.strengths.map((s: string, i: number) => <li key={i}>{s}</li>)}
                </ul>
              </motion.div>
              <motion.div whileHover={{ scale: 1.01 }} className="bg-black p-4 border border-terminal-amber">
                <h4 className="font-mono font-bold text-terminal-amber mb-2 text-xs uppercase tracking-widest">Weaknesses</h4>
                <ul className="list-disc pl-4 text-xs font-mono text-zinc-300 space-y-1">
                  {data.swot.weaknesses.map((w: string, i: number) => <li key={i}>{w}</li>)}
                </ul>
              </motion.div>
              <motion.div whileHover={{ scale: 1.01 }} className="bg-black p-4 border border-terminal-cyan">
                <h4 className="font-mono font-bold text-terminal-cyan mb-2 text-xs uppercase tracking-widest">Opportunities</h4>
                <ul className="list-disc pl-4 text-xs font-mono text-zinc-300 space-y-1">
                  {data.swot.opportunities.map((o: string, i: number) => <li key={i}>{o}</li>)}
                </ul>
              </motion.div>
              <motion.div whileHover={{ scale: 1.01 }} className="bg-black p-4 border border-terminal-red">
                <h4 className="font-mono font-bold text-terminal-red mb-2 text-xs uppercase tracking-widest">Threats / Risks</h4>
                <ul className="list-disc pl-4 text-xs font-mono text-zinc-300 space-y-1">
                  {data.swot.threats.map((t: string, i: number) => <li key={i}>{t}</li>)}
                </ul>
              </motion.div>
            </CardContent>
          </Card>
          
          <Card className="border-zinc-800">
            <CardHeader className="bg-zinc-900 pb-4 border-b border-zinc-800">
              <CardTitle className="text-xs font-mono text-zinc-400 uppercase tracking-widest flex items-center">
                <ShieldAlert size={14} className="mr-2 text-terminal-red" />
                Risk Assessment Matrix
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-zinc-800">
                {data.threats.risk_factors.map((risk: any, i: number) => (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + (i * 0.1) }}
                    key={i} 
                    className="p-4 flex flex-col sm:flex-row justify-between sm:items-center hover:bg-zinc-900 transition-colors"
                  >
                    <div className="mb-3 sm:mb-0">
                      <p className="font-bold font-mono text-white text-sm mb-1 uppercase">{risk.factor}</p>
                      <p className="text-xs font-mono text-zinc-500">{risk.detail}</p>
                    </div>
                    <span className={`px-2 py-1 text-[10px] font-mono font-bold uppercase border ${
                      risk.severity === 'High' ? 'bg-black text-terminal-red border-terminal-red' :
                      risk.severity === 'Medium' ? 'bg-black text-terminal-amber border-terminal-amber' :
                      'bg-black text-terminal-green border-terminal-green'
                    }`}>
                      {risk.severity} Risk
                    </span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}

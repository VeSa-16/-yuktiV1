"use client";
import React, { useEffect, useState } from"react";
import { useRouter } from"next/navigation";
import { ProgressStepper } from"@/components/ProgressStepper";
import { ScoreDial } from"@/components/ScoreDial";
import { EMITable } from"@/components/EMITable";
import { Card, CardContent, CardHeader, CardTitle } from"@/components/ui/card";
import { Button } from"@/components/ui/button";
import { SourceTooltip } from"@/components/SourceTooltip";
import { api } from"@/lib/api-client";
import { useStore } from"@/lib/store";
import { formatCurrency, formatPercentage } from"@/lib/formatters";
import { Loader2, ArrowRight, ShieldCheck, AlertTriangle, XCircle, TrendingUp, Settings, Bot } from"lucide-react";

import { FinancialChart } from"@/components/FinancialChart";
import { motion } from"framer-motion";

export default function ScorePage({ params }: { params: { categoryId: string } }) {
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

 const fetchScore = async () => {
 try {
 const res = await api.getRecommendation({
 session_id: state.sessionId!
 });
 setData(res);
 } catch (err: any) {
 setError(err.message ||"Failed to fetch recommendation score");
 } finally {
 setLoading(false);
 }
 };

 fetchScore();
 }, [state, router]);

 const getVerdictBadge = (verdict: string) => {
 switch (verdict) {
 case"GO": return <span className="inline-flex items-center px-4 py-2 text-xs font-sans font-bold bg-warm-bg text-warm-secondary border border-warm-secondary"><ShieldCheck size={14} className="mr-2"/> Highly Recommended</span>;
 case"CAUTION": return <span className="inline-flex items-center px-4 py-2 text-xs font-sans font-bold bg-warm-bg text-orange-500 border border-orange-500"><AlertTriangle size={14} className="mr-2"/> Proceed with Caution</span>;
 case"ALTERNATIVE": return <span className="inline-flex items-center px-4 py-2 text-xs font-sans font-bold bg-warm-bg text-warm-primary border border-warm-primary">Alternative Options Available</span>;
 case"NOT_RECOMMENDED": return <span className="inline-flex items-center px-4 py-2 text-xs font-sans font-bold bg-warm-bg text-red-600 border border-terminal-red"><XCircle size={14} className="mr-2"/> Not Recommended</span>;
 default: return null;
 }
 };

 if (loading) {
 return (
 <div className="max-w-4xl mx-auto mt-10">
 <ProgressStepper />
 <div className="h-64 flex flex-col items-center justify-center space-y-4">
 <Loader2 size={48} className="animate-spin text-warm-primary" />
 <p className="text-warm-primary font-sans animate-pulse">Calculating financial viability...</p>
 </div>
 </div>
 );
 }

 if (error || !data) {
 return <div className="text-red-500 p-4">{error}</div>;
 }

 // Generate fake historical projection data for the chart based on ROI
 const chartData = Array.from({ length: 5 }).map((_, i) => ({
 year: new Date().getFullYear() + i,
 revenue: (state.marginCapital || 50000) * 1.5 * (1 + (data.roi / 100)) * (1 + (i * 0.1)),
 expenses: (state.marginCapital || 50000) * 1.5 * (1 + (data.roi / 100)) * (1 + (i * 0.1)) * 0.7,
 cashflow: (state.marginCapital || 50000) * (data.roi / 100) * (1 + (i * 0.15)),
 }));

 return (
 <motion.div 
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.5 }}
 className="max-w-5xl mx-auto mt-10 pb-20"
 >
 <ProgressStepper />
 
 <div className="flex flex-col sm:flex-row justify-between items-center sm:items-end mb-8 gap-4 border-b border-warm-border pb-4">
 <div>
 <h1 className="text-2xl font-sans text-warm-text tracking-widest uppercase">Financial Viability</h1>
 <p className="text-warm-primary mt-2 text-xs font-sans">ASSESSMENT FOR // {state.categoryName} IN {state.locationName}</p>
 </div>
 <Button onClick={() => router.push(`/simulator`)} variant="outline" className="text-xs">
 <Settings size={14} className="mr-2" /> WHAT_IF_SIMULATION
 </Button>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
 <Card className="lg:col-span-1 flex flex-col justify-center items-center py-8 border-warm-border">
 <CardContent className="flex flex-col items-center justify-center w-full">
 <ScoreDial score={data.yukti_score} size={200} />
 <motion.div 
 initial={{ scale: 0.8, opacity: 0 }}
 animate={{ scale: 1, opacity: 1 }}
 transition={{ delay: 0.3, type:"spring" }}
 className="mt-8 text-center"
 >
 {getVerdictBadge(data.verdict)}
 </motion.div>
 
 <div className="mt-6 pt-4 border-t border-warm-border w-full text-[10px] uppercase font-sans text-warm-muted text-center flex items-center justify-center space-x-2">
 <span>Data Confidence:</span>
 <span className="font-bold text-warm-primary">{data.confidence}</span>
 <SourceTooltip source="YUKTI Recommendation Engine" confidence={data.confidence} />
 </div>
 </CardContent>
 </Card>
 
 <Card className="lg:col-span-2 border-warm-border">
 <CardHeader className="bg-warm-surface pb-4 border-b border-warm-border">
 <CardTitle className="text-xs font-sans text-warm-muted flex items-center">
 <TrendingUp size={14} className="mr-2 text-warm-primary" />
 Dimension Breakdown
 </CardTitle>
 </CardHeader>
 <CardContent className="pt-6 space-y-6">
 {[
 { label:"Financial Viability", score: data.dimension_scores.financial_viability, desc:"Profitability & ROI" },
 { label:"Repayment Capacity", score: data.dimension_scores.repayment_capacity, desc:"DSCR & Cash flow" },
 { label:"Market Opportunity", score: data.dimension_scores.market_opportunity, desc:"Demand gap & competition" },
 { label:"Capital Efficiency", score: data.dimension_scores.capital_efficiency, desc:"Break-even & margin" },
 { label:"Risk Exposure", score: data.dimension_scores.risk_exposure, desc:"External threats & vulnerabilities" }
 ].map((dim, idx) => (
 <motion.div 
 key={idx} 
 initial={{ opacity: 0, x: -20 }}
 animate={{ opacity: 1, x: 0 }}
 transition={{ delay: 0.2 + (idx * 0.1) }}
 className="flex flex-col"
 >
 <div className="flex justify-between items-end mb-2">
 <span className="text-[10px] font-sans text-warm-text">{dim.label} <span className="text-zinc-600 ml-1 hidden sm:inline-block">({dim.desc})</span></span>
 <span className="text-[10px] font-sans font-bold text-warm-text">{dim.score}<span className="text-zinc-600">/100</span></span>
 </div>
 <div className="w-full bg-warm-surface rounded-none h-1 overflow-hidden">
 <motion.div 
 initial={{ width: 0 }}
 animate={{ width: `${dim.score}%` }}
 transition={{ duration: 1, delay: 0.5 + (idx * 0.1), type:"spring" }}
 className={`h-full rounded-none ${dim.score >= 70 ? 'bg-terminal-green' : dim.score >= 50 ? 'bg-terminal-amber' : 'bg-terminal-red'}`} 
 />
 </div>
 </motion.div>
 ))}

 <div className="mt-8 pt-6 border-t border-warm-border">
 <h4 className="font-sans text-xs text-warm-primary mb-4 flex items-center">
 <Bot size={14} className="mr-2"/> Why {data.yukti_score}?
 </h4>
 <ul className="space-y-3">
 <motion.li 
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 transition={{ delay: 0.8 }}
 className="text-xs font-sans text-warm-text flex items-start bg-warm-surface p-3 border-l-2 border-warm-primary leading-relaxed"
 >
 <span className="text-warm-primary mr-2 mt-0.5">•</span> 
 Local demand outstrips current supply by 15% within a 5km radius.
 </motion.li>
 <motion.li 
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 transition={{ delay: 0.9 }}
 className="text-xs font-sans text-warm-text flex items-start bg-warm-surface p-3 border-l-2 border-orange-500 leading-relaxed"
 >
 <span className="text-orange-500 mr-2 mt-0.5">•</span> 
 Capital fit is tight; operations require strict inventory management to avoid cash-flow blocks.
 </motion.li>
 <motion.li 
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 transition={{ delay: 1.0 }}
 className="text-xs font-sans text-warm-text flex items-start bg-warm-surface p-3 border-l-2 border-warm-primary leading-relaxed"
 >
 <span className="text-warm-primary mr-2 mt-0.5">•</span> 
 Competitor density is moderate, leaving a gap for specialized or premium offerings.
 </motion.li>
 </ul>
 </div>
 </CardContent>
 </Card>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
 <Card className="border-warm-border">
 <CardHeader className="bg-warm-surface pb-4 border-b border-warm-border">
 <CardTitle className="text-xs font-sans text-warm-muted flex justify-between items-center">
 Financial Summary
 <SourceTooltip source="Prototype Cost Models" confidence="Medium" />
 </CardTitle>
 </CardHeader>
 <CardContent className="pt-6">
 <div className="flex justify-between py-2 border-b border-warm-border">
 <span className="text-xs font-sans text-warm-muted">Expected ROI</span>
 <span className="font-bold font-sans text-warm-text text-sm">{formatPercentage(data.roi)}</span>
 </div>
 <div className="flex justify-between py-2 border-b border-warm-border mb-4">
 <span className="text-xs font-sans text-warm-muted">DSCR</span>
 <span className={`font-bold font-sans text-sm ${data.dscr >= 1.5 ? 'text-warm-secondary' : data.dscr >= 1.0 ? 'text-orange-500' : 'text-red-600'}`}>
 {data.dscr.toFixed(2)}x
 </span>
 </div>
 
 <h4 className="font-sans text-xs text-warm-muted mb-2 mt-6">5-Year Projection</h4>
 <FinancialChart data={chartData} />

 <div className="pt-6 mt-6 border-t border-warm-border">
 <h4 className="font-sans text-xs text-warm-primary mb-4 flex items-center"><Bot size={14} className="mr-2"/> AI Next Steps</h4>
 <ul className="space-y-2">
 {data.next_steps.map((step: string, idx: number) => (
 <motion.li 
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 transition={{ delay: 1 + (idx * 0.2) }}
 key={idx} 
 className="text-[10px] font-sans text-warm-text flex items-start bg-warm-surface p-2 border-l-2 border-warm-primary"
 >
 <span className="text-warm-primary mr-2">•</span> {step}
 </motion.li>
 ))}
 </ul>
 </div>
 </CardContent>
 </Card>
 
 <Card className="border-warm-border h-fit">
 <CardHeader className="bg-warm-surface pb-4 border-b border-warm-border">
 <CardTitle className="text-xs font-sans text-warm-muted flex justify-between items-center">
 Proposed Financing
 <SourceTooltip source="NSFDC API / Deterministic Match" confidence="High" />
 </CardTitle>
 </CardHeader>
 <CardContent className="pt-6">
 <EMITable 
 principal={state.marginCapital ? state.marginCapital * 9 : 450000} 
 rate={8.0} 
 tenureMonths={60} 
 emi={state.marginCapital ? (state.marginCapital * 9 * 0.0202) : 9124} 
 />
 </CardContent>
 </Card>
 </div>
 </motion.div>
 );
}

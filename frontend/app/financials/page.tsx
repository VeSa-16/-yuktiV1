"use client";
import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProgressStepper } from '@/components/ProgressStepper';
import { formatCurrency } from '@/lib/formatters';
import { PieChart, TrendingUp, AlertTriangle, ShieldCheck, Wallet, FileText, ArrowRight, Settings2 } from 'lucide-react';

export default function FinancialsPage() {
 const { categoryName, marginCapital } = useStore();
 const [showAssumptions, setShowAssumptions] = useState(false);

 // Mock data for the breakdowns
 const totalCost = (marginCapital || 50000) * 10; // Total 10x of margin (10% contribution)
 
 const breakdown = {
 equipment: totalCost * 0.47,
 materials: totalCost * 0.18,
 setup: totalCost * 0.12,
 workingCapital: totalCost * 0.14,
 licensing: totalCost * 0.04,
 contingency: totalCost * 0.05
 };

 const economics = {
 revenue: totalCost * 0.35, // Monthly
 rawMaterials: totalCost * 0.12,
 salaries: totalCost * 0.08,
 rent: totalCost * 0.03,
 other: totalCost * 0.02,
 debt: totalCost * 0.04 // Approx EMI
 };

 const netCash = economics.revenue - (economics.rawMaterials + economics.salaries + economics.rent + economics.other + economics.debt);

 return (
 <div className="max-w-5xl mx-auto p-4 md:p-8 animate-in fade-in duration-500 font-sans text-warm-text bg-warm-bg min-h-screen">
 <ProgressStepper />
 
 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 border-b border-warm-border pb-4">
 <div>
 <h1 className="text-2xl font-bold tracking-widest text-warm-text uppercase">Financial Planning</h1>
 <p className="text-warm-primary mt-2 text-xs tracking-widest uppercase">CAPITAL_BREAKDOWN // {categoryName ||"Business"}</p>
 </div>
 <button 
 onClick={() => setShowAssumptions(!showAssumptions)}
 className="mt-4 sm:mt-0 flex items-center bg-warm-surface border border-warm-border text-warm-text px-4 py-2 text-xs hover:border-warm-primary hover:text-warm-primary transition-colors"
 >
 <Settings2 size={14} className="mr-2" /> Assumptions
 </button>
 </div>

 {showAssumptions && (
 <Card className="mb-8 border-orange-500 bg-warm-bg rounded-none">
 <CardHeader className="border-b border-warm-border pb-3">
 <CardTitle className="text-xs text-orange-500">Edit Financial Assumptions</CardTitle>
 </CardHeader>
 <CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
 <div>
 <label className="text-[10px] text-warm-muted block mb-1">Selling Price / Unit</label>
 <input type="number" defaultValue="120" className="w-full bg-warm-surface border border-warm-border text-warm-text p-2 focus:border-orange-500 outline-none" />
 </div>
 <div>
 <label className="text-[10px] text-warm-muted block mb-1">Monthly Volume</label>
 <input type="number" defaultValue="1000" className="w-full bg-warm-surface border border-warm-border text-warm-text p-2 focus:border-orange-500 outline-none" />
 </div>
 <div>
 <label className="text-[10px] text-warm-muted block mb-1">Material Cost / Unit</label>
 <input type="number" defaultValue="45" className="w-full bg-warm-surface border border-warm-border text-warm-text p-2 focus:border-orange-500 outline-none" />
 </div>
 <div>
 <label className="text-[10px] text-warm-muted block mb-1">OpEx / Month</label>
 <input type="number" defaultValue="20000" className="w-full bg-warm-surface border border-warm-border text-warm-text p-2 focus:border-orange-500 outline-none" />
 </div>
 </CardContent>
 </Card>
 )}

 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
 
 {/* Money Breakdown */}
 <Card className="border-warm-border bg-warm-bg rounded-none">
 <CardHeader className="border-b border-warm-border pb-4">
 <CardTitle className="text-xs font-bold text-warm-muted flex items-center">
 <PieChart size={14} className="mr-2 text-warm-primary" /> Where Your Money Goes
 </CardTitle>
 </CardHeader>
 <CardContent className="pt-6 space-y-4">
 <div className="flex justify-between text-sm">
 <span className="text-warm-muted">Equipment</span>
 <span className="text-warm-text">{formatCurrency(breakdown.equipment)}</span>
 </div>
 <div className="flex justify-between text-sm">
 <span className="text-warm-muted">Raw Materials</span>
 <span className="text-warm-text">{formatCurrency(breakdown.materials)}</span>
 </div>
 <div className="flex justify-between text-sm">
 <span className="text-warm-muted">Shop/Setup</span>
 <span className="text-warm-text">{formatCurrency(breakdown.setup)}</span>
 </div>
 <div className="flex justify-between text-sm">
 <span className="text-warm-muted">Licensing</span>
 <span className="text-warm-text">{formatCurrency(breakdown.licensing)}</span>
 </div>
 <div className="flex justify-between text-sm">
 <span className="text-warm-muted text-orange-500 font-bold">Working Capital</span>
 <span className="text-orange-500 font-bold">{formatCurrency(breakdown.workingCapital)}</span>
 </div>
 <div className="flex justify-between text-sm">
 <span className="text-warm-muted">Contingency</span>
 <span className="text-warm-text">{formatCurrency(breakdown.contingency)}</span>
 </div>
 
 <div className="pt-4 border-t border-warm-border mt-4">
 <div className="flex justify-between text-sm font-bold">
 <span className="text-warm-primary">Total Project Cost</span>
 <span className="text-warm-primary">{formatCurrency(totalCost)}</span>
 </div>
 </div>

 <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-dashed border-warm-border">
 <div className="bg-warm-surface p-4 border-l-2 border-warm-secondary">
 <div className="text-[10px] text-warm-muted mb-1">Your Contribution</div>
 <div className="text-lg font-bold text-warm-secondary">{formatCurrency(marginCapital || 50000)}</div>
 </div>
 <div className="bg-warm-surface p-4 border-l-2 border-orange-500">
 <div className="text-[10px] text-warm-muted mb-1">Financing Req.</div>
 <div className="text-lg font-bold text-orange-500">{formatCurrency(totalCost - (marginCapital || 50000))}</div>
 </div>
 </div>
 </CardContent>
 </Card>

 {/* Working Capital Economics */}
 <Card className="border-warm-border bg-warm-bg rounded-none">
 <CardHeader className="border-b border-warm-border pb-4">
 <CardTitle className="text-xs font-bold text-warm-muted flex justify-between items-center">
 <div className="flex items-center"><Wallet size={14} className="mr-2 text-warm-primary" /> Monthly Economics</div>
 {netCash > totalCost * 0.05 ? (
 <span className="bg-warm-secondary/20 text-warm-secondary px-2 py-1 flex items-center text-[10px]"><ShieldCheck size={12} className="mr-1"/> HEALTHY</span>
 ) : (
 <span className="bg-terminal-amber/20 text-orange-500 px-2 py-1 flex items-center text-[10px]"><AlertTriangle size={12} className="mr-1"/> NEEDS ATTENTION</span>
 )}
 </CardTitle>
 </CardHeader>
 <CardContent className="pt-6 space-y-4">
 <div className="flex justify-between text-sm font-bold border-b border-warm-border pb-2">
 <span className="text-warm-secondary">Revenue</span>
 <span className="text-warm-secondary">{formatCurrency(economics.revenue)}</span>
 </div>
 
 <div className="flex justify-between text-sm">
 <span className="text-warm-muted">− Raw materials</span>
 <span className="text-red-600">{formatCurrency(economics.rawMaterials)}</span>
 </div>
 <div className="flex justify-between text-sm">
 <span className="text-warm-muted">− Salaries</span>
 <span className="text-red-600">{formatCurrency(economics.salaries)}</span>
 </div>
 <div className="flex justify-between text-sm">
 <span className="text-warm-muted">− Rent/Utilities</span>
 <span className="text-red-600">{formatCurrency(economics.rent)}</span>
 </div>
 <div className="flex justify-between text-sm">
 <span className="text-warm-muted">− Other expenses</span>
 <span className="text-red-600">{formatCurrency(economics.other)}</span>
 </div>
 <div className="flex justify-between text-sm pb-4 border-b border-dashed border-warm-border">
 <span className="text-warm-muted">− Debt servicing (EMI)</span>
 <span className="text-red-600">{formatCurrency(economics.debt)}</span>
 </div>

 <div className="flex justify-between text-sm font-bold pt-2">
 <span className="text-warm-text">Est. Cash Available</span>
 <span className="text-warm-text">{formatCurrency(netCash)}</span>
 </div>

 <div className="mt-8 bg-warm-surface border border-warm-border p-4">
 <h4 className="font-bold text-warm-primary text-xs mb-2 flex items-center">
 <FileText size={14} className="mr-2" /> Financing Readiness: 78%
 </h4>
 <div className="w-full bg-warm-bg h-1 mb-4">
 <div className="bg-terminal-cyan h-full w-[78%]"></div>
 </div>
 <p className="text-xs text-warm-muted leading-relaxed">
 Business Plan <span className="text-warm-secondary font-bold">✓</span> | Capital <span className="text-warm-secondary font-bold">✓</span> | Documents <span className="text-orange-500 font-bold">60%</span>
 </p>
 <p className="text-[10px] text-warm-muted mt-2 tracking-widest">You're almost ready to approach the relevant implementing agency.</p>
 </div>
 </CardContent>
 </Card>
 </div>
 </div>
 );
}

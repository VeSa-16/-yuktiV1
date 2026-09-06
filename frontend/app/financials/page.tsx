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
    <div className="max-w-5xl mx-auto p-4 md:p-8 animate-in fade-in duration-500 font-mono text-terminal-text bg-black min-h-screen">
      <ProgressStepper />
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 border-b border-zinc-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-widest text-white uppercase">Financial Planning</h1>
          <p className="text-terminal-cyan mt-2 text-xs tracking-widest uppercase">CAPITAL_BREAKDOWN // {categoryName || "Business"}</p>
        </div>
        <button 
          onClick={() => setShowAssumptions(!showAssumptions)}
          className="mt-4 sm:mt-0 flex items-center bg-zinc-900 border border-zinc-700 text-zinc-300 px-4 py-2 text-xs uppercase tracking-widest hover:border-terminal-cyan hover:text-terminal-cyan transition-colors"
        >
          <Settings2 size={14} className="mr-2" /> Assumptions
        </button>
      </div>

      {showAssumptions && (
        <Card className="mb-8 border-terminal-amber bg-black rounded-none">
          <CardHeader className="border-b border-zinc-800 pb-3">
            <CardTitle className="text-xs text-terminal-amber uppercase tracking-widest">Edit Financial Assumptions</CardTitle>
          </CardHeader>
          <CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="text-[10px] text-zinc-500 uppercase tracking-widest block mb-1">Selling Price / Unit</label>
              <input type="number" defaultValue="120" className="w-full bg-zinc-900 border border-zinc-800 text-white p-2 focus:border-terminal-amber outline-none" />
            </div>
            <div>
              <label className="text-[10px] text-zinc-500 uppercase tracking-widest block mb-1">Monthly Volume</label>
              <input type="number" defaultValue="1000" className="w-full bg-zinc-900 border border-zinc-800 text-white p-2 focus:border-terminal-amber outline-none" />
            </div>
            <div>
              <label className="text-[10px] text-zinc-500 uppercase tracking-widest block mb-1">Material Cost / Unit</label>
              <input type="number" defaultValue="45" className="w-full bg-zinc-900 border border-zinc-800 text-white p-2 focus:border-terminal-amber outline-none" />
            </div>
            <div>
              <label className="text-[10px] text-zinc-500 uppercase tracking-widest block mb-1">OpEx / Month</label>
              <input type="number" defaultValue="20000" className="w-full bg-zinc-900 border border-zinc-800 text-white p-2 focus:border-terminal-amber outline-none" />
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Money Breakdown */}
        <Card className="border-zinc-800 bg-black rounded-none">
          <CardHeader className="border-b border-zinc-800 pb-4">
            <CardTitle className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center">
              <PieChart size={14} className="mr-2 text-terminal-cyan" /> Where Your Money Goes
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400 uppercase tracking-widest">Equipment</span>
              <span className="text-white">{formatCurrency(breakdown.equipment)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400 uppercase tracking-widest">Raw Materials</span>
              <span className="text-white">{formatCurrency(breakdown.materials)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400 uppercase tracking-widest">Shop/Setup</span>
              <span className="text-white">{formatCurrency(breakdown.setup)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400 uppercase tracking-widest">Licensing</span>
              <span className="text-white">{formatCurrency(breakdown.licensing)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400 uppercase tracking-widest text-terminal-amber font-bold">Working Capital</span>
              <span className="text-terminal-amber font-bold">{formatCurrency(breakdown.workingCapital)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400 uppercase tracking-widest">Contingency</span>
              <span className="text-white">{formatCurrency(breakdown.contingency)}</span>
            </div>
            
            <div className="pt-4 border-t border-zinc-800 mt-4">
              <div className="flex justify-between text-sm font-bold">
                <span className="text-terminal-cyan uppercase tracking-widest">Total Project Cost</span>
                <span className="text-terminal-cyan">{formatCurrency(totalCost)}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-dashed border-zinc-800">
              <div className="bg-zinc-900 p-4 border-l-2 border-terminal-green">
                <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Your Contribution</div>
                <div className="text-lg font-bold text-terminal-green">{formatCurrency(marginCapital || 50000)}</div>
              </div>
              <div className="bg-zinc-900 p-4 border-l-2 border-terminal-amber">
                <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Financing Req.</div>
                <div className="text-lg font-bold text-terminal-amber">{formatCurrency(totalCost - (marginCapital || 50000))}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Working Capital Economics */}
        <Card className="border-zinc-800 bg-black rounded-none">
          <CardHeader className="border-b border-zinc-800 pb-4">
            <CardTitle className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex justify-between items-center">
              <div className="flex items-center"><Wallet size={14} className="mr-2 text-terminal-cyan" /> Monthly Economics</div>
              {netCash > totalCost * 0.05 ? (
                <span className="bg-terminal-green/20 text-terminal-green px-2 py-1 flex items-center text-[10px]"><ShieldCheck size={12} className="mr-1"/> HEALTHY</span>
              ) : (
                <span className="bg-terminal-amber/20 text-terminal-amber px-2 py-1 flex items-center text-[10px]"><AlertTriangle size={12} className="mr-1"/> NEEDS ATTENTION</span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="flex justify-between text-sm font-bold border-b border-zinc-800 pb-2">
              <span className="text-terminal-green uppercase tracking-widest">Revenue</span>
              <span className="text-terminal-green">{formatCurrency(economics.revenue)}</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500 uppercase tracking-widest">− Raw materials</span>
              <span className="text-terminal-red">{formatCurrency(economics.rawMaterials)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500 uppercase tracking-widest">− Salaries</span>
              <span className="text-terminal-red">{formatCurrency(economics.salaries)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500 uppercase tracking-widest">− Rent/Utilities</span>
              <span className="text-terminal-red">{formatCurrency(economics.rent)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500 uppercase tracking-widest">− Other expenses</span>
              <span className="text-terminal-red">{formatCurrency(economics.other)}</span>
            </div>
            <div className="flex justify-between text-sm pb-4 border-b border-dashed border-zinc-800">
              <span className="text-zinc-500 uppercase tracking-widest">− Debt servicing (EMI)</span>
              <span className="text-terminal-red">{formatCurrency(economics.debt)}</span>
            </div>

            <div className="flex justify-between text-sm font-bold pt-2">
              <span className="text-white uppercase tracking-widest">Est. Cash Available</span>
              <span className="text-white">{formatCurrency(netCash)}</span>
            </div>

            <div className="mt-8 bg-zinc-900 border border-zinc-800 p-4">
              <h4 className="font-bold text-terminal-cyan text-xs uppercase tracking-widest mb-2 flex items-center">
                <FileText size={14} className="mr-2" /> Financing Readiness: 78%
              </h4>
              <div className="w-full bg-black h-1 mb-4">
                <div className="bg-terminal-cyan h-full w-[78%]"></div>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed uppercase tracking-widest">
                Business Plan <span className="text-terminal-green font-bold">✓</span> | Capital <span className="text-terminal-green font-bold">✓</span> | Documents <span className="text-terminal-amber font-bold">60%</span>
              </p>
              <p className="text-[10px] text-zinc-500 mt-2 tracking-widest">You're almost ready to approach the relevant implementing agency.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

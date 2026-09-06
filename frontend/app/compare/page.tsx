"use client";
import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { Card } from '@/components/ui/card';
import { ArrowRight, Sparkles, AlertTriangle, Info } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ComparePage() {
  const router = useRouter();
  const { opportunities, updateState } = useStore();

  // For demo, we just use the first 3 opportunities if they exist, or mock data
  const compareData = opportunities?.length >= 2 ? opportunities.slice(0, 3) : [
    { category_id: "food_processing", category_name: "Food Processing", score: 87, demand: "High", competition: "Medium", capitalFit: "Strong", risk: "Medium", roi: "24%" },
    { category_id: "local_retail", category_name: "Local Retail", score: 76, demand: "Medium", competition: "High", capitalFit: "Strong", risk: "Low", roi: "18%" },
    { category_id: "transport", category_name: "Transport", score: 72, demand: "High", competition: "Medium", capitalFit: "Medium", risk: "High", roi: "20%" },
  ];

  const handleSelect = (categoryId: string, categoryName: string) => {
    updateState({ categoryId, categoryName });
    router.push(`/score/${categoryId.toLowerCase().replace(/\s+/g, '-')}`);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 text-warm-text animate-in fade-in duration-500">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight">Compare Businesses</h1>
        <p className="text-warm-muted mt-2 text-lg">Evaluate your top opportunities side-by-side.</p>
      </div>

      <div className="overflow-x-auto pb-8">
        <table className="w-full min-w-[800px] border-collapse">
          <thead>
            <tr>
              <th className="p-4 text-left border-b-2 border-warm-border w-1/4">Metric</th>
              {compareData.map((biz: any) => (
                <th key={biz.category_id} className="p-4 text-center border-b-2 border-warm-border w-1/4">
                  <h3 className="text-xl font-bold text-warm-text">{biz.category_name}</h3>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-warm-border/50">
            <tr>
              <td className="p-4 font-semibold text-warm-muted">YUKTI Score</td>
              {compareData.map((biz: any, i: number) => (
                <td key={biz.category_id} className="p-4 text-center">
                  <div className="inline-flex flex-col items-center justify-center">
                    <span className={`text-3xl font-black ${i === 0 ? 'text-emerald-600' : 'text-warm-text'}`}>{biz.score || 84}</span>
                    {i === 0 && <span className="text-[10px] uppercase font-bold text-warm-primary mt-1 flex items-center"><Sparkles size={10} className="mr-1"/> Top Pick</span>}
                  </div>
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 font-semibold text-warm-muted">Demand</td>
              {compareData.map((biz: any) => (
                <td key={biz.category_id} className="p-4 text-center font-medium">{biz.demand || "High"}</td>
              ))}
            </tr>
            <tr>
              <td className="p-4 font-semibold text-warm-muted">Competition</td>
              {compareData.map((biz: any) => (
                <td key={biz.category_id} className="p-4 text-center font-medium">{biz.competition || "Medium"}</td>
              ))}
            </tr>
            <tr>
              <td className="p-4 font-semibold text-warm-muted">Capital Fit</td>
              {compareData.map((biz: any) => (
                <td key={biz.category_id} className="p-4 text-center font-medium text-emerald-600">{biz.capitalFit || "Strong"}</td>
              ))}
            </tr>
            <tr>
              <td className="p-4 font-semibold text-warm-muted">Risk Profile</td>
              {compareData.map((biz: any) => (
                <td key={biz.category_id} className="p-4 text-center font-medium flex items-center justify-center">
                  {(biz.risk === "High" || (!biz.risk && biz.score < 75)) && <AlertTriangle size={14} className="text-amber-500 mr-2" />}
                  {biz.risk || "Medium"}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 font-semibold text-warm-muted">Projected ROI</td>
              {compareData.map((biz: any) => (
                <td key={biz.category_id} className="p-4 text-center font-bold text-warm-text">{biz.roi || "22%"}</td>
              ))}
            </tr>
            
            {/* Actions Row */}
            <tr>
              <td className="p-4"></td>
              {compareData.map((biz: any, i: number) => (
                <td key={biz.category_id} className="p-4 text-center">
                  <button 
                    onClick={() => handleSelect(biz.category_id, biz.category_name)}
                    className={`w-full py-3 rounded-lg font-bold flex items-center justify-center transition-all ${
                      i === 0 
                      ? 'bg-warm-primary text-white hover:bg-warm-primary/90 hover:shadow-lg' 
                      : 'bg-warm-surface border border-warm-border hover:border-warm-primary hover:text-warm-primary'
                    }`}
                  >
                    Select Plan <ArrowRight size={16} className="ml-2" />
                  </button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-8 bg-warm-primary/10 border border-warm-primary/20 rounded-xl p-6 flex items-start">
        <Info size={24} className="text-warm-primary mr-4 flex-shrink-0 mt-1" />
        <div>
          <h4 className="font-bold text-warm-text mb-1">Yukti Insight</h4>
          <p className="text-warm-muted text-sm leading-relaxed">
            While Retail has lower risk, Food Processing offers a significantly higher ROI (24% vs 18%) and better Demand coverage in your target area of Solapur. If you are comfortable managing perishable inventory, Food Processing is our top recommendation.
          </p>
        </div>
      </div>
    </div>
  );
}

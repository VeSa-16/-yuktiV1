"use client";
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Activity, TrendingUp, DollarSign, Target, Map } from 'lucide-react';
import { YuktiInsight } from '@/components/YuktiInsight';

export default function AnalyticsOverview() {
  return (
    <div className="p-8 bg-black min-h-screen text-terminal-text font-mono animate-in fade-in duration-500">
      <div className="flex justify-between items-end border-b border-zinc-800 pb-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-widest text-terminal-amber uppercase">Analytics Overview</h1>
          <p className="text-xs text-zinc-500 tracking-widest uppercase mt-2">Regional Macro Trends // Maharashtra Zone 3</p>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-zinc-500 uppercase tracking-widest">System Status</div>
          <div className="text-terminal-green flex items-center text-xs font-bold mt-1">
            <span className="w-2 h-2 rounded-full bg-terminal-green animate-pulse mr-2"></span> LIVE DATA
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-zinc-900 border-zinc-800 rounded-none shadow-none">
          <CardContent className="p-4">
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Active Plans</p>
            <div className="text-3xl font-bold text-white">1,248</div>
            <p className="text-[10px] text-terminal-green mt-2 flex items-center">
              <TrendingUp size={12} className="mr-1" /> +12% this month
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-zinc-900 border-zinc-800 rounded-none shadow-none">
          <CardContent className="p-4">
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Total Capital Demand</p>
            <div className="text-3xl font-bold text-terminal-cyan">₹48.2 Cr</div>
            <p className="text-[10px] text-terminal-cyan mt-2 flex items-center">
              Target: ₹50 Cr Allocation
            </p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800 rounded-none shadow-none">
          <CardContent className="p-4">
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Avg YUKTI Score</p>
            <div className="text-3xl font-bold text-white">76.4</div>
            <p className="text-[10px] text-terminal-green mt-2 flex items-center">
              <Activity size={12} className="mr-1" /> High Viability Region
            </p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800 rounded-none shadow-none">
          <CardContent className="p-4">
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Loans Disbursed</p>
            <div className="text-3xl font-bold text-terminal-amber">₹12.5 Cr</div>
            <p className="text-[10px] text-zinc-400 mt-2">
              412 Successful Applicants
            </p>
          </CardContent>
        </Card>
      </div>

      <YuktiInsight 
        type="info"
        title="REGIONAL INSIGHT"
        message="Algorithm detects a 34% surge in textile-related business plans in Nagpur. Recommended to allocate surplus NSFDC funds to manufacturing sector."
        className="mb-8"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-zinc-900 border-zinc-800 rounded-none shadow-none min-h-[300px]">
          <CardHeader className="border-b border-zinc-800 pb-3">
            <CardTitle className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center">
              <PieChart size={14} className="mr-2 text-terminal-cyan" /> Capital Demand by Sector
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {[
                { label: 'Agriculture & Processing', val: 45, color: 'bg-terminal-cyan' },
                { label: 'Manufacturing & Textiles', val: 28, color: 'bg-terminal-amber' },
                { label: 'Retail & Distribution', val: 15, color: 'bg-warm-surface' },
                { label: 'Services & IT', val: 12, color: 'bg-zinc-600' }
              ].map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between text-[10px] text-zinc-300 uppercase tracking-widest mb-1">
                    <span>{item.label}</span>
                    <span>{item.val}%</span>
                  </div>
                  <div className="w-full h-2 bg-black border border-zinc-800">
                    <div className={`h-full ${item.color}`} style={{ width: `${item.val}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800 rounded-none shadow-none min-h-[300px]">
          <CardHeader className="border-b border-zinc-800 pb-3">
            <CardTitle className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center">
              <Map size={14} className="mr-2 text-terminal-cyan" /> High-Viability Zones
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {[
                { zone: 'Nagpur East', score: 88, trend: 'up' },
                { zone: 'Pune Outer', score: 82, trend: 'up' },
                { zone: 'Mumbai North', score: 71, trend: 'down' },
                { zone: 'Nashik Central', score: 65, trend: 'down' }
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center border-b border-zinc-800 pb-3 last:border-0 last:pb-0">
                  <div>
                    <div className="text-sm font-bold text-white">{item.zone}</div>
                    <div className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">Viability Score</div>
                  </div>
                  <div className="flex items-center">
                    <div className={`text-xl font-bold mr-3 ${item.score > 80 ? 'text-terminal-green' : 'text-terminal-amber'}`}>
                      {item.score}
                    </div>
                    {item.trend === 'up' ? 
                      <TrendingUp size={16} className="text-terminal-green" /> : 
                      <TrendingUp size={16} className="text-terminal-red rotate-180" />
                    }
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

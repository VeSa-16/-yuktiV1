"use client";
import React from 'react';
import { 
  Bell, ChevronDown, Search, ArrowRight, Target, Clock,
  Wallet, ShieldCheck, Banknote, Building, Settings2
} from 'lucide-react';
import Link from 'next/link';

// 1. Top Header with Global Search
const TopHeader = () => (
  <div className="flex justify-between items-center mb-8 pt-2">
    <div className="flex-1 max-w-xl relative">
      <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-faint" />
      <input 
        type="text" 
        placeholder="Search..." 
        className="w-full bg-white border border-premium-border rounded-2xl py-2.5 pl-11 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-saffron"
      />
    </div>
    <div className="flex items-center space-x-5">
      <button className="text-ink-soft hover:text-ink transition-colors">
        <Bell size={20} />
      </button>
      <button className="text-ink-soft hover:text-ink transition-colors">
        <Clock size={20} />
      </button>
      <button className="flex items-center px-3 py-1.5 bg-white border border-premium-border rounded-xl text-sm font-bold shadow-sm hover:border-premium-border-strong">
        EN <ChevronDown size={14} className="ml-1 text-ink-soft" />
      </button>
    </div>
  </div>
);

// 2. High Level Summary Cards
const SummaryCards = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
    <div className="bg-white border border-premium-border rounded-2xl p-6 shadow-sm hover:border-premium-border-strong transition-colors">
      <div className="text-sm font-bold text-ink-soft flex items-center mb-2">
        <Target size={16} className="text-[#16a34a] mr-2" /> Project Cost
      </div>
      <div className="text-[28px] font-bold text-forest-deep tracking-tight">₹10,00,000</div>
    </div>
    <div className="bg-white border border-premium-border rounded-2xl p-6 shadow-sm hover:border-premium-border-strong transition-colors">
      <div className="text-sm font-bold text-ink-soft flex items-center mb-2">
        <Wallet size={16} className="text-[#16a34a] mr-2" /> Your Contribution
      </div>
      <div className="text-[28px] font-bold text-forest-deep tracking-tight">₹1,00,000</div>
    </div>
    <div className="bg-white border border-premium-border rounded-2xl p-6 shadow-sm hover:border-premium-border-strong transition-colors">
      <div className="text-sm font-bold text-ink-soft flex items-center mb-2">
        <Building size={16} className="text-[#16a34a] mr-2" /> Potential Financing
      </div>
      <div className="text-[28px] font-bold text-forest-deep tracking-tight">₹9,00,000</div>
    </div>
  </div>
);

// 3. Where the Money Goes
const WhereTheMoneyGoes = () => (
  <div className="bg-white border border-premium-border rounded-2xl p-6 shadow-sm mb-8 relative">
    
    <div className="flex justify-between items-center mb-8">
      <h2 className="text-xl font-bold text-forest-deep">Where the Money Goes</h2>
      <button className="px-4 py-2 bg-white border border-[#ea580c] text-[#ea580c] rounded-xl text-sm font-bold shadow-sm hover:bg-[#fff7ed] transition-colors">
        Edit Assumptions
      </button>
    </div>

    <div className="flex flex-col md:flex-row items-center justify-around py-4">
      
      {/* Donut Chart Custom SVG */}
      <div className="relative w-[240px] h-[240px] flex items-center justify-center mb-8 md:mb-0">
        <svg width="240" height="240" viewBox="0 0 160 160" style={{ transform: "rotate(-90deg)" }}>
          {/* 
            r=60, C=377 
            44% Orange: 165.88 (offset 0)
            22% Light Green: 82.94 (offset -165.88)
            22% Dark Green: 82.94 (offset -248.82)
            6% Light Blue: 22.62 (offset -331.76)
            6% Dark Blue: 22.62 (offset -354.38)
          */}
          <circle cx="80" cy="80" r="60" fill="transparent" stroke="#f97316" strokeWidth="22" strokeDasharray="165.88 377" strokeDashoffset="0" className="transition-all duration-1000 ease-out" />
          <circle cx="80" cy="80" r="60" fill="transparent" stroke="#4ade80" strokeWidth="22" strokeDasharray="82.94 377" strokeDashoffset="-165.88" className="transition-all duration-1000 ease-out" />
          <circle cx="80" cy="80" r="60" fill="transparent" stroke="#16a34a" strokeWidth="22" strokeDasharray="82.94 377" strokeDashoffset="-248.82" className="transition-all duration-1000 ease-out" />
          <circle cx="80" cy="80" r="60" fill="transparent" stroke="#38bdf8" strokeWidth="22" strokeDasharray="22.62 377" strokeDashoffset="-331.76" className="transition-all duration-1000 ease-out" />
          <circle cx="80" cy="80" r="60" fill="transparent" stroke="#2563eb" strokeWidth="22" strokeDasharray="22.62 377" strokeDashoffset="-354.38" className="transition-all duration-1000 ease-out" />
        </svg>
        {/* Inner Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <div className="text-[22px] font-bold text-forest-deep">₹9,00,000</div>
          <div className="text-xs font-medium text-ink-soft">Total Project Cost</div>
        </div>
      </div>

      {/* Legend List */}
      <div className="w-full md:w-auto px-4">
        <ul className="space-y-4">
          <li className="flex items-center justify-between min-w-[280px]">
            <div className="flex items-center w-32">
              <div className="w-3 h-3 rounded-full bg-[#f97316] mr-3"></div>
              <span className="text-sm font-medium text-ink-soft">Equipment</span>
            </div>
            <span className="text-sm font-bold text-ink-soft w-12 text-right">44%</span>
            <span className="text-sm font-bold text-ink-soft w-24 text-right">₹4,00,000</span>
          </li>
          <li className="flex items-center justify-between min-w-[280px]">
            <div className="flex items-center w-32">
              <div className="w-3 h-3 rounded-full bg-[#4ade80] mr-3"></div>
              <span className="text-sm font-medium text-ink-soft">Setup</span>
            </div>
            <span className="text-sm font-bold text-ink-soft w-12 text-right">22%</span>
            <span className="text-sm font-bold text-ink-soft w-24 text-right">₹2,00,000</span>
          </li>
          <li className="flex items-center justify-between min-w-[280px]">
            <div className="flex items-center w-32">
              <div className="w-3 h-3 rounded-full bg-[#16a34a] mr-3"></div>
              <span className="text-sm font-medium text-ink-soft">Working Capital</span>
            </div>
            <span className="text-sm font-bold text-ink-soft w-12 text-right">22%</span>
            <span className="text-sm font-bold text-ink-soft w-24 text-right">₹2,00,000</span>
          </li>
          <li className="flex items-center justify-between min-w-[280px]">
            <div className="flex items-center w-32">
              <div className="w-3 h-3 rounded-full bg-[#38bdf8] mr-3"></div>
              <span className="text-sm font-medium text-ink-soft">Licensing</span>
            </div>
            <span className="text-sm font-bold text-ink-soft w-12 text-right">6%</span>
            <span className="text-sm font-bold text-ink-soft w-24 text-right">₹90,000</span>
          </li>
          <li className="flex items-center justify-between min-w-[280px]">
            <div className="flex items-center w-32">
              <div className="w-3 h-3 rounded-full bg-[#2563eb] mr-3"></div>
              <span className="text-sm font-medium text-ink-soft">Contingency</span>
            </div>
            <span className="text-sm font-bold text-ink-soft w-12 text-right">6%</span>
            <span className="text-sm font-bold text-ink-soft w-24 text-right">₹50,000</span>
          </li>
        </ul>
      </div>

    </div>
  </div>
);

// 4. Bottom Grid (Cash Flow & Metrics)
const BottomGrid = () => (
  <div className="flex flex-col lg:flex-row gap-6">
    
    {/* Left: Cash Flow Projection */}
    <div className="flex-[2] bg-white border border-premium-border rounded-2xl p-6 shadow-sm">
      <h2 className="text-lg font-bold text-forest-deep mb-6">Monthly Cash Flow Projection</h2>
      
      {/* 4 Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div>
          <div className="text-xs font-bold text-ink-soft mb-1">Revenue</div>
          <div className="text-xl font-bold text-[#16a34a]">₹1,20,000</div>
        </div>
        <div>
          <div className="text-xs font-bold text-ink-soft mb-1">Operating Costs</div>
          <div className="text-xl font-bold text-ink">₹70,000</div>
        </div>
        <div>
          <div className="text-xs font-bold text-ink-soft mb-1">Loan Payment</div>
          <div className="text-xl font-bold text-ink">₹14,000</div>
        </div>
        <div>
          <div className="text-xs font-bold text-ink-soft mb-1">Cash Available</div>
          <div className="text-xl font-bold text-[#16a34a]">₹36,000</div>
        </div>
      </div>

      {/* Line Chart Custom SVG */}
      <div className="w-full h-48 relative border-t border-b border-premium-border py-4">
        
        {/* Simple Legend for chart */}
        <div className="absolute top-2 right-4 flex space-x-4">
          <div className="flex items-center text-[10px] font-bold text-ink-soft">
            <span className="w-3 h-1 bg-[#16a34a] mr-1 inline-block"></span> Revenue
          </div>
          <div className="flex items-center text-[10px] font-bold text-ink-soft">
            <span className="w-3 h-1 bg-[#f97316] mr-1 inline-block"></span> Opex
          </div>
          <div className="flex items-center text-[10px] font-bold text-ink-soft">
            <span className="w-3 h-1 bg-[#38bdf8] mr-1 inline-block"></span> Cash Flow
          </div>
        </div>

        <svg className="w-full h-full" viewBox="0 0 500 120" preserveAspectRatio="none">
          {/* Faint grid lines */}
          <line x1="0" y1="20" x2="500" y2="20" stroke="#f0f0f0" strokeWidth="1" />
          <line x1="0" y1="60" x2="500" y2="60" stroke="#f0f0f0" strokeWidth="1" />
          <line x1="0" y1="100" x2="500" y2="100" stroke="#f0f0f0" strokeWidth="1" />
          
          {/* Opex Line (Orange) */}
          <path d="M 10 90 L 100 70 L 180 50 L 260 70 L 340 70 L 420 60 L 490 60" fill="none" stroke="#f97316" strokeWidth="2" />
          <circle cx="180" cy="50" r="3" fill="#f97316" />
          <circle cx="260" cy="70" r="3" fill="#f97316" />
          
          {/* Revenue Line (Green) */}
          <path d="M 10 100 L 100 80 L 180 60 L 260 40 L 340 50 L 420 30 L 490 20" fill="none" stroke="#16a34a" strokeWidth="2" />
          {/* Fill under Revenue line for a nice gradient effect */}
          <path d="M 10 120 L 10 100 L 100 80 L 180 60 L 260 40 L 340 50 L 420 30 L 490 20 L 490 120 Z" fill="#16a34a" fillOpacity="0.05" />
          <circle cx="260" cy="40" r="3" fill="#16a34a" />
          
          {/* Cash Flow Line (Blue) */}
          <path d="M 10 105 L 100 95 L 180 85 L 260 70 L 340 80 L 420 70 L 490 65" fill="none" stroke="#38bdf8" strokeWidth="2" />
          <circle cx="260" cy="70" r="3" fill="#38bdf8" />
        </svg>

        {/* X-axis labels */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2 text-[10px] font-bold text-ink-soft pt-1">
          <span>Jan</span>
          <span>Feb</span>
          <span>Mar</span>
          <span>Apr</span>
          <span>May</span>
          <span>Jun</span>
        </div>
      </div>
    </div>

    {/* Right: Advanced Metrics */}
    <div className="flex-1 bg-white border border-premium-border rounded-2xl p-6 shadow-sm">
      <h2 className="text-lg font-bold text-forest-deep mb-6">Advanced Metrics</h2>
      
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-ink-soft">ROI</span>
          <span className="text-sm font-bold text-[#16a34a]">24%</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-ink-soft">DSCR</span>
          <span className="text-sm font-bold text-ink">1.8</span>
        </div>
        
        {/* Break-even pill row */}
        <div className="flex justify-between items-center bg-[#f4f4f5] p-3 rounded-xl border border-premium-border -mx-3">
          <span className="text-sm font-medium text-ink-soft">Break-even</span>
          <span className="text-sm font-bold text-ink">8 months</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-ink-soft">Payback Period</span>
          <span className="text-sm font-bold text-[#16a34a]">2.5 years</span>
        </div>
      </div>
    </div>

  </div>
);

export default function FinancialPlanningPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-6 pb-20 animate-in fade-in duration-500 bg-[#fcfbf8] min-h-screen">
      <TopHeader />
      
      <div className="mb-8">
        <h1 className="text-[32px] font-bold text-forest-deep tracking-tight mb-2">
          Financial Planning
        </h1>
        <p className="text-sm font-medium text-ink-soft">
          Plan your finances. Build a stronger foundation.
        </p>
      </div>

      <SummaryCards />
      <WhereTheMoneyGoes />
      <BottomGrid />
      
    </div>
  );
}

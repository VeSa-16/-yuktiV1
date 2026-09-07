"use client";
import React from 'react';
import { useStore } from '@/lib/store';
import { Bell, ChevronDown, ArrowRight, Home, IndianRupee, ShieldAlert, Wallet, MapPin, Check } from 'lucide-react';
import Link from 'next/link';

// Simple Top Navigation for Dashboard
const DashboardHeader = () => (
  <div className="flex justify-end items-center mb-6 pt-2">
    <button className="p-2 text-ink-soft hover:bg-black/5 rounded-full mr-4">
      <Bell size={20} />
    </button>
    <button className="flex items-center px-3 py-1.5 bg-white border border-premium-border rounded-xl text-sm font-bold shadow-sm hover:border-premium-border-strong">
      EN <ChevronDown size={14} className="ml-1 text-ink-soft" />
    </button>
  </div>
);

// Large YUKTI Score Card
const YuktiScoreCard = () => (
  <div className="bg-white rounded-3xl p-6 md:p-8 border border-premium-border shadow-card flex flex-col md:flex-row items-center md:items-start gap-8 flex-1">
    {/* SVG Dial */}
    <div className="relative w-36 h-36 shrink-0">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="42" fill="none" stroke="#f0fdf4" strokeWidth="12" />
        <circle 
          cx="50" cy="50" r="42" 
          fill="none" 
          stroke="#16a34a" 
          strokeWidth="12" 
          strokeDasharray="263.89" 
          strokeDashoffset={263.89 - (263.89 * 84) / 100} 
          strokeLinecap="round" 
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display font-bold text-4xl text-forest-deep leading-none -ml-1">84</span>
        <span className="text-xs font-bold text-ink-soft mt-1">/100</span>
      </div>
    </div>
    
    <div className="flex flex-col justify-center h-full">
      <h3 className="font-bold text-lg text-forest-deep mb-1">YUKTI Score</h3>
      <div className="text-[#16a34a] font-bold text-xl mb-3">Strong Opportunity</div>
      <p className="text-sm font-medium text-ink-soft mb-6 max-w-sm leading-relaxed">
        Your business idea shows great potential based on local market, financials and risk analysis.
      </p>
      <button className="self-start px-6 py-2.5 rounded-xl border border-[#ea580c] text-[#ea580c] font-bold text-sm flex items-center hover:bg-[#fff5f0] transition-colors">
        View Detailed Score <ArrowRight size={16} className="ml-2" />
      </button>
    </div>
  </div>
);

// Recommended Business Card
const RecommendedBusinessCard = () => (
  <div className="bg-white rounded-3xl p-6 md:p-8 border border-premium-border shadow-card flex flex-col w-full lg:w-[400px] shrink-0">
    <h3 className="text-sm font-bold text-forest-deep mb-4">Recommended Business</h3>
    
    <div className="flex justify-between items-start mb-6">
      <div>
        <h2 className="font-display font-bold text-2xl text-ink mb-1">E-Rickshaw</h2>
        <span className="text-sm font-medium text-ink-soft">Transport & Logistics</span>
      </div>
      <div className="w-16 h-16 bg-[#f4f9f6] rounded-2xl flex items-center justify-center border border-[#e5f0ea]">
        {/* Placeholder for E-Rickshaw image */}
        <span className="text-2xl">🛺</span>
      </div>
    </div>
    
    <div className="flex items-center space-x-3 mb-8">
      <span className="text-sm font-medium text-ink-soft">YUKTI Score</span>
      <span className="text-lg font-bold text-[#16a34a]">91<span className="text-xs text-ink-soft">/100</span></span>
    </div>

    <button className="mt-auto w-full px-6 py-3 rounded-xl border border-[#ea580c] text-[#ea580c] font-bold text-sm flex items-center justify-center hover:bg-[#fff5f0] transition-colors">
      Explore Opportunity <ArrowRight size={16} className="ml-2" />
    </button>
  </div>
);

// Small Metric Card
const MetricCard = ({ title, status, score, icon: Icon, colorClass }: any) => (
  <div className="bg-white rounded-2xl p-5 border border-premium-border shadow-sm flex flex-col">
    <div className="flex items-center text-xs font-bold text-ink-soft mb-3">
      <Icon size={14} className="mr-1.5 text-forest" /> {title}
    </div>
    <div className={`text-xl font-bold mb-1 ${colorClass}`}>{status}</div>
    <div className="text-sm font-bold text-forest-deep">{score}<span className="text-xs text-ink-soft">/100</span></div>
  </div>
);

// Journey Tracker
const JourneyTracker = () => {
  const steps = [
    { id: 1, label: 'Profile', status: 'Completed' },
    { id: 2, label: 'Location', status: 'Completed' },
    { id: 3, label: 'Capital', status: 'Completed' },
    { id: 4, label: 'Business', status: 'In Progress' },
    { id: 5, label: 'Plan', status: 'Next' }
  ];

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-premium-border shadow-card mt-6">
      <h3 className="font-bold text-forest-deep mb-8">Your Business Journey</h3>
      
      <div className="relative flex justify-between items-center max-w-4xl mx-auto px-4 md:px-12">
        {/* Track Background */}
        <div className="absolute left-[10%] right-[10%] top-6 h-1 bg-[#f0f9f4] -z-10" />
        
        {/* Track Progress */}
        <div className="absolute left-[10%] top-6 h-1 bg-[#16a34a] -z-10" style={{ width: '60%' }} />

        {steps.map((step) => {
          let nodeColor = '';
          let textColor = '';
          let subTextColor = '';
          let icon = null;

          if (step.status === 'Completed') {
            nodeColor = 'bg-[#16a34a] text-white ring-4 ring-white';
            textColor = 'text-[#16a34a]';
            subTextColor = 'text-[#16a34a]';
            icon = <Check size={16} strokeWidth={3} />;
          } else if (step.status === 'In Progress') {
            nodeColor = 'bg-[#ea580c] text-white ring-4 ring-white shadow-md scale-110';
            textColor = 'text-ink';
            subTextColor = 'text-[#ea580c]';
            icon = <div className="w-2 h-2 rounded-full bg-white" />;
          } else {
            nodeColor = 'bg-white border-2 border-premium-border-strong text-ink-soft ring-4 ring-white';
            textColor = 'text-ink';
            subTextColor = 'text-ink-soft';
            icon = <div className="w-2 h-2 rounded-full bg-premium-border-strong" />;
          }

          return (
            <div key={step.id} className="flex flex-col items-center text-center w-20">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all z-10 ${nodeColor}`}>
                {icon}
              </div>
              <div className={`mt-3 text-sm font-bold ${textColor}`}>{step.label}</div>
              <div className={`text-[11px] font-bold mt-1 ${subTextColor}`}>{step.status}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default function Dashboard() {
  const { profileName } = useStore();
  // We'll use 'Rahul' directly or fallback to store name if missing, since the user wants the exact screenshot.
  const displayFirstName = profileName ? profileName.split(' ')[0] : 'Rahul';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-6 pb-20 animate-in fade-in duration-500">
      
      <DashboardHeader />
      
      {/* Main Greeting */}
      <div className="mb-8">
        <h1 className="text-[32px] font-bold text-forest-deep tracking-tight mb-1">
          Good evening, {displayFirstName}!
        </h1>
        <p className="text-ink-soft font-medium text-lg">
          Here's where your business stands.
        </p>
      </div>

      {/* Top Cards Row */}
      <div className="flex flex-col lg:flex-row gap-6 mb-6">
        <YuktiScoreCard />
        <RecommendedBusinessCard />
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Market Opportunity" status="High" score="88" icon={Home} colorClass="text-[#16a34a]" />
        <MetricCard title="Financial Readiness" status="Good" score="89" icon={IndianRupee} colorClass="text-[#16a34a]" />
        <MetricCard title="Risk Level" status="Medium" score="68" icon={ShieldAlert} colorClass="text-[#ea580c]" />
        <MetricCard title="Capital Fit" status="Excellent" score="91" icon={Wallet} colorClass="text-[#16a34a]" />
      </div>

      {/* Journey Tracker Row */}
      <JourneyTracker />

    </div>
  );
}

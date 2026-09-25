"use client";
import React, { useState, useEffect } from "react";
import { useStore } from "@/lib/store";
import { api, MarketResponse } from "@/lib/api-client";
import { 
  Bell, ChevronDown, Search, ArrowRight, Home, IndianRupee, ShieldAlert, Wallet, MapPin, Check,
  Activity, Users, TrendingUp, AlertTriangle, Crosshair, Target, Loader2
} from "lucide-react";
import { MapRadiusOverlay } from "@/components/MapRadiusOverlay";
import { LocationUnavailableState } from "@/components/LocationUnavailableState";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

// 1. Top Header with Global Search
const TopHeader = () => {
  const t = useTranslations('market');
  return (
    <div className="flex justify-between items-center mb-6 pt-2">
      <div className="flex-1 max-w-xl relative">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-faint" />
        <input 
          type="text" 
          placeholder={t('searchPlaceholder')} 
          className="w-full bg-white border border-premium-border rounded-2xl py-2.5 pl-11 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-saffron"
        />
      </div>
      <div className="flex items-center space-x-4">
        <button className="text-ink-soft hover:text-ink transition-colors">
          <Bell size={20} />
        </button>
        <LanguageSwitcher />
      </div>
    </div>
  );
};

// 2. Context Bar & Score
const ContextBar = ({ categoryName, locationName, score }: any) => {
  const t = useTranslations('market');
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div className="flex bg-white rounded-2xl border border-premium-border shadow-sm p-1 max-w-2xl flex-1">
        <div className="flex items-center px-4 py-2 flex-1 border-r border-premium-border">
          <Search size={16} className="text-ink-soft mr-2" />
          <span className="font-bold text-ink text-sm flex-1">{categoryName}</span>
          <ChevronDown size={14} className="text-ink-soft" />
        </div>
        <div className="flex items-center px-4 py-2 flex-1 justify-between">
          <span className="font-medium text-ink-soft text-sm">{locationName}</span>
          <button className="px-3 py-1 bg-white border border-premium-border rounded-lg text-xs font-bold text-ink hover:bg-cream-deep">
            {t('changeBtn')}
          </button>
        </div>
      </div>
      
      <div className="bg-[#e8f5e9] border border-[#c8e6c9] rounded-2xl p-3 flex items-center shadow-sm w-fit">
        <div className="w-12 h-12 bg-[#16a34a] rounded-full flex items-center justify-center text-white font-display font-bold text-xl mr-3 shrink-0">
          {score}
        </div>
        <div>
          <div className="text-xs font-bold text-[#16a34a] uppercase tracking-wider mb-0.5">{t('oppScore')}</div>
          <div className="text-xl font-bold text-[#16a34a]">{score}<span className="text-xs">/100</span></div>
        </div>
      </div>
    </div>
  );
};

// 3. Tabs
const Tabs = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (t: string) => void }) => {
  const t = useTranslations('market.tabs');
  const tabs = [
    { key: "snapshot", label: t('snapshot') }, 
    { key: "map", label: t('map') }, 
    { key: "competitors", label: t('competitors') }, 
    { key: "customers", label: t('customers') }, 
    { key: "swot", label: t('swot') }, 
    { key: "pricing", label: t('pricing') }, 
    { key: "schemes", label: t('schemes') }
  ];
  return (
    <div className="flex flex-wrap gap-x-8 gap-y-2 border-b border-premium-border mb-8">
      {tabs.map((tab) => (
        <button 
          key={tab.key}
          onClick={() => setActiveTab(tab.key)}
          className={`pb-3 text-sm font-bold whitespace-nowrap border-b-2 transition-colors ${
            activeTab === tab.key
              ? 'border-[#ea580c] text-[#ea580c]' 
              : 'border-transparent text-ink-soft hover:text-ink'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

// 4. Metric Box
const MetricBox = ({ icon, title, status, statusColor, iconColor }: any) => (
  <div className="bg-white border border-premium-border rounded-2xl p-4 shadow-sm flex flex-col justify-center items-center text-center hover:border-premium-border-strong transition-colors">
    <div className={`mb-3 ${iconColor}`}>{icon}</div>
    <div className="text-xs font-bold text-ink-soft mb-1">{title}</div>
    <div className={`text-sm font-bold ${statusColor}`}>{status}</div>
  </div>
);

// 5. Market Snapshot Section
const MarketSnapshot = ({ assessment, compCount }: any) => {
  const t = useTranslations('market.snapshot');
  const tStatus = useTranslations('dashboard.metrics.status');
  return (
    <div className="mb-10">
      <h2 className="text-xl font-bold text-forest-deep mb-4">{t('title')}</h2>
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* 7-grid */}
        <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricBox icon={<Target size={20} />} title={t('demand')} status={tStatus('high')} statusColor="text-[#16a34a]" iconColor="text-[#16a34a]" />
          <MetricBox icon={<Users size={20} />} title={t('competition')} status={compCount > 10 ? tStatus('high') : tStatus('medium')} statusColor="text-[#ea580c]" iconColor="text-[#ea580c]" />
          <MetricBox icon={<Activity size={20} />} title={t('saturation')} status={tStatus('low')} statusColor="text-[#16a34a]" iconColor="text-[#16a34a]" />
          <MetricBox icon={<IndianRupee size={20} />} title={t('pricing')} status={tStatus('high')} statusColor="text-[#16a34a]" iconColor="text-[#6366f1]" />
          <MetricBox icon={<MapPin size={20} />} title={t('accessibility')} status={tStatus('high')} statusColor="text-[#16a34a]" iconColor="text-[#16a34a]" />
          <MetricBox icon={<AlertTriangle size={20} />} title={t('supplyRisk')} status={tStatus('medium')} statusColor="text-[#16a34a]" iconColor="text-[#ea580c]" />
          <MetricBox icon={<TrendingUp size={20} />} title={t('seasonality')} status={tStatus('low')} statusColor="text-[#16a34a]" iconColor="text-[#16a34a]" />
        </div>

        {/* Key Insights Side Panel */}
        <div className="w-full lg:w-72 bg-[#f4f9f6] border border-[#d1e6db] rounded-2xl p-6 shrink-0 shadow-sm">
          <h3 className="text-sm font-bold text-forest-deep mb-4">{t('keyInsights')}</h3>
          <ul className="space-y-4">
            <li className="flex items-start">
              <Crosshair size={14} className="text-[#16a34a] mt-1 mr-2 shrink-0" />
              <span className="text-sm font-medium text-ink">{assessment}</span>
            </li>
            <li className="flex items-start">
              <Crosshair size={14} className="text-[#16a34a] mt-1 mr-2 shrink-0" />
              <span className="text-sm font-medium text-ink">{t('compFound', { count: compCount })}</span>
            </li>
          </ul>
        </div>

      </div>
    </div>
  );
};

// 6. Map Section
const MapSection = ({ lat, lng, radiusKm, competitors }: any) => {
  const t = useTranslations('market.map');
  const legendItems = [
    { label: t('legend.competitors'), color: 'bg-blue-500' },
    { label: t('legend.customers'), color: 'bg-orange-400' },
    { label: t('legend.transport'), color: 'bg-yellow-500' },
    { label: t('legend.markets'), color: 'bg-green-500' },
    { label: t('legend.schools'), color: 'bg-purple-500' },
    { label: t('legend.hospitals'), color: 'bg-pink-500' },
    { label: t('legend.opportunity'), color: 'bg-blue-400' },
  ];

  return (
    <div>
      <h2 className="text-xl font-bold text-forest-deep mb-4">{t('title')}</h2>
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Real Interactive Map Area */}
        <div className="flex-1 h-[400px] border border-premium-border rounded-2xl relative overflow-hidden flex flex-col">
          <div className="flex-1 [&>div]:h-full [&>div]:w-full">
            <MapRadiusOverlay 
              lat={lat} 
              lng={lng} 
              radiusKm={radiusKm} 
              competitors={competitors} 
            />
          </div>
        </div>

        {/* Legend */}
        <div className="w-full lg:w-64 bg-white rounded-2xl border border-premium-border p-6 shrink-0 shadow-sm self-start">
          <ul className="space-y-4">
            {legendItems.map(item => (
              <li key={item.label} className="flex items-center">
                <div className={`w-3 h-3 rounded-full ${item.color} mr-3 shadow-sm`} />
                <span className="text-sm font-medium text-ink-soft">{item.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

// 7. Competitor Analysis Section
const CompetitorAnalysis = ({ competitors }: any) => {
  const t = useTranslations('market.competitors');
  const tStatus = useTranslations('dashboard.metrics.status');
  return (
    <div className="animate-in fade-in duration-300">
      <h2 className="text-xl font-bold text-forest-deep mb-4">{t('title')}</h2>
      <div className="bg-white border border-premium-border rounded-2xl p-6 shadow-sm overflow-x-auto">
        <table className="w-full text-left min-w-[600px]">
          <thead>
            <tr className="border-b border-premium-border text-sm text-ink-soft">
              <th className="pb-3 font-medium">{t('name')}</th>
              <th className="pb-3 font-medium">{t('distance')}</th>
              <th className="pb-3 font-medium">{t('volume')}</th>
              <th className="pb-3 font-medium">{t('threat')}</th>
            </tr>
          </thead>
          <tbody className="text-sm font-bold text-ink">
            {competitors.length === 0 && (
              <tr>
                <td colSpan={4} className="py-8 text-center text-ink-soft font-medium">{t('noComp')}</td>
              </tr>
            )}
            {competitors.map((comp: any, i: number) => (
              <tr key={i} className="border-b border-premium-border/50">
                <td className="py-4 capitalize">{comp.name.replace(/_/g, ' ')}</td>
                <td className="py-4 text-ink-soft">{comp.distance_km.toFixed(1)} km</td>
                <td className="py-4">~{Math.max(20, Math.floor(100 / (comp.distance_km + 0.1)))} {t('customers')}</td>
                <td className={`py-4 ${comp.distance_km < 2 ? 'text-red-500' : 'text-orange-500'}`}>
                  {comp.distance_km < 2 ? tStatus('high') : tStatus('medium')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// 8. Customer Insights Section
const CustomerInsights = ({ consumerBase }: any) => {
  const t = useTranslations('market.customers');
  return (
    <div className="animate-in fade-in duration-300 flex flex-col md:flex-row gap-6">
      <div className="flex-1 bg-white border border-premium-border rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-forest-deep mb-6">{t('demographics')}</h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b border-premium-border/50 pb-2">
            <span className="text-sm font-medium text-ink-soft">{t('ageGroup')}</span>
            <span className="text-sm font-bold text-ink">25 - 45 years</span>
          </div>
          <div className="flex justify-between items-center border-b border-premium-border/50 pb-2">
            <span className="text-sm font-medium text-ink-soft">{t('income')}</span>
            <span className="text-sm font-bold text-ink">Middle Income</span>
          </div>
          <div className="flex justify-between items-center border-b border-premium-border/50 pb-2">
            <span className="text-sm font-medium text-ink-soft">{t('useCase')}</span>
            <span className="text-sm font-bold text-ink">Daily essentials / Utility</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-ink-soft">{t('peakHours')}</span>
            <span className="text-sm font-bold text-[#ea580c]">8 AM - 11 AM & 5 PM - 8 PM</span>
          </div>
        </div>
      </div>
      <div className="flex-1 bg-white border border-premium-border rounded-2xl p-6 shadow-sm flex items-center justify-center">
        <div className="text-center">
          <Users size={48} className="mx-auto text-[#16a34a] mb-4 opacity-50" />
          <h3 className="font-bold text-ink mb-2">{t('size')}</h3>
          <p className="text-sm text-ink-soft">{t('potential', { count: consumerBase?.toLocaleString() || "15,000" })}</p>
        </div>
      </div>
    </div>
  );
};

// 9. Strengths, Weaknesses, Opportunities, Threats & Risks Section
const SwotAndRisks = ({ strengths = [], weaknesses = [], opportunities = [], threats = [] }: any) => {
  const t = useTranslations('market.swot');
  return (
    <div className="animate-in fade-in duration-300">
      <h2 className="text-xl font-bold text-forest-deep mb-4">{t('title')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-[#16a34a] mb-2 flex items-center">
            <Activity size={18} className="mr-2" /> {t('strengths')}
          </h3>
          <ul className="list-disc list-inside text-sm font-medium text-ink space-y-1.5 ml-1">
            {strengths.length > 0 ? strengths.map((item: string, i: number) => (
              <li key={i}>{item}</li>
            )) : <li>{t('noStrengths')}</li>}
          </ul>
        </div>
        <div className="bg-[#fff1f2] border border-[#fecdd3] rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-[#e11d48] mb-2 flex items-center">
            <AlertTriangle size={18} className="mr-2" /> {t('weaknesses')}
          </h3>
          <ul className="list-disc list-inside text-sm font-medium text-ink space-y-1.5 ml-1">
            {weaknesses.length > 0 ? weaknesses.map((item: string, i: number) => (
              <li key={i}>{item}</li>
            )) : <li>{t('noWeaknesses')}</li>}
          </ul>
        </div>
        <div className="bg-[#eff6ff] border border-[#bfdbfe] rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-[#2563eb] mb-2 flex items-center">
            <Target size={18} className="mr-2" /> {t('opportunities')}
          </h3>
          <ul className="list-disc list-inside text-sm font-medium text-ink space-y-1.5 ml-1">
            {opportunities.length > 0 ? opportunities.map((item: string, i: number) => (
              <li key={i}>{item}</li>
            )) : <li>{t('noOpportunities')}</li>}
          </ul>
        </div>
        <div className="bg-[#fff7ed] border border-[#fed7aa] rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-[#ea580c] mb-2 flex items-center">
            <ShieldAlert size={18} className="mr-2" /> {t('threats')}
          </h3>
          <ul className="list-disc list-inside text-sm font-medium text-ink space-y-1.5 ml-1">
            {threats.length > 0 ? threats.map((item: string, i: number) => (
              <li key={i}>{item}</li>
            )) : <li>{t('noThreats')}</li>}
          </ul>
        </div>
      </div>
    </div>
  );
};

// 10. Pricing Strategy Section
const PricingStrategy = ({ low, high, unit }: any) => {
  const t = useTranslations('market.pricing');
  const avg = ((low + high) / 2).toFixed(0);
  return (
    <div className="animate-in fade-in duration-300">
      <h2 className="text-xl font-bold text-forest-deep mb-4">{t('title')}</h2>
      
      <div className="flex flex-col lg:flex-row gap-6 mb-8">
        {/* Recommended Pricing Box */}
        <div className="flex-1 bg-gradient-to-br from-[#16a34a] to-[#14532d] rounded-2xl p-8 shadow-card text-white flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
          <h3 className="text-sm font-bold text-white/80 uppercase tracking-wider mb-2">{t('optimal')}</h3>
          <div className="font-display font-bold text-4xl mb-2">₹{low} - ₹{high} <span className="text-xl font-medium text-white/80">/ {unit || 'unit'}</span></div>
          <p className="text-sm font-medium text-white/90">{t('basedOn')}</p>
        </div>

        {/* Value Proposition */}
        <div className="flex-[1.5] bg-white border border-premium-border rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-forest-deep mb-3">{t('valueProp')}</h3>
          <p className="text-sm text-ink-soft mb-4 leading-relaxed">
            {t('desc').split('firmly')[0]}
            <strong>₹{avg}</strong> firmly {t('desc').split('firmly')[1]}
          </p>
          <div className="flex items-center p-3 bg-[#f4f9f6] border border-[#d1e6db] rounded-xl">
            <Check size={18} className="text-[#16a34a] mr-3 shrink-0" />
            <span className="text-sm font-bold text-ink">{t('revenue')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// 11. Government Schemes Section
const GovSchemes = () => {
  const t = useTranslations('market.schemes');
  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-forest-deep">{t('title')}</h2>
        <span className="px-3 py-1 bg-gradient-to-r from-[#ea580c] to-[#f97316] text-white text-xs font-bold rounded-full shadow-sm animate-pulse">
          {t('highly')}
        </span>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        
        {/* Scheme 1 */}
        <div className="bg-white border-2 border-[#16a34a] rounded-2xl p-6 shadow-card relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#16a34a]/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-[#16a34a]/20 transition-all"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div>
              <h3 className="text-xl font-bold text-ink">Pradhan Mantri MUDRA Yojana</h3>
              <p className="text-sm font-medium text-ink-soft">Pradhan Mantri Micro Units Development & Refinance Agency</p>
            </div>
            <div className="bg-[#16a34a] p-2 rounded-xl text-white">
              <IndianRupee size={24} />
            </div>
          </div>
          <div className="space-y-3 mb-6 relative z-10">
            <div className="flex items-start">
              <Check size={16} className="text-[#16a34a] mt-0.5 mr-2 shrink-0" />
              <span className="text-sm text-ink font-medium">Up to <strong className="text-forest-deep">₹10 Lakhs</strong> collateral-free loan.</span>
            </div>
            <div className="flex items-start">
              <Check size={16} className="text-[#16a34a] mt-0.5 mr-2 shrink-0" />
              <span className="text-sm text-ink font-medium">Ideal for working capital and equipment purchase.</span>
            </div>
            <div className="flex items-start">
              <Check size={16} className="text-[#16a34a] mt-0.5 mr-2 shrink-0" />
              <span className="text-sm text-ink font-medium">Subsidized interest rates via partner banks.</span>
            </div>
          </div>
          <a 
            href="https://www.mudra.org.in/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center w-full py-3 bg-[#16a34a] text-white text-sm font-bold rounded-xl shadow-sm hover:bg-[#15803d] transition-colors relative z-10"
          >
            Apply on Official Portal <ArrowRight size={16} className="ml-2" />
          </a>
        </div>

        {/* Scheme 2 */}
        <div className="bg-white border border-premium-border rounded-2xl p-6 shadow-sm hover:border-premium-border-strong transition-all relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-blue-500/10 transition-all"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div>
              <h3 className="text-xl font-bold text-ink">Prime Minister Employment Generation Programme</h3>
              <p className="text-sm font-medium text-ink-soft">Prime Minister&apos;s Employment Generation Programme</p>
            </div>
            <div className="bg-blue-500 p-2 rounded-xl text-white">
              <Wallet size={24} />
            </div>
          </div>
          <div className="space-y-3 mb-6 relative z-10">
            <div className="flex items-start">
              <Check size={16} className="text-blue-500 mt-0.5 mr-2 shrink-0" />
              <span className="text-sm text-ink font-medium">Up to <strong className="text-forest-deep">35% subsidy</strong> on project cost for rural areas.</span>
            </div>
            <div className="flex items-start">
              <Check size={16} className="text-blue-500 mt-0.5 mr-2 shrink-0" />
              <span className="text-sm text-ink font-medium">Funding up to ₹50 Lakhs for manufacturing, ₹20L for services.</span>
            </div>
            <div className="flex items-start">
              <Check size={16} className="text-blue-500 mt-0.5 mr-2 shrink-0" />
              <span className="text-sm text-ink font-medium">Administered by KVIC at national level.</span>
            </div>
          </div>
          <a 
            href="https://www.kviconline.gov.in/pmegpeportal/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center w-full py-3 bg-white border-2 border-blue-500 text-blue-600 text-sm font-bold rounded-xl shadow-sm hover:bg-blue-50 transition-colors relative z-10"
          >
            Check Eligibility & Apply <ArrowRight size={16} className="ml-2" />
          </a>
        </div>

      </div>
    </div>
  );
};

export default function MarketIntelligencePage({ params }: { params: { categoryId: string }}) {
  const { locationName, analysisResult } = useStore();
  const [activeTab, setActiveTab] = useState("snapshot");
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const t = useTranslations('market');

  useEffect(() => {
    if (analysisResult) {
      setError("");
      setLoading(false);
    } else {
      setError(t('error.desc'));
      setLoading(false);
    }
  }, [analysisResult, t]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fcfbf8] flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-forest mb-4" size={32} />
        <h2 className="text-lg font-bold text-ink">{t('loading.title')}</h2>
      </div>
    );
  }

  if (error || !analysisResult) {
    return (
      <div className="min-h-screen bg-[#fcfbf8] flex flex-col items-center justify-center p-8 text-center">
        <AlertTriangle className="text-amber-500 mb-4" size={48} />
        <h2 className="text-xl font-bold text-ink mb-2">{t('error.title')}</h2>
        <p className="text-ink-soft mb-6">{error || t('error.desc')}</p>
        <button onClick={() => window.location.href = '/'} className="px-5 py-2.5 bg-forest text-white rounded-xl font-bold shadow-sm hover:bg-forest-deep transition-colors">
          {t('error.btn')}
        </button>
      </div>
    );
  }

  // Extract from the unified JSON response
  const { market, scores, data_available, location: locationData } = analysisResult;

  if (data_available === false) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-6 pb-20 animate-in fade-in duration-500 bg-[#fcfbf8] min-h-screen">
        <TopHeader />
        <h1 className="text-[32px] font-bold text-forest-deep tracking-tight mb-6 border-b border-premium-border pb-6">
          {t('title')}
        </h1>
        <LocationUnavailableState 
          locationName={locationData?.resolved || locationData?.district || 'this location'}
          message={locationData?.coverage_message}
        />
      </div>
    );
  }

  const scoreNum = scores?.overall || 50;
  const scoreStr = "Market Assessment Available";
  
  // Set fallback coordinates to Solapur center if not available
  const lat = 17.6715;
  const lng = 75.9080;

  const competitors = market?.competitors || [];
  const compCount = market?.competitor_count || competitors.length;
  const consumerBase = market?.target_customer_base || 15000;
  
  // Extract pricing from financial model or fallback
  const pricingLow = market?.pricing_band?.low || 10;
  const pricingHigh = market?.pricing_band?.high || 25;
  const pricingUnit = 'unit';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-6 pb-20 animate-in fade-in duration-500 bg-[#fcfbf8] min-h-screen">
      <TopHeader />
      <h1 className="text-[32px] font-bold text-forest-deep tracking-tight mb-6 border-b border-premium-border pb-6">
        {t('title')}
      </h1>
      
      <ContextBar categoryName={market?.category_name || "Custom Business"} locationName={locationName || "Selected Location"} score={scoreNum} />
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {activeTab === "snapshot" && <MarketSnapshot assessment={scoreStr} compCount={compCount} />}
      {activeTab === "map" && <MapSection lat={lat} lng={lng} radiusKm={5} competitors={competitors} />}
      {activeTab === "competitors" && <CompetitorAnalysis competitors={competitors} />}
      {activeTab === "customers" && <CustomerInsights consumerBase={consumerBase} />}
      {activeTab === "swot" && <SwotAndRisks 
        strengths={market?.strengths} 
        weaknesses={market?.weaknesses} 
        opportunities={market?.opportunities} 
        threats={market?.threats} 
      />}
      {activeTab === "pricing" && <PricingStrategy low={pricingLow} high={pricingHigh} unit={pricingUnit} />}
      {activeTab === "schemes" && <GovSchemes />}
    </div>
  );
}

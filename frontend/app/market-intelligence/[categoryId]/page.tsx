"use client";
import React, { useState } from "react";
import { useStore } from "@/lib/store";
import { 
  Bell, ChevronDown, Search, ArrowRight, Home, IndianRupee, ShieldAlert, Wallet, MapPin, Check,
  Activity, Users, TrendingUp, AlertTriangle, Crosshair, Target
} from "lucide-react";
import { MapRadiusOverlay } from "@/components/MapRadiusOverlay";

// 1. Top Header with Global Search
const TopHeader = () => (
  <div className="flex justify-between items-center mb-6 pt-2">
    <div className="flex-1 max-w-xl relative">
      <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-faint" />
      <input 
        type="text" 
        placeholder="Search location or business..." 
        className="w-full bg-white border border-premium-border rounded-2xl py-2.5 pl-11 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-saffron"
      />
    </div>
    <div className="flex items-center space-x-4">
      <button className="text-ink-soft hover:text-ink transition-colors">
        <Bell size={20} />
      </button>
      <button className="flex items-center px-3 py-1.5 bg-white border border-premium-border rounded-xl text-sm font-bold shadow-sm hover:border-premium-border-strong">
        EN <ChevronDown size={14} className="ml-1 text-ink-soft" />
      </button>
    </div>
  </div>
);

// 2. Context Bar & Score
const ContextBar = () => (
  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
    <div className="flex bg-white rounded-2xl border border-premium-border shadow-sm p-1 max-w-2xl flex-1">
      <div className="flex items-center px-4 py-2 flex-1 border-r border-premium-border">
        <Search size={16} className="text-ink-soft mr-2" />
        <span className="font-bold text-ink text-sm flex-1">E-Rickshaw</span>
        <ChevronDown size={14} className="text-ink-soft" />
      </div>
      <div className="flex items-center px-4 py-2 flex-1 justify-between">
        <span className="font-medium text-ink-soft text-sm">Solapur, Maharashtra</span>
        <button className="px-3 py-1 bg-white border border-premium-border rounded-lg text-xs font-bold text-ink hover:bg-cream-deep">
          Change
        </button>
      </div>
    </div>
    
    <div className="bg-[#e8f5e9] border border-[#c8e6c9] rounded-2xl p-3 flex items-center shadow-sm w-fit">
      <div className="w-12 h-12 bg-[#16a34a] rounded-full flex items-center justify-center text-white font-display font-bold text-xl mr-3 shrink-0">
        91
      </div>
      <div>
        <div className="text-xs font-bold text-[#16a34a] uppercase tracking-wider mb-0.5">Market Opportunity</div>
        <div className="text-xl font-bold text-[#16a34a]">91<span className="text-xs">/100</span></div>
      </div>
    </div>
  </div>
);

// 3. Tabs
const Tabs = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (t: string) => void }) => {
  const tabs = ["Market Snapshot", "Location Map", "Competitor Analysis", "Customer Insights", "SWOT & Risks", "Pricing Strategy"];
  return (
    <div className="flex space-x-8 border-b border-premium-border mb-8 overflow-x-auto custom-scrollbar">
      {tabs.map((tab) => (
        <button 
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`pb-3 text-sm font-bold whitespace-nowrap border-b-2 transition-colors ${
            activeTab === tab
              ? 'border-[#ea580c] text-[#ea580c]' 
              : 'border-transparent text-ink-soft hover:text-ink'
          }`}
        >
          {tab}
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
const MarketSnapshot = () => (
  <div className="mb-10">
    <h2 className="text-xl font-bold text-forest-deep mb-4">Market Snapshot</h2>
    <div className="flex flex-col lg:flex-row gap-6">
      
      {/* 7-grid */}
      <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricBox 
          icon={<Target size={20} />} title="Demand" status="High" statusColor="text-[#16a34a]" iconColor="text-[#16a34a]" 
        />
        <MetricBox 
          icon={<Users size={20} />} title="Competition" status="Medium" statusColor="text-[#ea580c]" iconColor="text-[#ea580c]" 
        />
        <MetricBox 
          icon={<Activity size={20} />} title="Saturation" status="Low" statusColor="text-[#16a34a]" iconColor="text-[#16a34a]" 
        />
        <MetricBox 
          icon={<IndianRupee size={20} />} title="Pricing Opportunity" status="High" statusColor="text-[#16a34a]" iconColor="text-[#6366f1]" 
        />
        <MetricBox 
          icon={<MapPin size={20} />} title="Accessibility" status="High" statusColor="text-[#16a34a]" iconColor="text-[#16a34a]" 
        />
        <MetricBox 
          icon={<AlertTriangle size={20} />} title="Supply Risk" status="Medium" statusColor="text-[#16a34a]" iconColor="text-[#ea580c]" 
        />
        <MetricBox 
          icon={<TrendingUp size={20} />} title="Seasonality" status="Low" statusColor="text-[#16a34a]" iconColor="text-[#16a34a]" 
        />
      </div>

      {/* Key Insights Side Panel */}
      <div className="w-full lg:w-72 bg-[#f4f9f6] border border-[#d1e6db] rounded-2xl p-6 shrink-0 shadow-sm">
        <h3 className="text-sm font-bold text-forest-deep mb-4">Key Insights</h3>
        <ul className="space-y-4">
          <li className="flex items-start">
            <Crosshair size={14} className="text-[#16a34a] mt-1 mr-2 shrink-0" />
            <span className="text-sm font-medium text-ink">Growing demand due to increasing urban mobility.</span>
          </li>
          <li className="flex items-start">
            <Crosshair size={14} className="text-[#16a34a] mt-1 mr-2 shrink-0" />
            <span className="text-sm font-medium text-ink">Moderate competition with 14 similar businesses in 10 km.</span>
          </li>
          <li className="flex items-start">
            <Crosshair size={14} className="text-[#16a34a] mt-1 mr-2 shrink-0" />
            <span className="text-sm font-medium text-ink">Potential underserved zone 3.6 km away.</span>
          </li>
        </ul>
      </div>

    </div>
  </div>
);

// 6. Map Section
const MapSection = () => {
  const legendItems = [
    { label: 'Competitors', color: 'bg-blue-500' },
    { label: 'Customers / Population', color: 'bg-orange-400' },
    { label: 'Transport Hubs', color: 'bg-yellow-500' },
    { label: 'Markets', color: 'bg-green-500' },
    { label: 'Schools', color: 'bg-purple-500' },
    { label: 'Hospitals', color: 'bg-pink-500' },
    { label: 'Opportunity Zones', color: 'bg-blue-400' },
  ];

  return (
    <div>
      <h2 className="text-xl font-bold text-forest-deep mb-4">Local Market Map</h2>
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Real Interactive Map Area */}
        <div className="flex-1 h-[400px] border border-premium-border rounded-2xl relative overflow-hidden flex flex-col">
          <div className="flex-1 [&>div]:h-full [&>div]:w-full">
            <MapRadiusOverlay 
              lat={17.6599} 
              lng={75.9064} 
              radiusKm={5} 
              competitors={[
                { name: "Competitor 1", distance_km: 1.2 },
                { name: "Competitor 2", distance_km: 2.5 },
                { name: "Competitor 3", distance_km: 3.1 }
              ]} 
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
const CompetitorAnalysis = () => (
  <div className="animate-in fade-in duration-300">
    <h2 className="text-xl font-bold text-forest-deep mb-4">Competitor Landscape</h2>
    <div className="bg-white border border-premium-border rounded-2xl p-6 shadow-sm overflow-x-auto">
      <table className="w-full text-left min-w-[600px]">
        <thead>
          <tr className="border-b border-premium-border text-sm text-ink-soft">
            <th className="pb-3 font-medium">Competitor Name</th>
            <th className="pb-3 font-medium">Distance</th>
            <th className="pb-3 font-medium">Est. Daily Volume</th>
            <th className="pb-3 font-medium">Threat Level</th>
          </tr>
        </thead>
        <tbody className="text-sm font-bold text-ink">
          <tr className="border-b border-premium-border/50">
            <td className="py-4">Super Rides E-Rickshaw</td>
            <td className="py-4 text-ink-soft">1.2 km</td>
            <td className="py-4">~150 rides</td>
            <td className="py-4 text-red-500">High</td>
          </tr>
          <tr className="border-b border-premium-border/50">
            <td className="py-4">Eco Transport Solutions</td>
            <td className="py-4 text-ink-soft">2.5 km</td>
            <td className="py-4">~90 rides</td>
            <td className="py-4 text-orange-500">Medium</td>
          </tr>
          <tr>
            <td className="py-4">Greenway Motors</td>
            <td className="py-4 text-ink-soft">3.1 km</td>
            <td className="py-4">~40 rides</td>
            <td className="py-4 text-green-500">Low</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
);

// 8. Customer Insights Section
const CustomerInsights = () => (
  <div className="animate-in fade-in duration-300 flex flex-col md:flex-row gap-6">
    <div className="flex-1 bg-white border border-premium-border rounded-2xl p-6 shadow-sm">
      <h2 className="text-lg font-bold text-forest-deep mb-6">Demographics</h2>
      <div className="space-y-4">
        <div className="flex justify-between items-center border-b border-premium-border/50 pb-2">
          <span className="text-sm font-medium text-ink-soft">Primary Age Group</span>
          <span className="text-sm font-bold text-ink">25 - 45 years</span>
        </div>
        <div className="flex justify-between items-center border-b border-premium-border/50 pb-2">
          <span className="text-sm font-medium text-ink-soft">Average Income Level</span>
          <span className="text-sm font-bold text-ink">Middle Income</span>
        </div>
        <div className="flex justify-between items-center border-b border-premium-border/50 pb-2">
          <span className="text-sm font-medium text-ink-soft">Primary Use Case</span>
          <span className="text-sm font-bold text-ink">Last-mile transit (Station to Home)</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-ink-soft">Peak Demand Hours</span>
          <span className="text-sm font-bold text-[#ea580c]">8 AM - 11 AM & 5 PM - 8 PM</span>
        </div>
      </div>
    </div>
    <div className="flex-1 bg-white border border-premium-border rounded-2xl p-6 shadow-sm flex items-center justify-center">
      <div className="text-center">
        <Users size={48} className="mx-auto text-[#16a34a] mb-4 opacity-50" />
        <h3 className="font-bold text-ink mb-2">Customer Base is Growing</h3>
        <p className="text-sm text-ink-soft">Expect a 15% increase in commuter traffic over the next 3 years due to the new metro expansion.</p>
      </div>
    </div>
  </div>
);

// 9. SWOT & Risks Section
const SwotAndRisks = () => (
  <div className="animate-in fade-in duration-300">
    <h2 className="text-xl font-bold text-forest-deep mb-4">SWOT Analysis</h2>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {/* Strengths */}
      <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-[#16a34a] mb-2 flex items-center">
          <Activity size={18} className="mr-2" /> Strengths
        </h3>
        <ul className="list-disc list-inside text-sm font-medium text-ink space-y-1.5 ml-1">
          <li>Low barrier to entry with subsidized schemes.</li>
          <li>Eco-friendly alternative with growing public acceptance.</li>
          <li>High daily cash liquidity.</li>
        </ul>
      </div>

      {/* Weaknesses */}
      <div className="bg-[#fff1f2] border border-[#fecdd3] rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-[#e11d48] mb-2 flex items-center">
          <AlertTriangle size={18} className="mr-2" /> Weaknesses
        </h3>
        <ul className="list-disc list-inside text-sm font-medium text-ink space-y-1.5 ml-1">
          <li>Limited battery range restricts daily mileage.</li>
          <li>High dependency on daily operations for income.</li>
          <li>Physical wear and tear on the vehicle.</li>
        </ul>
      </div>

      {/* Opportunities */}
      <div className="bg-[#eff6ff] border border-[#bfdbfe] rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-[#2563eb] mb-2 flex items-center">
          <Target size={18} className="mr-2" /> Opportunities
        </h3>
        <ul className="list-disc list-inside text-sm font-medium text-ink space-y-1.5 ml-1">
          <li>Underserved routes near new industrial parks.</li>
          <li>Contractual tie-ups with local schools for transport.</li>
          <li>Ad placement revenue on the vehicle exterior.</li>
        </ul>
      </div>

      {/* Threats */}
      <div className="bg-[#fff7ed] border border-[#fed7aa] rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-[#ea580c] mb-2 flex items-center">
          <ShieldAlert size={18} className="mr-2" /> Threats
        </h3>
        <ul className="list-disc list-inside text-sm font-medium text-ink space-y-1.5 ml-1">
          <li>Rapidly increasing local competition.</li>
          <li>Changes in municipal zoning laws for E-Rickshaws.</li>
          <li>Monsoon season affecting daily ridership.</li>
        </ul>
      </div>
    </div>

    <h2 className="text-xl font-bold text-forest-deep mb-4">Threats Deep-Dive</h2>
    <div className="bg-white border border-premium-border rounded-2xl p-6 shadow-sm flex flex-col space-y-6">
      <div>
        <h4 className="font-bold text-ink mb-1 flex items-center"><AlertTriangle size={14} className="text-[#ea580c] mr-2"/> Supply Chain Bottlenecks</h4>
        <p className="text-sm text-ink-soft">Spare parts for the specific E-Rickshaw model are currently sourced from a distributor 150km away. Battery replacement wait times can extend up to 7 days during peak summer months, potentially causing operational downtime.</p>
      </div>
      <div className="border-t border-premium-border/50 pt-6">
        <h4 className="font-bold text-ink mb-1 flex items-center"><TrendingUp size={14} className="text-[#ea580c] mr-2"/> Seasonal Demand Fluctuations</h4>
        <p className="text-sm text-ink-soft">Historically, ridership drops by 25% during the heavy monsoon season (July-August) in this block due to waterlogged tertiary roads. Financial buffers must be maintained in Q1 to offset this Q2 dip.</p>
      </div>
      <div className="border-t border-premium-border/50 pt-6">
        <h4 className="font-bold text-ink mb-1 flex items-center"><Users size={14} className="text-[#ea580c] mr-2"/> Single Buyer / Route Dependency</h4>
        <p className="text-sm text-ink-soft">Operating solely on the Railway Station to Main Market route exposes the business to high competition density. Diversifying routes to include the new educational hub on the outskirts mitigates this dependency.</p>
      </div>
    </div>
  </div>
);

// 10. Pricing Strategy Section
const PricingStrategy = () => (
  <div className="animate-in fade-in duration-300">
    <h2 className="text-xl font-bold text-forest-deep mb-4">Pricing Strategy</h2>
    
    <div className="flex flex-col lg:flex-row gap-6 mb-8">
      {/* Recommended Pricing Box */}
      <div className="flex-1 bg-gradient-to-br from-[#16a34a] to-[#14532d] rounded-2xl p-8 shadow-card text-white flex flex-col justify-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
        <h3 className="text-sm font-bold text-white/80 uppercase tracking-wider mb-2">Optimal Pricing Model</h3>
        <div className="font-display font-bold text-4xl mb-2">₹15 - ₹20 <span className="text-xl font-medium text-white/80">/ passenger</span></div>
        <p className="text-sm font-medium text-white/90">Based on local purchasing power and average trip distance (3-5 km).</p>
      </div>

      {/* Value Proposition */}
      <div className="flex-[1.5] bg-white border border-premium-border rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-forest-deep mb-3">Value Proposition</h3>
        <p className="text-sm text-ink-soft mb-4 leading-relaxed">
          The local demographic consists primarily of daily wage workers and students who are highly price-sensitive. 
          Setting the base fare at <strong>₹15</strong> firmly positions the service below traditional auto-rickshaws (₹30-₹50), 
          ensuring high volume and continuous occupancy.
        </p>
        <div className="flex items-center p-3 bg-[#f4f9f6] border border-[#d1e6db] rounded-xl">
          <Check size={18} className="text-[#16a34a] mr-3 shrink-0" />
          <span className="text-sm font-bold text-ink">Estimated Daily Revenue at Optimal Price: ₹1,200 - ₹1,500</span>
        </div>
      </div>
    </div>

    {/* Competitor Benchmark */}
    <h2 className="text-xl font-bold text-forest-deep mb-4">Competitor Benchmark</h2>
    <div className="bg-white border border-premium-border rounded-2xl p-6 shadow-sm">
      <div className="flex flex-col space-y-6">
        
        <div className="flex items-center">
          <div className="w-32 text-sm font-bold text-ink shrink-0">Your Strategy</div>
          <div className="flex-1 ml-4 h-6 bg-cream rounded-r-full flex items-center">
            <div className="h-6 bg-[#16a34a] rounded-r-full flex items-center justify-end px-3 text-xs font-bold text-white" style={{ width: '35%' }}>
              ₹15
            </div>
          </div>
        </div>

        <div className="flex items-center">
          <div className="w-32 text-sm font-bold text-ink-soft shrink-0">Other E-Rickshaws</div>
          <div className="flex-1 ml-4 h-6 bg-cream rounded-r-full flex items-center">
            <div className="h-6 bg-[#ea580c] rounded-r-full flex items-center justify-end px-3 text-xs font-bold text-white" style={{ width: '45%' }}>
              ₹20
            </div>
          </div>
        </div>

        <div className="flex items-center">
          <div className="w-32 text-sm font-bold text-ink-soft shrink-0">Auto Rickshaws</div>
          <div className="flex-1 ml-4 h-6 bg-cream rounded-r-full flex items-center">
            <div className="h-6 bg-[#94a3b8] rounded-r-full flex items-center justify-end px-3 text-xs font-bold text-white" style={{ width: '85%' }}>
              ₹40
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
);

export default function MarketIntelligencePage() {
  const [activeTab, setActiveTab] = useState("Market Snapshot");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-6 pb-20 animate-in fade-in duration-500 bg-[#fcfbf8] min-h-screen">
      <TopHeader />
      <h1 className="text-[32px] font-bold text-forest-deep tracking-tight mb-6">
        Market Intelligence
      </h1>
      <ContextBar />
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {activeTab === "Market Snapshot" && <MarketSnapshot />}
      {activeTab === "Location Map" && <MapSection />}
      {activeTab === "Competitor Analysis" && <CompetitorAnalysis />}
      {activeTab === "Customer Insights" && <CustomerInsights />}
      {activeTab === "SWOT & Risks" && <SwotAndRisks />}
      {activeTab === "Pricing Strategy" && <PricingStrategy />}
    </div>
  );
}

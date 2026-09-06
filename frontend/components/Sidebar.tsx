"use client";
import React from 'react';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { 
  Home, Compass, Map, PieChart, Target, Zap, Folder, FileText, 
  MessageSquare, HelpCircle, Settings, User, BarChart, 
  ListOrdered, FileArchive, Briefcase, ShoppingCart
} from 'lucide-react';

const dict: Record<string, Record<string, string>> = {
  EN: {
    dashboard: "Dashboard",
    discover: "Discover Business",
    compare: "Compare",
    financials: "Financials",
    score: "YUKTI Score",
    simulator: "What-If Simulator",
    plans: "My Business Plans",
    tools: "Tools",
    documents: "Documents",
    actionPlan: "Action Plan",
    copilot: "AI Copilot",
    help: "Help & Guidance",
    settings: "Settings",
    profile: "Profile",
    switchAdvisor: "Switch to Advisor",
    switchEntrepreneur: "Switch to Entrepreneur",
    vendorMarketplace: "Vendor Hub"
  },
  HI: {
    dashboard: "डैशबोर्ड",
    discover: "व्यवसाय खोजें",
    compare: "तुलना करें",
    financials: "वित्तीय विवरण",
    score: "युक्ति स्कोर",
    simulator: "सिम्युलेटर",
    plans: "मेरी व्यवसाय योजनाएँ",
    tools: "उपकरण",
    documents: "दस्तावेज़",
    actionPlan: "कार्य योजना",
    copilot: "एआई कोपायलट",
    help: "मदद और मार्गदर्शन",
    settings: "सेटिंग्स",
    profile: "प्रोफ़ाइल",
    switchAdvisor: "सलाहकार पर स्विच करें",
    switchEntrepreneur: "उद्यमी पर स्विच करें",
    vendorMarketplace: "विक्रेता बाज़ार"
  },
  MR: {
    dashboard: "डॅशबोर्ड",
    discover: "व्यवसाय शोधा",
    compare: "तुलना करा",
    financials: "आर्थिक तपशील",
    score: "युक्ती स्कोअर",
    simulator: "सिम्युलेटर",
    plans: "माझ्या व्यवसाय योजना",
    tools: "साधने",
    documents: "कागदपत्रे",
    actionPlan: "कृती आराखडा",
    copilot: "एआय कोपायलट",
    help: "मदत आणि मार्गदर्शन",
    settings: "सेटिंग्ज",
    profile: "प्रोफाइल",
    switchAdvisor: "सल्लागार मोड",
    switchEntrepreneur: "उद्योजक मोड",
    vendorMarketplace: "विक्रेता बाजार"
  }
};

export function Sidebar() {
  const { userMode, toggleUserMode, preferredLanguage, setLanguage } = useStore();
  
  // Fallback to EN if language not found
  const t = dict[preferredLanguage] || dict.EN;

  return (
    <aside className="w-64 bg-black text-terminal-text hidden md:flex flex-col border-r border-zinc-800">
      <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold tracking-widest text-terminal-amber font-mono">YUKTI</span>
        </Link>
        <span className={`text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded ${userMode === 'advisor' ? 'bg-terminal-cyan text-black' : 'bg-terminal-green text-black'}`}>
          {userMode}
        </span>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-4 px-3 font-mono text-sm space-y-1">
        {userMode === 'entrepreneur' ? (
          <>
            <Link href="/dashboard" className="flex items-center px-3 py-2 rounded-md hover:bg-zinc-900 hover:text-white transition-colors">
              <Home size={18} className="mr-3 text-terminal-cyan" /> {t.dashboard}
            </Link>
            <Link href="/discover" className="flex items-center px-3 py-2 rounded-md hover:bg-zinc-900 hover:text-white transition-colors">
              <Compass size={18} className="mr-3 text-terminal-cyan" /> {t.discover}
            </Link>
            <Link href="/compare" className="flex items-center px-3 py-2 rounded-md hover:bg-zinc-900 hover:text-white transition-colors">
              <Map size={18} className="mr-3 text-terminal-cyan" /> {t.compare}
            </Link>
            <Link href="/financials" className="flex items-center px-3 py-2 rounded-md hover:bg-zinc-900 hover:text-white transition-colors">
              <PieChart size={18} className="mr-3 text-terminal-cyan" /> {t.financials}
            </Link>
            <Link href="/score/demo" className="flex items-center px-3 py-2 rounded-md hover:bg-zinc-900 hover:text-white transition-colors">
              <Target size={18} className="mr-3 text-terminal-cyan" /> {t.score}
            </Link>
            <Link href="/simulator" className="flex items-center px-3 py-2 rounded-md hover:bg-zinc-900 hover:text-white transition-colors">
              <Zap size={18} className="mr-3 text-terminal-cyan" /> {t.simulator}
            </Link>
            <Link href="/plans" className="flex items-center px-3 py-2 rounded-md hover:bg-zinc-900 hover:text-white transition-colors">
              <Folder size={18} className="mr-3 text-terminal-cyan" /> {t.plans}
            </Link>

            <div className="mt-8 mb-2 px-3 text-xs uppercase tracking-widest text-zinc-500">{t.tools}</div>
            
            <Link href="/documents" className="flex items-center px-3 py-2 rounded-md hover:bg-zinc-900 hover:text-white transition-colors">
              <FileText size={18} className="mr-3 text-zinc-400" /> {t.documents}
            </Link>
            <Link href="/action-plan" className="flex items-center px-3 py-2 rounded-md hover:bg-zinc-900 hover:text-white transition-colors">
              <Target size={18} className="mr-3 text-zinc-400" /> {t.actionPlan}
            </Link>
            <Link href="/marketplace" className="flex items-center px-3 py-2 rounded-md hover:bg-zinc-900 hover:text-white transition-colors">
              <ShoppingCart size={18} className="mr-3 text-zinc-400" /> {t.vendorMarketplace}
            </Link>
          </>
        ) : (
          <>
            <Link href="/advisor/analytics" className="flex items-center px-3 py-2 rounded-md hover:bg-zinc-900 hover:text-white transition-colors">
              <BarChart size={18} className="mr-3 text-terminal-amber" /> Analytics Overview
            </Link>
            <Link href="/advisor/applications" className="flex items-center px-3 py-2 rounded-md hover:bg-zinc-900 hover:text-white transition-colors">
              <ListOrdered size={18} className="mr-3 text-terminal-amber" /> Review Queue
            </Link>
            <Link href="/advisor/reports" className="flex items-center px-3 py-2 rounded-md hover:bg-zinc-900 hover:text-white transition-colors">
              <FileArchive size={18} className="mr-3 text-terminal-amber" /> Regional Reports
            </Link>
          </>
        )}
      </nav>

      <div className="p-4 border-t border-zinc-800 font-mono text-xs">
        <button onClick={toggleUserMode} className="w-full mb-4 flex items-center justify-center px-3 py-2 rounded-md bg-zinc-900 hover:bg-zinc-800 text-white transition-colors border border-zinc-700">
          <Briefcase size={14} className="mr-2" /> 
          {userMode === 'entrepreneur' ? t.switchAdvisor : t.switchEntrepreneur}
        </button>

        <Link href="/settings" className="flex items-center px-3 py-2 rounded-md hover:bg-zinc-900 hover:text-white transition-colors">
          <Settings size={16} className="mr-3" /> {t.settings}
        </Link>
        <Link href="/profile" className="flex items-center px-3 py-2 rounded-md hover:bg-zinc-900 hover:text-white transition-colors">
          <User size={16} className="mr-3" /> {t.profile}
        </Link>
        
        <div className="mt-4 px-3 flex items-center justify-center space-x-4 text-zinc-500 border-t border-zinc-800 pt-4">
          <button 
            onClick={() => setLanguage('EN')} 
            className={`transition-colors ${preferredLanguage === 'EN' ? 'text-white font-bold' : 'hover:text-white'}`}
          >
            EN
          </button>
          <span>|</span>
          <button 
            onClick={() => setLanguage('HI')} 
            className={`transition-colors ${preferredLanguage === 'HI' ? 'text-white font-bold' : 'hover:text-white'}`}
          >
            हिं
          </button>
          <span>|</span>
          <button 
            onClick={() => setLanguage('MR')} 
            className={`transition-colors ${preferredLanguage === 'MR' ? 'text-white font-bold' : 'hover:text-white'}`}
          >
            मर
          </button>
        </div>
      </div>
    </aside>
  );
}

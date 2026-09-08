"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStore } from '@/lib/store';
import { 
  Search, LayoutDashboard, BarChart3, Calculator, Target, Activity, 
  FileText, CheckSquare, Folder, HelpCircle, MapPin, ChevronDown, User, 
  BarChart, ListOrdered, FileArchive, Menu, PanelLeftClose
} from 'lucide-react';
import Image from 'next/image';

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
  const { userMode, toggleUserMode, preferredLanguage, setLanguage, categoryId, profileName } = useStore();
  const [isOpen, setIsOpen] = useState(true);
  const pathname = usePathname();
  
  const publicPages = ['/', '/onboarding', '/how-it-works', '/about', '/support'];
  if (publicPages.includes(pathname)) return null;


  // Fallback to EN if language not found
  const t = dict[preferredLanguage] || dict.EN;

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)} 
        className="fixed top-4 left-4 z-50 p-2 bg-white border border-premium-border rounded-md shadow-sm text-ink hover:bg-cream hidden md:flex items-center justify-center transition-colors"
      >
        <Menu size={20} className="text-forest" />
      </button>
    );
  }

  const NavLink = ({ href, icon: Icon, label, isActive = false, className = "" }: { href: string, icon: any, label: string, isActive?: boolean, className?: string }) => {
    return (
      <Link 
        href={href} 
        className={`flex items-center px-4 py-3 rounded-2xl mb-1 transition-all font-medium text-sm ${
          isActive 
            ? 'bg-[#fff5f0] text-[#ea580c] font-bold shadow-sm ring-1 ring-black/5' 
            : 'text-ink-soft hover:bg-black/5 hover:text-ink'
        } ${className}`}
      >
        <Icon size={18} className={`mr-4 ${isActive ? 'text-[#ea580c]' : 'text-ink-soft'}`} />
        {label}
      </Link>
    );
  };

  return (
    <aside className="w-[280px] bg-[#fcfbf8] text-ink hidden md:flex flex-col border-r border-premium-border/50 shadow-sm shrink-0 h-screen overflow-hidden">
      
      <div className="p-6 pt-8 flex items-center mb-6">
        <Link href="/" className="flex items-center space-x-3 group">
          <Image
            src="/yukti-logo-transparent.png"
            alt="YUKTI Logo"
            width={64}
            height={64}
            className="object-contain -mt-1 transition-transform group-hover:scale-105 drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)]"
            priority
          />
          <div className="flex flex-col justify-center">
            <span className="font-display font-bold text-4xl text-forest-deep tracking-tight leading-none group-hover:text-[#ea580c] transition-colors">YUKTI</span>
            <span className="text-xs font-bold text-ink-soft uppercase tracking-[0.2em] mt-1">Government of India Initiative</span>
          </div>
        </Link>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-2 custom-scrollbar">
        {userMode === 'entrepreneur' ? (
          <>
            <NavLink href="/dashboard" icon={LayoutDashboard} label={t.dashboard} isActive={pathname === '/dashboard'} />
            <NavLink href="/discover" icon={Search} label={t.discover} isActive={pathname === '/discover'} />
            <NavLink href={`/market-intelligence/${categoryId || 'demo'}`} icon={BarChart3} label="Market Intelligence" isActive={pathname.includes('/market-intelligence')} />
            <NavLink href="/financials" className="text-sm" icon={Calculator} label={t.financials} isActive={pathname === '/financials'} />
            <NavLink href="/score/demo" icon={Target} label={t.score} isActive={pathname.includes('/score')} />
            <NavLink href="/simulator" icon={Activity} label={t.simulator} isActive={pathname === '/simulator'} />
            <NavLink href="/plans" icon={FileText} label={t.plans} isActive={pathname === '/plans'} />
            <NavLink href="/action-plan" icon={CheckSquare} label={t.actionPlan} isActive={pathname === '/action-plan'} />
            <NavLink href="/documents" icon={Folder} label={t.documents} isActive={pathname === '/documents'} />
            <NavLink href="/ask" icon={HelpCircle} label="Ask YUKTI" isActive={pathname === '/ask'} />
          </>
        ) : (
          <>
            <NavLink href="/advisor/analytics" icon={BarChart} label="Analytics Overview" isActive={pathname === '/advisor/analytics'} />
            <NavLink href="/advisor/applications" icon={ListOrdered} label="Review Queue" isActive={pathname === '/advisor/applications'} />
            <NavLink href="/advisor/reports" icon={FileArchive} label="Regional Reports" isActive={pathname === '/advisor/reports'} />
          </>
        )}
      </nav>

      {/* Footer */}
      <div className="p-4 mt-auto">
        <div className="bg-white rounded-xl p-3 border border-premium-border mb-4 cursor-pointer hover:border-premium-border-strong transition-colors flex items-center justify-between">
          <div className="flex items-center text-ink-soft">
            <MapPin size={16} className="mr-2" />
            <span className="text-sm font-medium">English</span>
          </div>
          <ChevronDown size={16} className="text-ink-soft" />
        </div>

        <div className="flex items-center px-3 py-2">
          <div className="w-10 h-10 rounded-full bg-[#fde68a] mr-3 overflow-hidden border border-premium-border flex items-center justify-center shrink-0">
            {/* Avatar placeholder matching screenshot */}
            <User size={20} className="text-[#b45309]" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-ink">{profileName}</span>
            <div className="flex text-xs font-medium text-ink-soft mt-0.5 space-x-1">
              <Link href="/profile" className="hover:text-ink">Profile</Link>
              <span>·</span>
              <Link href="/settings" className="hover:text-ink">Settings</Link>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

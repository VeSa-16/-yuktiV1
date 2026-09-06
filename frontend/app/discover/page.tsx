"use client";
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Coffee, ShoppingBag, Truck, Wrench, Package, Monitor, Search, Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { api } from '@/lib/api-client';

const categories = [
  { id: 'food', name: 'Food & Processing', icon: Coffee, color: 'text-amber-600', bg: 'bg-amber-100' },
  { id: 'retail', name: 'Local Retail', icon: ShoppingBag, color: 'text-emerald-600', bg: 'bg-emerald-100' },
  { id: 'transport', name: 'Transport', icon: Truck, color: 'text-blue-600', bg: 'bg-blue-100' },
  { id: 'services', name: 'Services', icon: Monitor, color: 'text-purple-600', bg: 'bg-purple-100' },
  { id: 'manufacturing', name: 'Manufacturing', icon: Package, color: 'text-red-600', bg: 'bg-red-100' },
  { id: 'repair', name: 'Repair & Maint.', icon: Wrench, color: 'text-stone-600', bg: 'bg-stone-100' },
];

export default function DiscoverPage() {
  const router = useRouter();
  const { locationId, locationName, marginCapital, updateState } = useStore();
  const [isSearching, setIsSearching] = useState(false);

  const handleLetYuktiFind = async () => {
    setIsSearching(true);
    // Simulate finding opportunities based on profile
    setTimeout(() => {
      updateState({
        opportunities: [
          { category_id: "food_processing", category_name: "Food Processing", score: 87, rationale: "High demand • Moderate competition • Strong capital fit" },
          { category_id: "mobile_repair", category_name: "Mobile Repair", score: 82, rationale: "Low starting capital • High local demand" },
          { category_id: "local_retail", category_name: "Local Retail", score: 76, rationale: "Steady cashflow • Known market dynamics" }
        ]
      });
      router.push('/results'); // We'll route them to a specific results view, or just show it inline
    }, 1500);
  };

  const handleCategorySelect = (catName: string, catId: string) => {
    updateState({ categoryName: catName, categoryId: catId });
    router.push(`/score/${catId}`); // Jump straight to score/analysis if they pick manually
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 text-warm-text animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Discover a Business</h1>
        <p className="text-warm-muted mt-2 text-lg">What are you interested in starting?</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
        {categories.map((cat) => (
          <button 
            key={cat.id} 
            onClick={() => handleCategorySelect(cat.name, cat.id)}
            className="flex flex-col items-center justify-center p-6 bg-warm-surface border border-warm-border rounded-2xl hover:border-warm-primary hover:shadow-md transition-all group"
          >
            <div className={`p-4 rounded-xl ${cat.bg} mb-4 group-hover:scale-110 transition-transform`}>
              <cat.icon size={32} className={cat.color} />
            </div>
            <span className="font-semibold text-warm-text">{cat.name}</span>
          </button>
        ))}
        <button className="flex flex-col items-center justify-center p-6 bg-warm-bg/50 border border-dashed border-warm-border rounded-2xl hover:bg-warm-border/30 transition-all text-warm-muted hover:text-warm-text">
          <Search size={32} className="mb-4" />
          <span className="font-medium">Other</span>
        </button>
      </div>

      <div className="relative flex py-5 items-center">
        <div className="flex-grow border-t border-warm-border"></div>
        <span className="flex-shrink-0 mx-4 text-warm-muted font-medium text-sm uppercase tracking-widest">OR</span>
        <div className="flex-grow border-t border-warm-border"></div>
      </div>

      <div className="mt-8">
        <Card className="bg-warm-primary/5 border-warm-primary/20 overflow-hidden">
          <div className="p-8 md:flex items-center justify-between">
            <div className="mb-6 md:mb-0 md:mr-8">
              <h3 className="text-2xl font-bold text-warm-text flex items-center mb-2">
                <Sparkles size={24} className="text-warm-primary mr-2" />
                Let Yukti find opportunities for me
              </h3>
              <p className="text-warm-muted">
                Our AI analyzes local market demand, competitor density, and your available capital to recommend the highest-potential businesses.
              </p>
              
              <div className="flex flex-wrap gap-2 mt-4 font-mono">
                <span className="px-3 py-1 bg-black border border-zinc-800 text-xs font-bold text-zinc-500 uppercase tracking-widest">Location: {locationName || 'Pending'}</span>
                <span className="px-3 py-1 bg-black border border-zinc-800 text-xs font-bold text-zinc-500 uppercase tracking-widest">Capital: ₹{marginCapital ? marginCapital.toLocaleString('en-IN') : 'Pending'}</span>
              </div>
            </div>
            
            <button 
              onClick={handleLetYuktiFind}
              disabled={isSearching}
              className="w-full md:w-auto flex-shrink-0 bg-warm-primary hover:bg-warm-primary/90 text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center transition-all hover:shadow-lg hover:shadow-warm-primary/30 disabled:opacity-70"
            >
              {isSearching ? <Loader2 className="animate-spin mr-2" size={24} /> : null}
              {isSearching ? 'Analyzing Market...' : 'Find Matches'}
              {!isSearching && <ArrowRight size={24} className="ml-2" />}
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}

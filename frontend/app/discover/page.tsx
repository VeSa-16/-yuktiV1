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
    <div className="max-w-5xl mx-auto p-4 md:p-8 text-warm-text animate-in fade-in duration-500 font-sans">
      <div className="mb-8 text-center md:text-left">
        <h1 className="text-3xl font-bold tracking-tight">Discover a Business</h1>
        <p className="text-warm-muted mt-2 text-lg font-medium">What are you interested in starting?</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-12">
        {categories.map((cat) => (
          <button 
            key={cat.id} 
            onClick={() => handleCategorySelect(cat.name, cat.id)}
            className="flex flex-col items-center justify-center p-6 bg-warm-surface border border-warm-border rounded-2xl hover:border-warm-primary hover:shadow-lg transition-all group shadow-sm"
          >
            <div className={`p-4 rounded-full ${cat.bg} mb-4 group-hover:scale-110 transition-transform`}>
              <cat.icon size={32} className={cat.color} />
            </div>
            <span className="font-bold text-warm-text text-center">{cat.name}</span>
          </button>
        ))}
        <button className="flex flex-col items-center justify-center p-6 bg-warm-bg border-2 border-dashed border-warm-border rounded-2xl hover:bg-warm-hover transition-all text-warm-muted hover:text-warm-text group">
          <div className="p-4 rounded-full bg-warm-border/30 mb-4 group-hover:scale-110 transition-transform">
            <Search size={32} className="text-warm-muted group-hover:text-warm-text" />
          </div>
          <span className="font-bold text-center">Other</span>
        </button>
      </div>

      <div className="relative flex py-5 items-center">
        <div className="flex-grow border-t border-warm-border"></div>
        <span className="flex-shrink-0 mx-4 text-warm-muted font-bold text-sm uppercase tracking-wider bg-warm-bg px-2 rounded-full">OR</span>
        <div className="flex-grow border-t border-warm-border"></div>
      </div>

      <div className="mt-8">
        <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200 overflow-hidden shadow-md rounded-2xl">
          <div className="p-8 md:flex items-center justify-between">
            <div className="mb-6 md:mb-0 md:mr-8">
              <h3 className="text-2xl font-bold text-warm-text flex items-center mb-3">
                <Sparkles size={24} className="text-warm-primary mr-2" />
                Let YUKTI find opportunities for me
              </h3>
              <p className="text-warm-text/80 font-medium leading-relaxed max-w-2xl">
                Our smart system analyzes local market demand, competitor density, and your available capital to recommend the most profitable businesses for you.
              </p>
              
              <div className="flex flex-wrap gap-3 mt-6">
                <span className="px-4 py-2 bg-white rounded-lg border border-orange-200 text-sm font-bold text-warm-text shadow-sm flex items-center">
                  <span className="text-warm-primary mr-2">📍 Location:</span> {locationName || 'Pending'}
                </span>
                <span className="px-4 py-2 bg-white rounded-lg border border-orange-200 text-sm font-bold text-warm-text shadow-sm flex items-center">
                  <span className="text-warm-primary mr-2">💰 Capital:</span> ₹{marginCapital ? marginCapital.toLocaleString('en-IN') : 'Pending'}
                </span>
              </div>
            </div>
            
            <button 
              onClick={handleLetYuktiFind}
              disabled={isSearching}
              className="w-full md:w-auto flex-shrink-0 bg-warm-primary hover:bg-orange-600 text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center transition-all hover:shadow-lg disabled:opacity-70"
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

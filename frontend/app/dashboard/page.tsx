"use client";
import React from 'react';
import { useStore } from '@/lib/store';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, Circle, ArrowRight, TrendingUp, Target, Shield, Compass, FileText } from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  const { profileName, locationName, marginCapital, categoryName, savedPlans } = useStore();

  const journeySteps = [
    { name: 'Profile', completed: true },
    { name: 'Location', completed: !!locationName },
    { name: 'Capital', completed: !!marginCapital },
    { name: 'Business Analysis', completed: !!categoryName },
    { name: 'Financial Plan', completed: (savedPlans || []).length > 0 },
    { name: 'Business Plan', completed: false }
  ];

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-500 text-warm-text">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Good morning, {profileName} 👋</h1>
        <p className="text-warm-muted mt-2 text-lg">Let's build your next business decision.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Journey & Quick Actions */}
        <div className="lg:col-span-1 space-y-8">
          
          <Card className="bg-warm-surface border-warm-border shadow-sm rounded-xl overflow-hidden">
            <div className="p-4 border-b border-warm-border bg-warm-bg/50">
              <h3 className="font-semibold text-sm uppercase tracking-wider text-warm-muted">Your Business Journey</h3>
            </div>
            <CardContent className="p-0">
              <ul className="divide-y divide-warm-border">
                {journeySteps.map((step, idx) => (
                  <li key={idx} className="flex items-center justify-between p-4 hover:bg-warm-bg/50 transition-colors">
                    <span className={`text-sm font-medium ${step.completed ? 'text-warm-text' : 'text-warm-muted'}`}>
                      {step.name}
                    </span>
                    {step.completed ? (
                      <CheckCircle2 size={18} className="text-emerald-500" />
                    ) : (
                      <Circle size={18} className="text-warm-border" />
                    )}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <div className="space-y-3">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-warm-muted ml-1">Quick Actions</h3>
            <Link href="/discover" className="flex items-center p-3 bg-warm-surface border border-warm-border rounded-xl hover:border-warm-primary hover:shadow-md transition-all group">
              <div className="bg-warm-primary/10 p-2 rounded-lg mr-3 group-hover:bg-warm-primary/20 transition-colors">
                <Compass size={18} className="text-warm-primary" />
              </div>
              <span className="font-medium text-sm flex-1">Explore Opportunities</span>
              <ArrowRight size={16} className="text-warm-muted group-hover:text-warm-primary transition-colors" />
            </Link>
            <Link href="/plans" className="flex items-center p-3 bg-warm-surface border border-warm-border rounded-xl hover:border-warm-secondary hover:shadow-md transition-all group">
              <div className="bg-warm-secondary/10 p-2 rounded-lg mr-3 group-hover:bg-warm-secondary/20 transition-colors">
                <FileText size={18} className="text-warm-secondary" />
              </div>
              <span className="font-medium text-sm flex-1">My Business Plans</span>
              <ArrowRight size={16} className="text-warm-muted group-hover:text-warm-secondary transition-colors" />
            </Link>
          </div>

        </div>

        {/* Right Column: Current Plan Overview */}
        <div className="lg:col-span-2">
          {categoryName ? (
            <Card className="bg-warm-surface border-warm-border shadow-sm rounded-xl overflow-hidden h-full">
              <div className="p-6 border-b border-warm-border flex justify-between items-start">
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-warm-primary mb-1">Your Current Plan</h3>
                  <h2 className="text-2xl font-bold">{categoryName}</h2>
                  <p className="text-warm-muted text-sm flex items-center mt-1">
                    <Target size={14} className="mr-1" /> {locationName}
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black text-emerald-600">84</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-warm-muted mt-1">YUKTI SCORE</div>
                </div>
              </div>
              
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                    <div className="flex items-center text-emerald-600 mb-2">
                      <TrendingUp size={16} className="mr-2" />
                      <span className="text-xs font-bold uppercase tracking-wider">Financials</span>
                    </div>
                    <span className="font-semibold text-emerald-900">Strong Readiness</span>
                  </div>
                  
                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <div className="flex items-center text-blue-600 mb-2">
                      <Target size={16} className="mr-2" />
                      <span className="text-xs font-bold uppercase tracking-wider">Market</span>
                    </div>
                    <span className="font-semibold text-blue-900">High Opportunity</span>
                  </div>
                  
                  <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                    <div className="flex items-center text-amber-600 mb-2">
                      <Shield size={16} className="mr-2" />
                      <span className="text-xs font-bold uppercase tracking-wider">Risk</span>
                    </div>
                    <span className="font-semibold text-amber-900">Moderate</span>
                  </div>
                </div>

                <div className="flex space-x-3 pt-4 border-t border-warm-border">
                  <Link href={`/score/${categoryName.toLowerCase().replace(/\s+/g, '-')}`} className="flex-1 text-center bg-warm-primary text-white py-3 rounded-lg font-medium hover:bg-warm-primary/90 transition-colors">
                    Continue Planning
                  </Link>
                  <Link href={`/category/${categoryName.toLowerCase().replace(/\s+/g, '-')}`} className="flex-1 text-center bg-warm-bg text-warm-text py-3 rounded-lg font-medium border border-warm-border hover:bg-warm-border/50 transition-colors">
                    View Market Map
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-warm-surface border-warm-border shadow-sm rounded-xl h-full flex flex-col items-center justify-center p-12 text-center">
              <div className="w-16 h-16 bg-warm-bg rounded-full flex items-center justify-center mb-4">
                <Compass size={32} className="text-warm-muted" />
              </div>
              <h2 className="text-xl font-bold mb-2">No Active Plan</h2>
              <p className="text-warm-muted mb-6 max-w-sm">You haven't started planning a specific business yet. Explore opportunities to get started.</p>
              <Link href="/discover" className="bg-warm-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-warm-primary/90 transition-colors">
                Discover Opportunities
              </Link>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";
import React from 'react';
import { useStore } from '@/lib/store';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, CheckCircle2, Circle, ArrowRight, Flag, Rocket, Search } from 'lucide-react';
import Link from 'next/link';
import { ProgressStepper } from '@/components/ProgressStepper';

export default function ActionPlanPage() {
  const { categoryName, locationName } = useStore();

  const phases = [
    {
      title: "Validate",
      days: "DAYS 1–30",
      icon: Search,
      color: "text-warm-secondary",
      bg: "bg-warm-secondary/10",
      border: "border-warm-secondary/20",
      tasks: [
        { name: "Validate local demand in " + (locationName || "target area"), done: true },
        { name: "Identify 3 potential suppliers", done: false },
        { name: "Check competitor pricing strategies", done: false },
        { name: "Finalize exact business location", done: false }
      ]
    },
    {
      title: "Prepare",
      days: "DAYS 31–60",
      icon: Flag,
      color: "text-amber-600",
      bg: "bg-amber-100",
      border: "border-amber-200",
      tasks: [
        { name: "Purchase primary equipment", done: false },
        { name: "Set up basic operations", done: false },
        { name: "Finalize supplier contracts", done: false },
        { name: "Prepare compliance documentation", done: false }
      ]
    },
    {
      title: "Launch",
      days: "DAYS 61–90",
      icon: Rocket,
      color: "text-emerald-600",
      bg: "bg-emerald-100",
      border: "border-emerald-200",
      tasks: [
        { name: "Start initial operations", done: false },
        { name: "Acquire first 10 customers", done: false },
        { name: "Track daily revenue", done: false },
        { name: "Monitor operating expenses", done: false }
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 text-warm-text animate-in fade-in duration-500">
      <ProgressStepper />
      
      <div className="mb-10 mt-6 border-b border-warm-border pb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your 90-Day Roadmap</h1>
          <p className="text-warm-muted mt-2 text-lg flex items-center">
            <Calendar size={18} className="mr-2" /> Action plan for {categoryName || "your business"}
          </p>
        </div>
        <Link href="/report" className="hidden sm:flex items-center px-4 py-2 bg-warm-primary hover:bg-warm-primary/90 text-white rounded-lg font-medium transition-colors shadow-sm">
          Generate Full Report <ArrowRight size={16} className="ml-2" />
        </Link>
      </div>

      <div className="relative border-l-2 border-warm-border ml-4 md:ml-6 space-y-12 pb-12">
        {phases.map((phase, idx) => (
          <div key={idx} className="relative pl-8 md:pl-12">
            {/* Timeline Node */}
            <div className={`absolute -left-[21px] top-1 w-10 h-10 rounded-full bg-white border-4 border-warm-bg flex items-center justify-center shadow-sm`}>
              <div className={`w-8 h-8 rounded-full ${phase.bg} flex items-center justify-center`}>
                <phase.icon size={14} className={phase.color} />
              </div>
            </div>
            
            <div className="mb-4">
              <span className={`text-xs font-bold uppercase tracking-wider ${phase.color} bg-white px-3 py-1 rounded-full border ${phase.border} shadow-sm inline-block mb-2`}>
                {phase.days}
              </span>
              <h2 className="text-2xl font-bold">{phase.title} Phase</h2>
            </div>
            
            <Card className="bg-white border-warm-border shadow-sm rounded-xl overflow-hidden">
              <CardContent className="p-0">
                <ul className="divide-y divide-warm-border">
                  {phase.tasks.map((task, tIdx) => (
                    <li key={tIdx} className="flex items-center p-4 hover:bg-warm-bg/50 transition-colors group cursor-pointer">
                      {task.done ? (
                        <CheckCircle2 size={20} className="text-emerald-500 flex-shrink-0 mr-4" />
                      ) : (
                        <Circle size={20} className="text-warm-border group-hover:text-warm-primary flex-shrink-0 mr-4 transition-colors" />
                      )}
                      <span className={`font-medium ${task.done ? 'text-warm-muted line-through' : 'text-warm-text'}`}>
                        {task.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
      
      <div className="sm:hidden mt-8">
        <Link href="/report" className="w-full flex items-center justify-center px-4 py-3 bg-warm-primary hover:bg-warm-primary/90 text-white rounded-xl font-bold transition-colors shadow-sm">
          Generate Full Report <ArrowRight size={18} className="ml-2" />
        </Link>
      </div>
    </div>
  );
}

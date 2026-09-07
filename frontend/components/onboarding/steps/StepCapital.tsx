import React from 'react';
import { ChevronLeft, ArrowRight, Wallet } from 'lucide-react';

export interface CapitalData {
  investment: string;
  source: string;
}

interface StepCapitalProps {
  data: CapitalData;
  updateData: (updates: Partial<CapitalData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function StepCapital({ data, updateData, onNext, onBack }: StepCapitalProps) {
  return (
    <div className="flex flex-col h-full bg-white rounded-3xl p-6 sm:p-8 border border-premium-border shadow-card relative">
      <div className="flex-1">
        <h2 className="text-[28px] font-bold text-forest-deep mb-2 font-display">Capital & Investment</h2>
        <p className="text-ink-soft text-sm font-medium mb-8">
          Knowing your budget helps us recommend businesses you can actually start and sustain.
        </p>

        <div className="space-y-6">
          {/* Investment Amount */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-ink flex items-center">
              How much capital can you invest? <span className="text-[#ea580c] ml-1">*</span>
            </label>
            <div className="flex flex-wrap gap-3">
              {['Under ₹50,000', '₹50,000 - ₹1L', '₹1L - ₹3L', '₹3L - ₹5L', 'Above ₹5L'].map(option => (
                <label key={option} className={`flex items-center px-4 py-3 rounded-xl border cursor-pointer transition-colors ${data.investment === option ? 'border-forest bg-forest-tint/30 text-forest-deep font-bold' : 'border-premium-border hover:bg-cream text-ink font-medium'}`}>
                  <input 
                    type="radio" 
                    name="investment" 
                    value={option}
                    className="mr-3 w-4 h-4 accent-forest"
                    checked={data.investment === option}
                    onChange={() => updateData({ investment: option })}
                  />
                  <span className="text-sm">{option}</span>
                </label>
              ))}
            </div>
          </div>
          
          {/* Primary Source */}
          <div className="space-y-2 pt-4">
            <label className="text-sm font-bold text-ink flex items-center">
              Primary source of capital <span className="text-[#ea580c] ml-1">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { id: 'Savings', desc: 'Personal or family savings' },
                { id: 'Bank Loan', desc: 'Planning to apply for a loan' },
                { id: 'Govt Scheme', desc: 'Mudra, PMEGP, etc.' },
                { id: 'Friends/Relatives', desc: 'Borrowing from network' },
              ].map(src => (
                <label key={src.id} className={`flex flex-col px-4 py-3 rounded-xl border cursor-pointer transition-colors ${data.source === src.id ? 'border-forest bg-forest-tint/30 text-forest-deep font-bold' : 'border-premium-border hover:bg-cream text-ink'}`}>
                  <div className="flex items-center">
                    <input 
                      type="radio" 
                      name="source" 
                      value={src.id}
                      className="mr-3 w-4 h-4 accent-forest"
                      checked={data.source === src.id}
                      onChange={() => updateData({ source: src.id })}
                    />
                    <span className="text-sm font-bold">{src.id}</span>
                  </div>
                  <span className="text-xs text-ink-soft ml-7 mt-1">{src.desc}</span>
                </label>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Footer Nav */}
      <div className="flex items-center justify-between mt-10 pt-6 border-t border-premium-border">
        <button 
          onClick={onBack}
          className="flex items-center text-ink-soft hover:text-ink font-bold text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron rounded px-2 py-1"
        >
          <ChevronLeft size={18} className="mr-1" /> Back
        </button>
        
        <button 
          onClick={onNext}
          className="bg-[#ea580c] hover:bg-[#c2410c] text-white px-8 py-3.5 rounded-xl text-sm font-bold flex items-center justify-center shadow-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-saffron"
        >
          Next: Business <ArrowRight size={18} className="ml-2" />
        </button>
      </div>
    </div>
  );
}

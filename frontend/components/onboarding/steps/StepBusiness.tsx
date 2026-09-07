import React from 'react';
import { ChevronLeft, ArrowRight, Store, Wrench, Tractor, Laptop } from 'lucide-react';

export interface BusinessData {
  industry: string;
  experience: string;
}

interface StepBusinessProps {
  data: BusinessData;
  updateData: (updates: Partial<BusinessData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function StepBusiness({ data, updateData, onNext, onBack }: StepBusinessProps) {
  return (
    <div className="flex flex-col h-full bg-white rounded-3xl p-6 sm:p-8 border border-premium-border shadow-card relative">
      <div className="flex-1">
        <h2 className="text-[28px] font-bold text-forest-deep mb-2 font-display">Business Interests</h2>
        <p className="text-ink-soft text-sm font-medium mb-8">
          What kind of business are you looking to start? We'll match this with local market demand.
        </p>

        <div className="space-y-6">
          
          <div className="space-y-2">
            <label className="text-sm font-bold text-ink flex items-center">
              Area of Interest <span className="text-[#ea580c] ml-1">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'Retail & Shop', icon: Store },
                { id: 'Manufacturing', icon: Wrench },
                { id: 'Agri-Business', icon: Tractor },
                { id: 'Services & Tech', icon: Laptop },
              ].map(ind => {
                const Icon = ind.icon;
                const isSelected = data.industry === ind.id;
                return (
                  <button
                    key={ind.id}
                    onClick={() => updateData({ industry: ind.id })}
                    className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all ${
                      isSelected 
                        ? 'border-forest bg-forest-tint/30 ring-1 ring-forest' 
                        : 'border-premium-border hover:border-forest/50 bg-white'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${isSelected ? 'bg-forest text-white' : 'bg-cream text-ink-soft'}`}>
                      <Icon size={20} />
                    </div>
                    <span className={`text-sm font-bold ${isSelected ? 'text-forest-deep' : 'text-ink'}`}>{ind.id}</span>
                  </button>
                )
              })}
            </div>
          </div>
          
          <div className="space-y-2 pt-4">
            <label className="text-sm font-bold text-ink flex items-center">
              Prior Experience in this field <span className="text-[#ea580c] ml-1">*</span>
            </label>
            <div className="flex flex-wrap gap-3">
              {['None, I am a beginner', '1-3 Years', '3-5 Years', '5+ Years'].map(option => (
                <label key={option} className={`flex items-center px-4 py-3 rounded-xl border cursor-pointer transition-colors ${data.experience === option ? 'border-forest bg-forest-tint/30 text-forest-deep font-bold' : 'border-premium-border hover:bg-cream text-ink font-medium'}`}>
                  <input 
                    type="radio" 
                    name="experience" 
                    value={option}
                    className="mr-3 w-4 h-4 accent-forest"
                    checked={data.experience === option}
                    onChange={() => updateData({ experience: option })}
                  />
                  <span className="text-sm">{option}</span>
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
          Next: Review <ArrowRight size={18} className="ml-2" />
        </button>
      </div>
    </div>
  );
}

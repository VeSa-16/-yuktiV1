import React from 'react';
import { ChevronLeft, ArrowRight, MapPin } from 'lucide-react';

export interface LocationData {
  state: string;
  district: string;
  village: string;
}

interface StepLocationProps {
  data: LocationData;
  updateData: (updates: Partial<LocationData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function StepLocation({ data, updateData, onNext, onBack }: StepLocationProps) {
  return (
    <div className="flex flex-col h-full bg-white rounded-3xl p-6 sm:p-8 border border-premium-border shadow-card relative">
      <div className="flex-1">
        <h2 className="text-[28px] font-bold text-forest-deep mb-2 font-display">Where are you located?</h2>
        <p className="text-ink-soft text-sm font-medium mb-8">
          Business viability changes dramatically based on your location. Tell us where you plan to start.
        </p>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-ink flex items-center">
              State <span className="text-[#ea580c] ml-1">*</span>
            </label>
            <select 
              className="w-full rounded-xl border border-premium-border px-4 py-3 text-ink focus:outline-none focus:ring-2 focus:ring-forest focus:border-forest transition-all bg-white"
              value={data.state}
              onChange={(e) => updateData({ state: e.target.value })}
            >
              <option value="">Select State</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Gujarat">Gujarat</option>
              <option value="Karnataka">Karnataka</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-bold text-ink flex items-center">
              District <span className="text-[#ea580c] ml-1">*</span>
            </label>
            <select 
              className="w-full rounded-xl border border-premium-border px-4 py-3 text-ink focus:outline-none focus:ring-2 focus:ring-forest focus:border-forest transition-all bg-white"
              value={data.district}
              onChange={(e) => updateData({ district: e.target.value })}
            >
              <option value="">Select District</option>
              <option value="Solapur">Solapur</option>
              <option value="Pune">Pune</option>
              <option value="Nashik">Nashik</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-ink flex items-center">
              Village / Taluka <span className="text-ink-faint font-normal ml-2">(Optional)</span>
            </label>
            <div className="relative">
              <input 
                type="text"
                placeholder="Enter your village or taluka"
                className="w-full rounded-xl border border-premium-border px-4 py-3 text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-forest focus:border-forest transition-all"
                value={data.village}
                onChange={(e) => updateData({ village: e.target.value })}
              />
              <MapPin className="absolute right-3 top-3.5 text-ink-soft" size={18} />
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
          Next: Capital <ArrowRight size={18} className="ml-2" />
        </button>
      </div>
    </div>
  );
}

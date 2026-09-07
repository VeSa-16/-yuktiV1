import React from 'react';
import { ChevronLeft, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { AboutYouData } from './StepAboutYou';
import { LocationData } from './StepLocation';
import { CapitalData } from './StepCapital';
import { BusinessData } from './StepBusiness';

interface StepReviewProps {
  data: {
    about: AboutYouData;
    location: LocationData;
    capital: CapitalData;
    business: BusinessData;
  };
  onNext: () => void;
  onBack: () => void;
  isSubmitting: boolean;
}

export function StepReview({ data, onNext, onBack, isSubmitting }: StepReviewProps) {
  return (
    <div className="flex flex-col h-full bg-white rounded-3xl p-6 sm:p-8 border border-premium-border shadow-card relative">
      <div className="flex-1">
        <h2 className="text-[28px] font-bold text-forest-deep mb-2 font-display">Review your details</h2>
        <p className="text-ink-soft text-sm font-medium mb-8">
          Make sure everything looks correct before we generate your personalized YUKTI dashboard.
        </p>

        <div className="space-y-4">
          <div className="bg-cream-deep p-4 rounded-2xl border border-premium-border">
            <h4 className="text-xs font-bold uppercase tracking-wider text-ink-faint mb-3">Personal Profile</h4>
            <div className="grid grid-cols-2 gap-y-2 text-sm">
              <span className="text-ink-soft">Name:</span>
              <span className="font-bold text-ink">{data.about.fullName || '-'}</span>
              <span className="text-ink-soft">Age:</span>
              <span className="font-bold text-ink">{data.about.age || '-'}</span>
              <span className="text-ink-soft">Category:</span>
              <span className="font-bold text-ink">{data.about.category || '-'}</span>
            </div>
          </div>

          <div className="bg-cream-deep p-4 rounded-2xl border border-premium-border">
            <h4 className="text-xs font-bold uppercase tracking-wider text-ink-faint mb-3">Location & Capital</h4>
            <div className="grid grid-cols-2 gap-y-2 text-sm">
              <span className="text-ink-soft">District:</span>
              <span className="font-bold text-ink">{data.location.district || '-'}, {data.location.state || '-'}</span>
              <span className="text-ink-soft">Investment:</span>
              <span className="font-bold text-ink">{data.capital.investment || '-'}</span>
              <span className="text-ink-soft">Interest:</span>
              <span className="font-bold text-ink">{data.business.industry || '-'}</span>
            </div>
          </div>
          
          <div className="flex items-start p-4 bg-forest-tint/30 rounded-2xl border border-forest/20 mt-4">
            <CheckCircle2 size={20} className="text-forest mt-0.5 mr-3 shrink-0" />
            <p className="text-sm text-forest-deep font-medium leading-relaxed">
              By submitting this profile, you agree to let YUKTI process this data to provide business insights and recommendations.
            </p>
          </div>
        </div>
      </div>

      {/* Footer Nav */}
      <div className="flex items-center justify-between mt-10 pt-6 border-t border-premium-border">
        <button 
          onClick={onBack}
          disabled={isSubmitting}
          className="flex items-center text-ink-soft hover:text-ink font-bold text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron rounded px-2 py-1 disabled:opacity-50"
        >
          <ChevronLeft size={18} className="mr-1" /> Back
        </button>
        
        <button 
          onClick={onNext}
          disabled={isSubmitting}
          className="bg-forest hover:bg-forest-deep text-white px-8 py-3.5 rounded-xl text-sm font-bold flex items-center justify-center shadow-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-forest disabled:opacity-70"
        >
          {isSubmitting ? (
            <><Loader2 className="animate-spin mr-2" size={18} /> Processing...</>
          ) : (
            <>Generate My Dashboard <ArrowRight size={18} className="ml-2" /></>
          )}
        </button>
      </div>
    </div>
  );
}

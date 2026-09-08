"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { api } from "@/lib/api-client";
import { Loader2, ArrowRight, MapPin, GraduationCap, User, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { HeroSection } from "@/components/hero/HeroSection";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";

export default function LandingPage() {
  const router = useRouter();
  const { updateState } = useStore();
  const [loading, setLoading] = useState(false);
  const [selectedPath, setSelectedPath] = useState<'none' | 'entrepreneur' | 'advisor'>('none');
  const [profileError, setProfileError] = useState("");
  
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    education: "10th",
    location: "Solapur, Maharashtra"
  });

  const handleEntrepreneurComplete = async (onboardingData: any) => {
    setLoading(true);
    setProfileError("");
    try {
      const res = await api.createProfile({
        name: onboardingData.fullName || "Entrepreneur",
        location_input: `${onboardingData.village ? onboardingData.village + ', ' : ''}${onboardingData.district}, ${onboardingData.state}`,
        language: "en"
      });
      
      const mapIndustry = (industry: string) => {
        const lower = industry.toLowerCase();
        if (lower.includes("retail") || lower.includes("kirana")) return "retail_kirana";
        if (lower.includes("dairy") || lower.includes("milk")) return "dairy";
        if (lower.includes("tailor") || lower.includes("boutique")) return "tailoring";
        if (lower.includes("flour") || lower.includes("mill")) return "flour_mill";
        if (lower.includes("poultry") || lower.includes("chicken")) return "poultry";
        return industry.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '') || "custom_business";
      };

      updateState({
        sessionId: res.user_id,
        locationId: res.location_id,
        locationName: res.location_name,
        profileName: onboardingData.fullName || "Entrepreneur",
        userMode: 'entrepreneur',
        marginCapital: parseInt(onboardingData.investment) || 50000,
        categoryId: mapIndustry(onboardingData.industry),
        categoryName: onboardingData.industry || "Retail / Kirana Store",
        experience: onboardingData.experience || "None, I am a beginner",
        ideaDetails: onboardingData.ideaDetails || ""
      });
      
      router.push("/dashboard");
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Failed to create profile. Please try again.";
      setProfileError(msg);
      // In a real app, you might show this error in the flow, but here we'll alert or fallback.
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleAdvisorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      updateState({
        profileName: "Gov. Officer ID-892",
        userMode: 'advisor'
      });
      router.push("/advisor/analytics");
    }, 800);
  };

  if (selectedPath === 'none') {
    return <HeroSection onStartEntrepreneur={() => setSelectedPath('entrepreneur')} onStartAdvisor={() => setSelectedPath('advisor')} />;
  }

  // Auth / Form Mode
  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-4 font-sans relative overflow-hidden">
      {/* Decorative Background for Auth screens */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-saffron blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-forest blur-3xl opacity-10"></div>
      </div>

      <AnimatePresence mode="wait">
        {selectedPath === 'entrepreneur' && (
          <motion.div 
            key="entrepreneur-onboarding"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-[#fcfbf8] overflow-y-auto"
          >
            <OnboardingFlow 
              onCancel={() => setSelectedPath('none')}
              onComplete={handleEntrepreneurComplete}
            />
          </motion.div>
        )}

        {selectedPath === 'advisor' && (
          <motion.div 
            key="advisor-form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md z-10"
          >
            <div className="mb-6 flex justify-between items-center">
              <h2 className="font-display text-3xl font-bold text-ink">Institutional Login</h2>
              <button onClick={() => setSelectedPath('none')} className="text-sm font-bold text-ink-soft hover:text-forest transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest rounded">
                ← Go Back
              </button>
            </div>
            
            <div className="bg-white p-8 rounded-3xl border border-premium-border shadow-card">
              <div className="flex justify-center mb-8">
                <div className="w-20 h-20 bg-cream rounded-full flex items-center justify-center border border-premium-border shadow-sm">
                  <Lock size={32} className="text-forest" />
                </div>
              </div>
              <form onSubmit={handleAdvisorSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-ink">Officer ID</label>
                  <input 
                    type="text"
                    className="w-full rounded-xl border border-premium-border bg-cream-deep px-4 py-3 text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-forest focus:border-forest transition-all font-medium"
                    placeholder="GOV-ID-..."
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-ink">Security Code</label>
                  <input 
                    type="password"
                    className="w-full rounded-xl border border-premium-border bg-cream-deep px-4 py-3 text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-forest focus:border-forest transition-all font-medium"
                    placeholder="••••••••"
                    required
                  />
                </div>
                
                <button 
                  type="submit" 
                  className="w-full py-4 rounded-full bg-forest hover:bg-forest-deep text-white font-bold text-base flex items-center justify-center transition-all disabled:opacity-70 shadow-card hover:shadow-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest" 
                  disabled={loading}
                >
                  {loading ? <Loader2 className="animate-spin mr-2" size={20} /> : null}
                  Authenticate & Enter
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

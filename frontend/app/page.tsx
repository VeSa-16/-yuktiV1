"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { api } from "@/lib/api-client";
import { Loader2, ArrowRight, MapPin, GraduationCap, User, Briefcase, Lock, Sprout } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function LandingPage() {
  const router = useRouter();
  const { updateState } = useStore();
  const [loading, setLoading] = useState(false);
  const [selectedPath, setSelectedPath] = useState<'none' | 'entrepreneur' | 'advisor'>('none');
  
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    education: "10th",
    location: "Solapur, Maharashtra"
  });

  const handleEntrepreneurSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.createProfile({
        name: formData.name,
        location_input: formData.location,
        language: "en"
      });
      
      updateState({
        sessionId: res.user_id,
        locationId: res.location_id,
        locationName: res.location_name,
        profileName: formData.name,
        userMode: 'entrepreneur'
      });
      
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdvisorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Mock advisor login
    setTimeout(() => {
      updateState({
        profileName: "Gov. Officer ID-892",
        userMode: 'advisor'
      });
      router.push("/advisor/analytics");
    }, 800);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 min-h-screen relative overflow-hidden bg-warm-bg font-sans">
      {/* Soft Background Accent */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-40 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-warm-primary blur-3xl opacity-20"></div>
        <div className="absolute top-1/2 right-0 w-[500px] h-[500px] rounded-full bg-warm-secondary blur-3xl opacity-10 transform translate-x-1/2 -translate-y-1/2"></div>
      </div>

      <AnimatePresence mode="wait">
        {selectedPath === 'none' && (
          <motion.div 
            key="selection"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-4xl z-10 text-center"
          >
            <div className="mb-12">
              <h1 className="text-5xl md:text-6xl font-extrabold text-warm-text mb-4 flex items-center justify-center gap-4">
                <Sprout className="text-warm-secondary" size={48} />
                YUKTI
              </h1>
              <p className="text-lg text-warm-muted font-medium">Empowering rural enterprise with smart, accessible guidance.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Entrepreneur Door */}
              <button 
                onClick={() => setSelectedPath('entrepreneur')}
                className="group relative bg-warm-surface border border-warm-border p-10 rounded-3xl shadow-sm hover:shadow-xl hover:border-warm-primary transition-all text-left overflow-hidden"
              >
                <div className="absolute inset-0 bg-warm-primary opacity-0 group-hover:opacity-5 transition-opacity"></div>
                <div className="w-16 h-16 bg-warm-bg border border-warm-border rounded-full flex items-center justify-center mb-6 text-warm-primary group-hover:scale-110 transition-transform shadow-sm">
                  <User size={32} />
                </div>
                <h2 className="text-2xl font-bold text-warm-text mb-2">Entrepreneur</h2>
                <p className="text-warm-muted text-sm leading-relaxed font-medium">
                  I want to discover viable business opportunities, plan my finances, and build a project report to get a loan.
                </p>
                <div className="mt-8 flex items-center text-warm-primary font-bold text-sm">
                  Start My Journey <ArrowRight size={20} className="ml-2 group-hover:translate-x-2 transition-transform" />
                </div>
              </button>

              {/* Advisor Door */}
              <button 
                onClick={() => setSelectedPath('advisor')}
                className="group relative bg-warm-surface border border-warm-border p-10 rounded-3xl shadow-sm hover:shadow-xl hover:border-warm-secondary transition-all text-left overflow-hidden"
              >
                <div className="absolute inset-0 bg-warm-secondary opacity-0 group-hover:opacity-5 transition-opacity"></div>
                <div className="w-16 h-16 bg-warm-bg border border-warm-border rounded-full flex items-center justify-center mb-6 text-warm-secondary group-hover:scale-110 transition-transform shadow-sm">
                  <Briefcase size={32} />
                </div>
                <h2 className="text-2xl font-bold text-warm-text mb-2">Institutional Advisor</h2>
                <p className="text-warm-muted text-sm leading-relaxed font-medium">
                  I want to monitor regional macro-trends, review incoming business plans, and execute risk assessments.
                </p>
                <div className="mt-8 flex items-center text-warm-secondary font-bold text-sm">
                  Access Dashboard <ArrowRight size={20} className="ml-2 group-hover:translate-x-2 transition-transform" />
                </div>
              </button>
            </div>
          </motion.div>
        )}

        {selectedPath === 'entrepreneur' && (
          <motion.div 
            key="entrepreneur-form"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full max-w-lg z-10"
          >
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-warm-text">Your Profile</h2>
              <button onClick={() => setSelectedPath('none')} className="text-sm font-medium text-warm-muted hover:text-warm-primary transition-colors">
                ← Go Back
              </button>
            </div>
            
            <div className="bg-warm-surface p-8 rounded-2xl border border-warm-border shadow-lg">
              <form onSubmit={handleEntrepreneurSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-warm-text flex items-center">
                    <User size={16} className="mr-2 text-warm-muted" /> Full Name
                  </label>
                  <input 
                    className="w-full rounded-xl border border-warm-border bg-warm-bg px-4 py-3 text-warm-text placeholder:text-warm-muted focus:outline-none focus:ring-2 focus:ring-warm-primary/20 focus:border-warm-primary transition-all font-medium"
                    placeholder="e.g. Ramesh Kumar" 
                    required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-warm-text">Age</label>
                    <input 
                      type="number"
                      className="w-full rounded-xl border border-warm-border bg-warm-bg px-4 py-3 text-warm-text placeholder:text-warm-muted focus:outline-none focus:ring-2 focus:ring-warm-primary/20 focus:border-warm-primary transition-all font-medium"
                      placeholder="25" 
                      required
                      value={formData.age}
                      onChange={e => setFormData({...formData, age: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-warm-text flex items-center">
                      <GraduationCap size={16} className="mr-2 text-warm-muted" /> Education
                    </label>
                    <select 
                      className="w-full rounded-xl border border-warm-border bg-warm-bg px-4 py-3 text-warm-text focus:outline-none focus:ring-2 focus:ring-warm-primary/20 focus:border-warm-primary transition-all font-medium"
                      value={formData.education}
                      onChange={e => setFormData({...formData, education: e.target.value})}
                    >
                      <option value="10th">10th Pass</option>
                      <option value="12th">12th Pass</option>
                      <option value="Graduate">Graduate</option>
                      <option value="ITI">ITI / Diploma</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-warm-text flex items-center">
                    <MapPin size={16} className="mr-2 text-warm-muted" /> Location (Target Market)
                  </label>
                  <input 
                    className="w-full rounded-xl border border-warm-border bg-warm-bg px-4 py-3 text-warm-text placeholder:text-warm-muted focus:outline-none focus:ring-2 focus:ring-warm-primary/20 focus:border-warm-primary transition-all font-medium"
                    placeholder="e.g. Solapur, Maharashtra" 
                    required
                    value={formData.location}
                    onChange={e => setFormData({...formData, location: e.target.value})}
                  />
                </div>
                
                <button 
                  type="submit" 
                  className="w-full mt-4 py-4 rounded-xl bg-warm-primary hover:bg-orange-600 text-white font-bold text-base flex items-center justify-center transition-all disabled:opacity-70 shadow-md hover:shadow-lg" 
                  disabled={loading}
                >
                  {loading ? <Loader2 className="animate-spin mr-2" size={20} /> : null}
                  Get Started <ArrowRight size={20} className="ml-2" />
                </button>
              </form>
            </div>
          </motion.div>
        )}

        {selectedPath === 'advisor' && (
          <motion.div 
            key="advisor-form"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full max-w-md z-10"
          >
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-warm-text">Institutional Login</h2>
              <button onClick={() => setSelectedPath('none')} className="text-sm font-medium text-warm-muted hover:text-warm-secondary transition-colors">
                ← Go Back
              </button>
            </div>
            
            <div className="bg-warm-surface p-8 rounded-2xl border border-warm-border shadow-lg">
              <div className="flex justify-center mb-8">
                <div className="w-20 h-20 bg-warm-bg rounded-full flex items-center justify-center border border-warm-border shadow-sm">
                  <Lock size={32} className="text-warm-secondary" />
                </div>
              </div>
              <form onSubmit={handleAdvisorSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-warm-text">Officer ID / Badge Number</label>
                  <input 
                    type="text"
                    className="w-full rounded-xl border border-warm-border bg-warm-bg px-4 py-3 text-warm-text focus:outline-none focus:ring-2 focus:ring-warm-secondary/20 focus:border-warm-secondary transition-all font-medium"
                    placeholder="GOV-ID-..."
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-warm-text">Security Clearance Code</label>
                  <input 
                    type="password"
                    className="w-full rounded-xl border border-warm-border bg-warm-bg px-4 py-3 text-warm-text focus:outline-none focus:ring-2 focus:ring-warm-secondary/20 focus:border-warm-secondary transition-all font-medium"
                    placeholder="••••••••"
                    required
                  />
                </div>
                
                <button 
                  type="submit" 
                  className="w-full py-4 rounded-xl bg-warm-secondary hover:bg-green-700 text-white font-bold text-base flex items-center justify-center transition-all disabled:opacity-70 shadow-md hover:shadow-lg" 
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

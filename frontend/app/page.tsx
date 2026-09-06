"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { api } from "@/lib/api-client";
import { Loader2, ArrowRight, Building2, MapPin, GraduationCap, User, Briefcase, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function LandingPage() {
  const router = useRouter();
  const { updateState, toggleUserMode } = useStore();
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
    <div className="flex-1 flex flex-col items-center justify-center p-4 min-h-screen relative overflow-hidden bg-white">
      {/* Abstract Background Patterns */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-warm-primary blur-3xl opacity-30"></div>
        <div className="absolute top-1/2 right-0 w-[500px] h-[500px] rounded-full bg-terminal-cyan blur-3xl opacity-20 transform translate-x-1/2 -translate-y-1/2"></div>
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
              <h1 className="text-6xl font-black tracking-widest text-black mb-4">YUKTI 2.0</h1>
              <p className="text-xl text-zinc-500 uppercase tracking-widest font-bold">Select Your Operating Environment</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Entrepreneur Door */}
              <button 
                onClick={() => setSelectedPath('entrepreneur')}
                className="group relative bg-white border border-warm-border p-12 rounded-3xl shadow-xl hover:shadow-2xl hover:border-warm-primary transition-all text-left overflow-hidden"
              >
                <div className="absolute inset-0 bg-warm-primary opacity-0 group-hover:opacity-5 transition-opacity"></div>
                <div className="w-16 h-16 bg-warm-bg rounded-full flex items-center justify-center mb-6 text-warm-primary group-hover:scale-110 transition-transform">
                  <User size={32} />
                </div>
                <h2 className="text-3xl font-bold text-warm-text mb-2">Entrepreneur</h2>
                <p className="text-warm-muted">I want to discover viable business opportunities, simulate financials, and generate a bank-ready project report.</p>
                <div className="mt-8 flex items-center text-warm-primary font-bold">
                  Enter Workspace <ArrowRight size={20} className="ml-2 group-hover:translate-x-2 transition-transform" />
                </div>
              </button>

              {/* Advisor Door */}
              <button 
                onClick={() => setSelectedPath('advisor')}
                className="group relative bg-black border border-zinc-800 p-12 rounded-3xl shadow-xl hover:shadow-2xl hover:border-terminal-cyan transition-all text-left overflow-hidden font-mono"
              >
                <div className="absolute inset-0 bg-terminal-cyan opacity-0 group-hover:opacity-5 transition-opacity"></div>
                <div className="w-16 h-16 bg-zinc-900 border border-zinc-800 rounded-full flex items-center justify-center mb-6 text-terminal-cyan group-hover:scale-110 transition-transform">
                  <Briefcase size={32} />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2 uppercase tracking-widest">Institutional Advisor</h2>
                <p className="text-zinc-500 text-sm">I want to monitor regional macro-trends, review incoming business plans, and execute risk assessments for loan approval.</p>
                <div className="mt-8 flex items-center text-terminal-cyan font-bold uppercase tracking-widest text-xs">
                  Access Terminal <ArrowRight size={20} className="ml-2 group-hover:translate-x-2 transition-transform" />
                </div>
              </button>
            </div>
          </motion.div>
        )}

        {selectedPath === 'entrepreneur' && (
          <motion.div 
            key="entrepreneur-form"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full max-w-lg z-10"
          >
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-warm-text">Entrepreneur Profile</h2>
              <button onClick={() => setSelectedPath('none')} className="text-sm text-warm-muted hover:text-warm-primary">← Back</button>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-warm-border">
              <form onSubmit={handleEntrepreneurSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-warm-text flex items-center">
                    <User size={16} className="mr-2 text-warm-muted" /> Full Name
                  </label>
                  <input 
                    className="w-full rounded-xl border border-warm-border bg-warm-bg/50 px-4 py-3 text-warm-text placeholder:text-warm-muted focus:outline-none focus:ring-2 focus:ring-warm-primary/20 focus:border-warm-primary transition-all"
                    placeholder="e.g. Ramesh Kumar" 
                    required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-warm-text">Age</label>
                    <input 
                      type="number"
                      className="w-full rounded-xl border border-warm-border bg-warm-bg/50 px-4 py-3 text-warm-text placeholder:text-warm-muted focus:outline-none focus:ring-2 focus:ring-warm-primary/20 focus:border-warm-primary transition-all"
                      placeholder="25" 
                      required
                      value={formData.age}
                      onChange={e => setFormData({...formData, age: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-warm-text flex items-center">
                      <GraduationCap size={16} className="mr-2 text-warm-muted" /> Education
                    </label>
                    <select 
                      className="w-full rounded-xl border border-warm-border bg-warm-bg/50 px-4 py-3 text-warm-text focus:outline-none focus:ring-2 focus:ring-warm-primary/20 focus:border-warm-primary transition-all"
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
                  <label className="text-sm font-semibold text-warm-text flex items-center">
                    <MapPin size={16} className="mr-2 text-warm-muted" /> Location (Target Market)
                  </label>
                  <input 
                    className="w-full rounded-xl border border-warm-border bg-warm-bg/50 px-4 py-3 text-warm-text placeholder:text-warm-muted focus:outline-none focus:ring-2 focus:ring-warm-primary/20 focus:border-warm-primary transition-all"
                    placeholder="e.g. Solapur, Maharashtra" 
                    required
                    value={formData.location}
                    onChange={e => setFormData({...formData, location: e.target.value})}
                  />
                </div>
                
                <button 
                  type="submit" 
                  className="w-full mt-8 py-4 bg-warm-primary hover:bg-warm-primary/90 text-white rounded-xl font-bold text-lg flex items-center justify-center transition-all shadow-lg shadow-warm-primary/30 disabled:opacity-70" 
                  disabled={loading}
                >
                  {loading ? <Loader2 className="animate-spin mr-2" size={20} /> : null}
                  Start My Journey <ArrowRight size={20} className="ml-2" />
                </button>
              </form>
            </div>
          </motion.div>
        )}

        {selectedPath === 'advisor' && (
          <motion.div 
            key="advisor-form"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full max-w-md z-10"
          >
            <div className="mb-6 flex justify-between items-center font-mono">
              <h2 className="text-2xl font-bold text-black uppercase tracking-widest">Institutional Auth</h2>
              <button onClick={() => setSelectedPath('none')} className="text-xs text-zinc-500 hover:text-black uppercase tracking-widest">← Abort</button>
            </div>
            
            <div className="bg-black p-8 rounded-none border border-zinc-800 font-mono shadow-2xl">
              <div className="flex justify-center mb-8">
                <Lock size={48} className="text-terminal-cyan opacity-50" />
              </div>
              <form onSubmit={handleAdvisorSubmit} className="space-y-6">
                <div>
                  <label className="text-[10px] text-zinc-500 uppercase tracking-widest mb-2 block">Officer ID / Badge Number</label>
                  <input 
                    type="text"
                    className="w-full bg-zinc-900 border border-zinc-700 px-4 py-3 text-white focus:outline-none focus:border-terminal-cyan transition-colors"
                    placeholder="GOV-ID-..."
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] text-zinc-500 uppercase tracking-widest mb-2 block">Security Clearance Code</label>
                  <input 
                    type="password"
                    className="w-full bg-zinc-900 border border-zinc-700 px-4 py-3 text-white focus:outline-none focus:border-terminal-cyan transition-colors"
                    placeholder="••••••••"
                    required
                  />
                </div>
                
                <button 
                  type="submit" 
                  className="w-full py-4 bg-terminal-cyan hover:bg-terminal-cyan/80 text-black font-bold uppercase tracking-widest text-xs flex items-center justify-center transition-colors disabled:opacity-70" 
                  disabled={loading}
                >
                  {loading ? <Loader2 className="animate-spin mr-2" size={16} /> : null}
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

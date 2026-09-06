"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { api } from "@/lib/api-client";
import { Loader2, ArrowRight, Building2, MapPin, GraduationCap, User } from "lucide-react";
import { motion } from "framer-motion";

export default function ProfilePage() {
  const router = useRouter();
  const { updateState } = useStore();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    education: "10th",
    location: "Solapur, Maharashtra"
  });

  const handleSubmit = async (e: React.FormEvent) => {
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
        profileName: formData.name
      });
      
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 min-h-[calc(100vh-100px)]">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
      >
        {/* Left Side: Friendly Value Prop */}
        <div className="text-left space-y-6 md:pr-8">
          <div className="inline-flex items-center space-x-2 bg-warm-primary/10 text-warm-primary px-4 py-2 rounded-full font-medium text-sm">
            <Building2 size={16} />
            <span>Empowering Rural Entrepreneurs</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-warm-text leading-tight">
            Discover Your Next <span className="text-warm-primary">Business Opportunity</span>
          </h1>
          <p className="text-lg text-warm-muted max-w-lg">
            Yukti helps you find the right business for your location, capital, and skills. We analyze local markets to ensure you start with confidence.
          </p>
          
          <div className="flex items-center space-x-8 pt-4">
            <div>
              <p className="text-3xl font-bold text-warm-text">1,200+</p>
              <p className="text-sm text-warm-muted">Businesses Analyzed</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-warm-text">98%</p>
              <p className="text-sm text-warm-muted">Data Confidence</p>
            </div>
          </div>
        </div>

        {/* Right Side: Clean Form */}
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-warm-border">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-warm-text">Tell us about yourself</h2>
            <p className="text-warm-muted text-sm mt-1">Let's personalize your Yukti experience.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
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
              className="w-full mt-8 py-4 bg-warm-primary hover:bg-warm-primary/90 text-white rounded-xl font-bold text-lg flex items-center justify-center transition-all hover:shadow-lg hover:shadow-warm-primary/30 disabled:opacity-70" 
              disabled={loading}
            >
              {loading ? <Loader2 className="animate-spin mr-2" size={20} /> : null}
              Start My Journey <ArrowRight size={20} className="ml-2" />
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { api } from "@/lib/api-client";
import { Loader2, ArrowRight } from "lucide-react";
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
        locationName: res.location_name
      });
      
      router.push("/capital");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl sm:text-5xl font-mono text-white tracking-widest uppercase mb-4 border-b border-zinc-800 pb-4 inline-block">
          Discover <span className="text-gradient">Business Potential</span>
        </h1>
        <p className="text-sm sm:text-base text-terminal-cyan max-w-2xl mx-auto font-mono uppercase tracking-widest">
          SYS.RUN(HYPER_LOCAL_DATA) // AI_MATCHING_ENGINE_ACTIVE
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-md"
      >
        <Card className="border-t-4 border-t-terminal-amber">
          <CardHeader className="text-left pb-4 border-b border-zinc-800 mb-4">
            <CardTitle className="text-sm font-mono text-zinc-400 uppercase tracking-widest">System Login / Profiling</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input 
                label="Full Name" 
                placeholder="e.g. Ramesh Kumar" 
                required
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input 
                  label="Age" 
                  type="number" 
                  placeholder="25" 
                  required
                  value={formData.age}
                  onChange={e => setFormData({...formData, age: e.target.value})}
                />
                <div className="flex flex-col space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-terminal-amber">Education</label>
                  <select 
                    className="rounded-none border border-zinc-700 bg-black px-3 py-2 text-terminal-text font-mono transition-all duration-100 focus:outline-none focus:border-terminal-cyan focus:ring-1 focus:ring-terminal-cyan disabled:opacity-50"
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
              <Input 
                label="Location (Target Market)" 
                placeholder="e.g. Solapur, Maharashtra" 
                required
                value={formData.location}
                onChange={e => setFormData({...formData, location: e.target.value})}
              />
              
              <Button type="submit" className="w-full mt-6 py-4" disabled={loading}>
                {loading ? <Loader2 className="animate-spin mr-2" size={16} /> : null}
                Initialize Profile <ArrowRight size={16} className="ml-2" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

"use client";
import React from 'react';
import { useStore } from '@/lib/store';
import { Card, CardContent } from '@/components/ui/card';
import { User, ShieldCheck, FileText, AlertCircle, Phone, Mail, Building, MapPin } from 'lucide-react';
import { YuktiInsight } from '@/components/YuktiInsight';

export default function ProfilePage() {
  const { categoryName, locationName, marginCapital, userMode } = useStore();

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 animate-in fade-in duration-500 font-mono text-terminal-text">
      <div className="mb-8 mt-6">
        <h1 className="text-3xl font-black tracking-widest text-white uppercase mb-2">Platform Profile</h1>
        <p className="text-zinc-500 uppercase tracking-widest text-sm">Identity Verification \ Core Details</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-terminal-card border-terminal-border rounded-none shadow-xl col-span-2">
          <CardContent className="p-6">
            <div className="flex items-start space-x-6">
              <div className="w-24 h-24 bg-black border-2 border-zinc-700 flex items-center justify-center text-zinc-600 rounded-none relative">
                <User size={48} />
                <div className="absolute -bottom-3 -right-3 bg-terminal-cyan text-black p-1.5 border border-black" title="Identity Verified">
                  <ShieldCheck size={20} />
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white tracking-widest uppercase mb-1">Rural Entrepreneur</h2>
                <div className="text-xs text-terminal-amber uppercase font-bold tracking-widest mb-4">UID: YK-492-771</div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center text-sm text-zinc-400">
                    <Phone size={14} className="mr-2 text-zinc-600" />
                    +91 98*** **341
                  </div>
                  <div className="flex items-center text-sm text-zinc-400">
                    <Mail size={14} className="mr-2 text-zinc-600" />
                    user@example.com
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-terminal-card border-terminal-border rounded-none shadow-xl">
          <CardContent className="p-6 flex flex-col justify-center h-full">
            <h3 className="text-xs text-zinc-500 uppercase tracking-widest font-bold mb-4">Linked Accounts</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-black border border-zinc-800 p-3">
                <div className="flex items-center">
                  <FileText size={16} className="text-terminal-cyan mr-2" />
                  <span className="text-xs uppercase font-bold text-zinc-300">Aadhaar (UIDAI)</span>
                </div>
                <ShieldCheck size={16} className="text-terminal-green" />
              </div>
              <div className="flex items-center justify-between bg-black border border-zinc-800 p-3">
                <div className="flex items-center">
                  <FileText size={16} className="text-terminal-amber mr-2" />
                  <span className="text-xs uppercase font-bold text-zinc-300">PAN</span>
                </div>
                <AlertCircle size={16} className="text-terminal-amber" title="Verification Pending" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-xl font-bold text-white uppercase tracking-widest mb-4 border-b border-zinc-800 pb-2">Business Intent</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-black border border-zinc-800 p-4">
          <div className="flex items-center text-zinc-500 mb-2">
            <Building size={16} className="mr-2" />
            <span className="text-[10px] uppercase tracking-widest font-bold">Category</span>
          </div>
          <div className="text-sm text-terminal-cyan font-bold">{categoryName || 'Not Set'}</div>
        </div>
        <div className="bg-black border border-zinc-800 p-4">
          <div className="flex items-center text-zinc-500 mb-2">
            <MapPin size={16} className="mr-2" />
            <span className="text-[10px] uppercase tracking-widest font-bold">Location</span>
          </div>
          <div className="text-sm text-white font-bold">{locationName || 'Not Set'}</div>
        </div>
        <div className="bg-black border border-zinc-800 p-4">
          <div className="flex items-center text-zinc-500 mb-2">
            <ShieldCheck size={16} className="mr-2" />
            <span className="text-[10px] uppercase tracking-widest font-bold">Initial Capital</span>
          </div>
          <div className="text-sm text-terminal-amber font-bold">₹{marginCapital ? marginCapital.toLocaleString('en-IN') : '0'}</div>
        </div>
      </div>

      <YuktiInsight 
        type="info"
        title="UDYAM REGISTRATION PENDING"
        message="Your PAN verification is currently processing. Once completed, your Udyam MSME Registration will be automatically generated and linked to this profile."
        className="mb-8"
      />
    </div>
  );
}

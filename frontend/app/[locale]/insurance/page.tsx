"use client";
import React, { useEffect, useState } from 'react';
import { useStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, ShieldAlert, ShieldCheck } from 'lucide-react';
import { api } from '@/lib/api-client';
import { Button } from '@/components/ui/button';

export default function InsuranceAdvisor() {
  const { categoryName } = useStore();
  const [policies, setPolicies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsurance = async () => {
      try {
        const data = await api.getInsuranceRecommendations({ category_name: categoryName || "Business" });
        setPolicies(data);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };
    fetchInsurance();
  }, [categoryName]);

  if (loading) return <div className="p-8 text-center">Loading insurance recommendations...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 text-warm-text animate-in fade-in duration-500">
      <div className="mb-8 mt-6 border-b border-warm-border pb-6 flex items-end gap-4">
        <Shield size={40} className="text-warm-primary" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Business Risk & Insurance</h1>
          <p className="text-warm-muted mt-2">Recommended government-backed protection for {categoryName || "your business"}.</p>
        </div>
      </div>

      <div className="grid gap-6">
        {policies.map((policy, i) => (
          <Card key={i} className="border-t-4 border-t-warm-primary hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <div className="text-[10px] uppercase font-bold tracking-widest text-warm-muted mb-1">{policy.type}</div>
                <CardTitle className="text-xl">{policy.name}</CardTitle>
              </div>
              <ShieldCheck className="text-emerald-500" size={24} />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-warm-text/80 mb-6">{policy.description}</p>
              
              <div className="flex flex-col sm:flex-row gap-4 bg-warm-surface p-4 rounded-xl border border-warm-border">
                <div className="flex-1">
                  <div className="text-xs text-warm-muted uppercase tracking-wider mb-1">Annual Premium</div>
                  <div className="font-bold text-lg text-warm-primary">{policy.premium}</div>
                </div>
                <div className="w-px bg-warm-border hidden sm:block"></div>
                <div className="flex-1">
                  <div className="text-xs text-warm-muted uppercase tracking-wider mb-1">Max Coverage</div>
                  <div className="font-bold text-lg text-terminal-cyan">{policy.coverage}</div>
                </div>
                <div className="flex-none flex items-center">
                  <Button variant="secondary" className="w-full sm:w-auto">Apply Now</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="mt-8 bg-amber-50/50 border border-amber-200 rounded-xl p-4 flex gap-3 text-sm text-amber-800">
        <ShieldAlert className="shrink-0 text-amber-500" />
        <p><strong>Note:</strong> Some state channelizing agencies (SCAs) require proof of life and asset insurance before disbursing loan amounts above ₹5,00,000.</p>
      </div>
    </div>
  );
}

"use client";
import React, { useEffect, useState } from 'react';
import { useStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Clock, FileText, Landmark } from 'lucide-react';
import { api } from '@/lib/api-client';

export default function SchemeTracker() {
  const { analysisResult } = useStore();
  const [tracked, setTracked] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTracker = async () => {
      try {
        // Mocking applied schemes, in reality we'd pull from user profile
        const data = await api.getTrackedSchemes({ applied_scheme_ids: ["nsfdc_term_loan", "mudra_shishu"] });
        setTracked(data);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };
    fetchTracker();
  }, []);

  if (loading) return <div className="p-8 text-center text-warm-muted">Loading your applications...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 text-warm-text animate-in fade-in duration-500">
      <div className="mb-8 mt-6 border-b border-warm-border pb-6 flex items-end gap-4">
        <Landmark size={40} className="text-warm-primary" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Scheme Application Tracker</h1>
          <p className="text-warm-muted mt-2">Track the live status of your government loan and subsidy applications.</p>
        </div>
      </div>

      <div className="space-y-6">
        {tracked.map((t, i) => (
          <Card key={i} className={`border-l-4 ${t.status === 'Approved' ? 'border-l-emerald-500' : 'border-l-amber-500'}`}>
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl">{t.name}</CardTitle>
                <div className="text-xs font-bold text-warm-muted uppercase tracking-widest mt-1 flex items-center gap-1">
                  {t.status === 'Approved' ? <CheckCircle2 size={14} className="text-emerald-500" /> : <Clock size={14} className="text-amber-500" />}
                  Status: <span className={t.status === 'Approved' ? 'text-emerald-600' : 'text-amber-600'}>{t.status}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-warm-muted">Deadline / Next Action</div>
                <div className="font-bold text-warm-primary">{t.deadline}</div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="w-full h-2 bg-warm-bg rounded-full overflow-hidden mb-4 mt-2">
                <div 
                  className={`h-full ${t.status === 'Approved' ? 'bg-emerald-500' : 'bg-amber-500'}`} 
                  style={{ width: `${t.progress_pct}%` }}
                ></div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 bg-warm-surface p-4 rounded-xl border border-warm-border mt-4">
                <div className="flex-1">
                  <div className="text-xs text-warm-muted uppercase tracking-wider mb-1 flex items-center gap-1"><FileText size={14} /> Next Step</div>
                  <div className="font-bold text-warm-text">{t.next_step}</div>
                </div>
                <div className="w-px bg-warm-border hidden sm:block"></div>
                <div className="flex-[2]">
                  <div className="text-xs text-warm-muted uppercase tracking-wider mb-1">Notes from Agency</div>
                  <div className="text-sm text-warm-text/80">{t.notes}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

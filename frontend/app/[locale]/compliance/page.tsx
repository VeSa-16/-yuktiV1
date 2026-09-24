"use client";
import React, { useEffect, useState } from 'react';
import { useStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar as CalendarIcon, CheckCircle2, AlertCircle } from 'lucide-react';
import { api } from '@/lib/api-client';

export default function ComplianceCalendar() {
  const { analysisResult, categoryName } = useStore();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompliance = async () => {
      if (!analysisResult) {
        setLoading(false);
        return;
      }
      try {
        const rev = analysisResult.financials?.monthly_revenue || 50000;
        const res = await api.getComplianceCalendar({
          monthly_revenue: rev,
          business_type: categoryName || "Business"
        });
        setData(res);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };
    fetchCompliance();
  }, [analysisResult, categoryName]);

  if (loading) return <div className="p-8 text-center text-warm-muted">Loading compliance calendar...</div>;
  if (!data) return <div className="p-8 text-center text-warm-muted">Run analysis first to view your compliance schedule.</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 text-warm-text animate-in fade-in duration-500">
      <div className="mb-8 mt-6 border-b border-warm-border pb-6 flex items-end gap-4">
        <CalendarIcon size={40} className="text-warm-primary" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tax & Compliance Calendar</h1>
          <p className="text-warm-muted mt-2">Mandatory regulatory requirements for your projected ₹{(data.annual_revenue_projection/100000).toFixed(1)}L annual turnover.</p>
        </div>
      </div>

      <div className="space-y-4">
        {data.calendar.map((item: any, i: number) => (
          <Card key={i} className={`border-l-4 ${item.required ? (item.task.includes('GST') && !data.needs_gst ? 'border-l-warm-border' : 'border-l-amber-500') : 'border-l-warm-border'}`}>
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  {item.required ? (item.task.includes('GST') && !data.needs_gst ? <CheckCircle2 className="text-emerald-500" size={18} /> : <AlertCircle className="text-amber-500" size={18} />) : <CheckCircle2 className="text-emerald-500" size={18} />}
                  {item.task}
                </CardTitle>
                <div className="text-xs font-bold text-warm-muted uppercase tracking-widest mt-1">
                  Frequency: {item.frequency}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-warm-muted">Deadline</div>
                <div className="font-bold text-warm-text">{item.deadline}</div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-warm-text/80">{item.note}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

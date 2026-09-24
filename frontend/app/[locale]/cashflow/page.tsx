"use client";
import React, { useEffect, useState } from 'react';
import { useStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, TrendingDown, TrendingUp } from 'lucide-react';
import { api } from '@/lib/api-client';

export default function CashflowPlanner() {
  const { analysisResult } = useStore();
  const [forecast, setForecast] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchForecast = async () => {
      if (!analysisResult) {
        setLoading(false);
        return;
      }
      try {
        const peak = analysisResult.market?.peak_seasons || [];
        const lean = analysisResult.market?.lean_season || "";
        const rev = analysisResult.financials?.monthly_revenue || 50000;
        
        const data = await api.getCashflowForecast({
          peak_seasons: peak,
          lean_season: lean,
          average_monthly_revenue: rev
        });
        setForecast(data);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };
    fetchForecast();
  }, [analysisResult]);

  if (loading) return <div className="p-8 text-center text-warm-muted">Loading forecast...</div>;
  if (!forecast) return <div className="p-8 text-center text-warm-muted">Run analysis first to view cashflow forecast.</div>;

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 text-warm-text animate-in fade-in duration-500">
      <div className="mb-8 mt-6 border-b border-warm-border pb-6 flex items-end gap-4">
        <Calendar size={40} className="text-warm-primary" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Seasonal Cashflow Planner</h1>
          <p className="text-warm-muted mt-2">Plan your finances across the 12 months based on local market seasonality.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {forecast.forecast.map((month: any, i: number) => (
          <Card key={i} className={`border-t-4 ${month.seasonality === 'peak' ? 'border-t-emerald-500 bg-emerald-50/10' : month.seasonality === 'lean' ? 'border-t-red-500 bg-red-50/10' : 'border-t-warm-border'}`}>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-bold uppercase tracking-wider flex justify-between">
                {month.month}
                {month.seasonality === 'peak' && <TrendingUp size={16} className="text-emerald-500" />}
                {month.seasonality === 'lean' && <TrendingDown size={16} className="text-red-500" />}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-2">
              <div className={`text-lg font-black ${month.seasonality === 'peak' ? 'text-emerald-600' : month.seasonality === 'lean' ? 'text-red-600' : 'text-warm-text'}`}>
                ₹{month.projected_revenue.toLocaleString()}
              </div>
              <div className="text-[10px] text-warm-muted mt-1 uppercase tracking-widest font-sans">
                {month.seasonality === 'peak' ? 'Peak Season' : month.seasonality === 'lean' ? 'Lean Season' : 'Average'}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {forecast.lean_months.length > 0 && (
        <div className="mt-8 bg-red-50/20 border border-red-200 rounded-xl p-6 flex items-start gap-4">
          <TrendingDown className="text-red-500 shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-red-700">Lean Season Warning</h3>
            <p className="text-sm text-red-600/80 mt-1">
              Your revenue is projected to drop by 40% during {forecast.lean_months.join(', ')}. Set aside surplus cash from your peak months ({forecast.peak_months.join(', ')}) to ensure you can cover your fixed EMIs during this period.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

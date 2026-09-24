"use client";
import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Activity, ArrowRight, ShieldCheck, AlertTriangle } from 'lucide-react';
import { api } from '@/lib/api-client';
import { YuktiFiInsight } from '@/components/YuktiFiInsight';
import { motion } from 'framer-motion';

export default function HealthTracker() {
  const { analysisResult } = useStore();
  const [revenue, setRevenue] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Fallback EMI if not available in analysis
  const emi = analysisResult?.financials?.emi || 5000; 

  const checkHealth = async () => {
    setLoading(true);
    try {
      const data = await api.getHealthStatus({
        monthly_revenue: Number(revenue),
        monthly_expenses: Number(expenses),
        emi: emi
      });
      setResult(data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 text-warm-text animate-in fade-in duration-500">
      <div className="mb-8 mt-6 border-b border-warm-border pb-6">
        <h1 className="text-3xl font-bold tracking-tight">Business Health Tracker</h1>
        <p className="text-warm-muted mt-2">Monitor your post-loan financial health to ensure safe operations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="border-t-4 border-t-warm-primary">
          <CardHeader>
            <CardTitle className="text-lg text-warm-muted uppercase tracking-widest font-sans">Enter This Month's Data</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-bold mb-2">Total Monthly Revenue (₹)</label>
              <input 
                type="number" 
                value={revenue || ''} 
                onChange={e => setRevenue(Number(e.target.value))}
                className="w-full rounded-none border border-warm-border bg-warm-bg px-4 py-3 text-warm-primary text-xl font-bold focus:outline-none focus:border-warm-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Total Monthly Expenses (₹)</label>
              <input 
                type="number" 
                value={expenses || ''} 
                onChange={e => setExpenses(Number(e.target.value))}
                className="w-full rounded-none border border-warm-border bg-warm-bg px-4 py-3 text-warm-primary text-xl font-bold focus:outline-none focus:border-warm-primary"
              />
            </div>
            <div className="bg-warm-surface p-4 rounded-xl border border-warm-border">
              <span className="text-sm text-warm-muted block mb-1">Your Monthly Loan EMI</span>
              <span className="text-xl font-bold text-terminal-cyan">₹{emi.toLocaleString()}</span>
            </div>
            
            <Button onClick={checkHealth} disabled={loading || !revenue || !expenses} className="w-full py-4 uppercase font-bold tracking-wider">
              {loading ? "Calculating..." : "Analyze Health"}
            </Button>
          </CardContent>
        </Card>

        {result && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <Card className={`border-t-4 ${result.status === 'healthy' ? 'border-t-emerald-500' : result.status === 'warning' ? 'border-t-amber-500' : 'border-t-red-500'}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {result.status === 'healthy' ? <ShieldCheck className="text-emerald-500" /> : <AlertTriangle className={result.status === 'warning' ? "text-amber-500" : "text-red-500"} />}
                  Health Status: {result.status.toUpperCase()}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-warm-border">
                  <span className="text-warm-muted">Net Operating Income</span>
                  <span className="font-bold">₹{result.net_operating_income.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-warm-border">
                  <span className="text-warm-muted">Debt Service Coverage (DSCR)</span>
                  <span className={`font-black text-xl ${result.dscr >= 1.25 ? 'text-emerald-500' : result.dscr >= 1.0 ? 'text-amber-500' : 'text-red-500'}`}>
                    {result.dscr}x
                  </span>
                </div>
                <YuktiFiInsight 
                  type={result.status === 'healthy' ? 'success' : result.status === 'warning' ? 'warning' : 'danger'}
                  title="Analysis"
                  message={result.message}
                  className="mt-4"
                />
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}

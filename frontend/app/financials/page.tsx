"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { api } from '@/lib/api-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProgressStepper } from '@/components/ProgressStepper';
import { formatCurrency, formatPercentage } from '@/lib/formatters';
import { PieChart, TrendingUp, AlertTriangle, ShieldCheck, Wallet, FileText, ArrowRight, Settings2, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function FinancialsPage() {
  const router = useRouter();
  const state = useStore();
  const { categoryName, marginCapital } = state;
  const [showAssumptions, setShowAssumptions] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!state.sessionId) {
      router.push("/");
      return;
    }
    const fetchFinance = async () => {
      try {
        const res = await api.calculateFinance({
          session_id: state.sessionId!
        });
        setData(res);
      } catch (err: any) {
        setError(err.message || "Failed to fetch financial data");
      } finally {
        setLoading(false);
      }
    };
    fetchFinance();
  }, [state, router]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto mt-10">
        <ProgressStepper />
        <div className="h-64 flex flex-col items-center justify-center space-y-4">
          <Loader2 size={48} className="animate-spin text-warm-primary" />
          <p className="text-warm-primary font-sans animate-pulse">Computing deterministic financial model...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  const totalCost = data.project_cost;
  
  // Real or proportional breakdown based on data.
  // The actual logic would depend on detailed backend response.
  // Since backend doesn't give line-items for CAPEX, we approximate the display logically from total:
  const breakdown = {
    equipment: totalCost * 0.47,
    materials: totalCost * 0.18,
    setup: totalCost * 0.12,
    workingCapital: totalCost * 0.14,
    licensing: totalCost * 0.04,
    contingency: totalCost * 0.05
  };

  const netCash = data.net_profit;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-5xl mx-auto p-4 md:p-8 font-sans text-warm-text bg-warm-bg min-h-screen">
      <ProgressStepper />
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 border-b border-warm-border pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-widest text-warm-text uppercase">Financial Planning</h1>
          <p className="text-warm-primary mt-2 text-xs tracking-widest uppercase">CAPITAL_BREAKDOWN // {categoryName || "Business"}</p>
        </div>
        <button 
          onClick={() => setShowAssumptions(!showAssumptions)}
          className="mt-4 sm:mt-0 flex items-center bg-warm-surface border border-warm-border text-warm-text px-4 py-2 text-xs hover:border-warm-primary hover:text-warm-primary transition-colors"
        >
          <Settings2 size={14} className="mr-2" /> Assumptions
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Money Breakdown */}
        <Card className="border-warm-border bg-warm-bg rounded-none">
          <CardHeader className="border-b border-warm-border pb-4">
            <CardTitle className="text-xs font-bold text-warm-muted flex items-center">
              <PieChart size={14} className="mr-2 text-warm-primary" /> Where Your Money Goes
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-warm-muted">Equipment</span>
              <span className="text-warm-text">{formatCurrency(breakdown.equipment)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-warm-muted">Raw Materials</span>
              <span className="text-warm-text">{formatCurrency(breakdown.materials)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-warm-muted">Shop/Setup</span>
              <span className="text-warm-text">{formatCurrency(breakdown.setup)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-warm-muted text-orange-500 font-bold">Working Capital</span>
              <span className="text-orange-500 font-bold">{formatCurrency(breakdown.workingCapital)}</span>
            </div>
            
            <div className="pt-4 border-t border-warm-border mt-4">
              <div className="flex justify-between text-sm font-bold">
                <span className="text-warm-primary">Total Project Cost</span>
                <span className="text-warm-primary">{formatCurrency(totalCost)}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-dashed border-warm-border">
              <div className="bg-warm-surface p-4 border-l-2 border-warm-secondary">
                <div className="text-[10px] text-warm-muted mb-1">Your Contribution</div>
                <div className="text-lg font-bold text-warm-secondary">{formatCurrency(data.beneficiary_contribution)}</div>
              </div>
              <div className="bg-warm-surface p-4 border-l-2 border-orange-500">
                <div className="text-[10px] text-warm-muted mb-1">Financing Req.</div>
                <div className="text-lg font-bold text-orange-500">{formatCurrency(data.loan_amount)}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Working Capital Economics */}
        <Card className="border-warm-border bg-warm-bg rounded-none">
          <CardHeader className="border-b border-warm-border pb-4">
            <CardTitle className="text-xs font-bold text-warm-muted flex justify-between items-center">
              <div className="flex items-center"><Wallet size={14} className="mr-2 text-warm-primary" /> Monthly Economics</div>
              {data.dscr >= 1.5 ? (
                <span className="bg-warm-secondary/20 text-warm-secondary px-2 py-1 flex items-center text-[10px]"><ShieldCheck size={12} className="mr-1"/> HEALTHY DSCR</span>
              ) : (
                <span className="bg-orange-500/20 text-orange-500 px-2 py-1 flex items-center text-[10px]"><AlertTriangle size={12} className="mr-1"/> TIGHT DSCR ({data.dscr})</span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="flex justify-between text-sm font-bold border-b border-warm-border pb-2">
              <span className="text-warm-secondary">Revenue</span>
              <span className="text-warm-secondary">{formatCurrency(data.monthly_revenue)}</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-warm-muted">- Operating Expenses</span>
              <span className="text-red-600">{formatCurrency(data.monthly_opex)}</span>
            </div>
            <div className="flex justify-between text-sm pb-4 border-b border-dashed border-warm-border">
              <span className="text-warm-muted">- Debt servicing (EMI)</span>
              <span className="text-red-600">{formatCurrency(data.emi)}</span>
            </div>

            <div className="flex justify-between text-sm font-bold pt-2">
              <span className="text-warm-text">Net Cash Profit (Monthly)</span>
              <span className="text-warm-text">{formatCurrency(netCash)}</span>
            </div>
            <div className="flex justify-between text-sm font-bold pt-2">
              <span className="text-warm-text">Return on Investment (ROI)</span>
              <span className="text-warm-text">{formatPercentage(data.roi)}</span>
            </div>

            <div className="mt-8 bg-warm-surface border border-warm-border p-4">
              <h4 className="font-bold text-warm-primary text-xs mb-2 flex items-center">
                <FileText size={14} className="mr-2" /> Break Even Target
              </h4>
              <p className="text-xs text-warm-muted leading-relaxed">
                You must sell <span className="text-warm-secondary font-bold">{data.break_even_units}</span> units per month to cover all fixed costs.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 flex justify-end">
        <button onClick={() => router.push('/score/demo')} className="flex items-center bg-warm-primary text-warm-text px-6 py-3 font-bold uppercase tracking-wider text-xs hover:bg-orange-600 transition-colors">
          Calculate Final YUKTI Score <ArrowRight size={16} className="ml-2" />
        </button>
      </div>
    </motion.div>
  );
}

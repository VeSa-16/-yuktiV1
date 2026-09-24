import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, IndianRupee, Clock, TrendingUp, AlertTriangle } from "lucide-react";

interface Props {
  loanAmount: number;
  ownCapital: number;
  emi: number;
  totalInterest: number;
  monthlyOperatingSurplus: number;
  dscr: number;
  fundingGap?: number;
}

const fmt = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;

export function FinancialBurdenPanel({
  loanAmount,
  ownCapital,
  emi,
  totalInterest,
  monthlyOperatingSurplus,
  dscr,
  fundingGap = 0,
}: Props) {
  const totalCapital = loanAmount + ownCapital + fundingGap;
  const loanPct = totalCapital > 0 ? (loanAmount / totalCapital) * 100 : 0;
  const ownPct = totalCapital > 0 ? (ownCapital / totalCapital) * 100 : 0;
  const gapPct = totalCapital > 0 ? (fundingGap / totalCapital) * 100 : 0;

  const dscrColor = dscr >= 1.5 ? "text-emerald-600" : dscr >= 1.0 ? "text-amber-600" : "text-red-600";
  const surplusAfterEmi = monthlyOperatingSurplus - emi;

  return (
    <Card className="border-warm-border shadow-sm bg-warm-surface rounded-2xl overflow-hidden mt-6">
      <CardHeader className="bg-warm-bg/50 pb-3 border-b border-warm-border">
        <CardTitle className="text-sm font-bold text-warm-text uppercase tracking-wider flex items-center gap-2">
          <Wallet size={16} className="text-warm-primary" />
          Financial Burden Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          {/* Capital Structure Bar */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-bold text-warm-text">Capital Structure</span>
              <span className="text-sm font-bold text-warm-text">{fmt(totalCapital)}</span>
            </div>
            <div className="w-full h-3 bg-slate-200 rounded-full flex overflow-hidden">
              <div 
                className="h-full bg-emerald-500" 
                style={{ width: `${ownPct}%` }}
                title={`Own Capital: ${fmt(ownCapital)}`}
              />
              <div 
                className="h-full bg-blue-500" 
                style={{ width: `${loanPct}%` }}
                title={`Loan: ${fmt(loanAmount)}`}
              />
              {fundingGap > 0 && (
                <div 
                  className="h-full bg-red-500" 
                  style={{ width: `${gapPct}%` }}
                  title={`Funding Gap: ${fmt(fundingGap)}`}
                />
              )}
            </div>
            <div className="flex justify-between mt-2 text-xs text-warm-muted">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                Own Capital: {fmt(ownCapital)} ({Math.round(ownPct)}%)
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                Loan: {fmt(loanAmount)} ({Math.round(loanPct)}%)
              </div>
              {fundingGap > 0 && (
                <div className="flex items-center gap-1 text-red-600 font-bold">
                  <div className="w-2 h-2 bg-red-500 rounded-full" />
                  Gap: {fmt(fundingGap)} ({Math.round(gapPct)}%)
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-warm-border">
            <div>
              <div className="flex items-center gap-1 text-xs font-bold text-warm-muted uppercase mb-1">
                <Clock size={14} /> Monthly EMI
              </div>
              <div className="text-xl font-bold text-ink">{fmt(emi)}</div>
            </div>
            <div>
              <div className="flex items-center gap-1 text-xs font-bold text-warm-muted uppercase mb-1">
                <IndianRupee size={14} /> Total Interest
              </div>
              <div className="text-xl font-bold text-red-600">{fmt(totalInterest)}</div>
            </div>
            <div>
              <div className="flex items-center gap-1 text-xs font-bold text-warm-muted uppercase mb-1">
                <TrendingUp size={14} /> Mo. Surplus
              </div>
              <div className="text-xl font-bold text-emerald-600">{fmt(monthlyOperatingSurplus)}</div>
            </div>
            <div>
              <div className="flex items-center gap-1 text-xs font-bold text-warm-muted uppercase mb-1">
                <AlertTriangle size={14} /> DSCR
              </div>
              <div className={`text-xl font-bold ${dscrColor}`}>{dscr.toFixed(2)}x</div>
            </div>
          </div>

          <div className={`text-sm p-4 rounded-xl border ${dscr >= 1.2 ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
            <strong>Surplus After EMI:</strong> {fmt(surplusAfterEmi)} / month.
            {dscr >= 1.2 
              ? " The business generates sufficient cash flow to cover the loan comfortably." 
              : " The business does NOT generate enough cash flow to cover the loan safely."}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

"use client";
import React, { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { api, FinanceResponse } from "@/lib/api-client";
import dynamic from "next/dynamic";
import {
  IndianRupee, TrendingUp, TrendingDown, AlertTriangle, Loader2,
  CheckCircle, CreditCard, BarChart3, CalendarDays, Target,
  ShieldAlert, Wallet, Clock, ArrowRight, Info
} from "lucide-react";

// Lazy-load standalone chart components — keeping Recharts internal subcomponents
// statically imported within each component preserves Recharts internal type-matching.
const CashFlowChart = dynamic(() => import("@/components/financials/CashFlowChart"), {
  ssr: false,
  loading: () => <div className="w-full h-80 bg-gray-50 rounded-2xl animate-pulse flex items-center justify-center text-xs text-ink-soft">Loading Charts...</div>
});

const SeasonalChart = dynamic(() => import("@/components/financials/SeasonalChart"), {
  ssr: false,
  loading: () => <div className="w-full h-72 bg-gray-50 rounded-2xl animate-pulse flex items-center justify-center text-xs text-ink-soft">Loading Chart...</div>
});



// ─── Helpers ───────────────────────────────────────────────────────────────

const fmt = (n: number) =>
  n >= 100000 ? `₹${(n / 100000).toFixed(1)}L` : `₹${Math.round(n).toLocaleString("en-IN")}`;

const fmtFull = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;

const TABS = [
  { key: "overview",    label: "Overview",       icon: BarChart3 },
  { key: "cashflow",    label: "Cash Flow",       icon: TrendingUp },
  { key: "pnl",         label: "P&L",             icon: IndianRupee },
  { key: "breakeven",   label: "Break-Even",      icon: Target },
  { key: "loan",        label: "Loan & Monthly Installment",      icon: CreditCard },
  { key: "working",     label: "Working Capital", icon: Wallet },
  { key: "scenarios",   label: "Scenarios",       icon: ShieldAlert },
  { key: "seasonal",    label: "Seasonal",        icon: CalendarDays },
];

// ─── Summary Card ────────────────────────────────────────────────────────────

const SummaryCard = ({ label, value, sub, color = "text-ink", icon: Icon }: any) => (
  <div className="bg-white rounded-2xl p-5 border border-premium-border shadow-sm flex flex-col gap-2">
    <div className="flex items-center justify-between">
      <span className="text-xs font-bold text-ink-soft uppercase tracking-wide">{label}</span>
      <Icon size={16} className="text-ink-faint" />
    </div>
    <div className={`text-2xl font-bold font-display ${color}`}>{value}</div>
    {sub && <div className="text-xs font-medium text-ink-soft">{sub}</div>}
  </div>
);

// ─── Overview Tab ────────────────────────────────────────────────────────────

const OverviewTab = ({ data }: { data: FinanceResponse }) => {
  const scheme = data.scheme as any;
  const schemeName = scheme?.scheme_name || "Standard Bank Loan";

  return (
    <div className="animate-in fade-in duration-300">
      <h2 className="text-xl font-bold text-forest-deep mb-6">Financial Overview</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        <SummaryCard label="Project Cost" value={fmt(data.project_cost)} sub="Total capital required" icon={Wallet} color="text-ink" />
        <SummaryCard label="Loan Amount" value={fmt(data.loan_amount)} sub={`@ ${data.rate}% p.a.`} icon={CreditCard} color="text-[#2563eb]" />
        <SummaryCard label="Your Contribution" value={fmt(data.beneficiary_contribution)} sub="10% margin money" icon={IndianRupee} color="text-[#16a34a]" />
        <SummaryCard label="Monthly Monthly Installment" value={fmtFull(data.emi)} sub={`${data.tenure_months} months`} icon={Clock} color="text-[#ea580c]" />
        <SummaryCard label="Monthly Revenue" value={fmt(data.monthly_revenue)} sub="Expected earnings" icon={TrendingUp} color="text-[#16a34a]" />
        <SummaryCard label="Monthly Expenses" value={fmt(data.monthly_opex)} sub="OPEX + Variable" icon={TrendingDown} color="text-red-500" />
        <SummaryCard label="Net Profit / Month" value={fmt(data.net_profit)} sub="After all costs" icon={Target} color={data.net_profit >= 0 ? "text-[#16a34a]" : "text-red-500"} />
        <SummaryCard label="Annual Return on Investment" value={`${data.roi}%`} sub="Return on investment" icon={BarChart3} color={data.roi >= 15 ? "text-[#16a34a]" : "text-[#ea580c]"} />
      </div>

      {/* Scheme Info - Highlighted */}
      <div className="relative bg-gradient-to-br from-[#16a34a] to-[#14532d] rounded-2xl p-6 text-white mb-6 shadow-[0_0_20px_rgba(22,163,74,0.3)] border border-[#22c55e]/30 overflow-hidden transform transition-transform hover:scale-[1.01]">
        <div className="absolute top-0 right-0 bg-[#fde047] text-[#854d0e] text-xs font-bold px-3 py-1 rounded-bl-xl z-10 flex items-center">
          <CheckCircle size={12} className="mr-1" /> Best Match
        </div>
        <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
        <div className="absolute -right-2 -bottom-2 w-32 h-32 bg-[#22c55e]/20 rounded-full blur-2xl"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-start justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#fde047] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#fde047]"></span>
              </span>
              <p className="text-sm font-bold text-[#fde047]">Eligible Government Scheme</p>
            </div>
            <h3 className="text-2xl font-bold mb-3 drop-shadow-sm">{schemeName}</h3>
            <div className="inline-flex flex-wrap gap-4 bg-black/20 rounded-lg px-4 py-2 backdrop-blur-sm mb-4">
              <p className="text-sm text-white/90">
                Interest: <span className="font-bold text-white text-base">{data.rate}%</span>
              </p>
              <div className="hidden sm:block w-px bg-white/20"></div>
              <p className="text-sm text-white/90">
                Tenure: <span className="font-bold text-white text-base">{Math.round(data.tenure_months / 12)} yrs</span>
              </p>
              {data.moratorium_months > 0 && (
                <>
                  <div className="hidden sm:block w-px bg-white/20"></div>
                  <p className="text-sm text-white/90">
                    Moratorium: <span className="font-bold text-white text-base">{data.moratorium_months} mos</span>
                  </p>
                </>
              )}
            </div>
            {scheme?.explanation && (
              <p className="text-sm text-white/80 leading-relaxed mb-4 max-w-2xl">
                {scheme.explanation}
              </p>
            )}
            {scheme?.source_url && (
              <a 
                href={scheme.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-5 py-2.5 bg-white text-forest-deep rounded-xl font-bold text-sm hover:bg-[#fcfbf8] transition-colors shadow-sm"
              >
                Apply for this Scheme <ArrowRight size={16} className="ml-2" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Loan Repayment Capacity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-premium-border shadow-sm">
          <p className="text-xs font-bold text-ink-soft uppercase mb-1">Loan Repayment Capacity</p>
          <div className={`text-3xl font-bold font-display mb-1 ${data.dscr >= 1.5 ? "text-[#16a34a]" : data.dscr >= 1.0 ? "text-[#ea580c]" : "text-red-500"}`}>{data.dscr}x</div>
          <p className="text-sm text-ink-soft">
            {data.dscr >= 1.5 ? "✅ Strong repayment ability" : data.dscr >= 1.0 ? "⚠️ Adequate — manage costs tightly" : "🔴 Weak — reconsider the capital plan"}
          </p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-premium-border shadow-sm">
          <p className="text-xs font-bold text-ink-soft uppercase mb-1">Break-Even Units / Month</p>
          <div className="text-3xl font-bold font-display text-[#6366f1] mb-1">{Math.round(data.break_even_units)} units</div>
          <p className="text-sm text-ink-soft">
            You need to sell {Math.round(data.break_even_units / 26)} units per working day to cover all costs.
          </p>
        </div>
      </div>
    </div>
  );
};

// ─── Cash Flow Tab ────────────────────────────────────────────────────────────

const CashFlowTab = ({ data }: { data: FinanceResponse }) => {
  const cf = data.cashflow_projection;
  const breakEvenMonth = cf.find(m => m.cumulative >= 0);

  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-forest-deep">12-Month Cash Flow Projection</h2>
          <p className="text-sm text-ink-soft mt-1">Revenue vs Expenses (seasonal variations applied)</p>
        </div>
        {breakEvenMonth && (
          <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl px-4 py-2 text-right">
            <p className="text-xs font-bold text-[#16a34a]">BREAK-EVEN MONTH</p>
            <p className="font-bold text-[#16a34a]">{breakEvenMonth.month} (Month {breakEvenMonth.month_num})</p>
          </div>
        )}
      </div>

      <CashFlowChart data={cf} />
    </div>
  );
};

// ─── P&L Tab ─────────────────────────────────────────────────────────────────

const PnlTab = ({ data }: { data: FinanceResponse }) => {
  const pnl = data.pnl_statement;
  if (!pnl) return <p className="text-ink-soft">P&L data not available.</p>;

  const rows = [
    { label: "Revenue (Gross Sales)", value: pnl.revenue, bold: true, color: "text-[#16a34a]" },
    { label: "(-) Cost of Goods Sold (COGS)", value: -pnl.cogs, color: "text-red-500" },
    { label: "= Gross Profit", value: pnl.gross_profit, bold: true, highlight: true },
    { label: "(-) Operating Expenses (OPEX)", value: -pnl.operating_expenses, color: "text-red-500" },
    { label: "= EBIT (Earnings before Tax)", value: pnl.ebit, bold: true },
    { label: "(-) Income Tax (estimated)", value: -pnl.tax, color: "text-red-500" },
    { label: "= Net Profit", value: pnl.net_profit, bold: true, highlight: true, color: pnl.net_profit >= 0 ? "text-[#16a34a]" : "text-red-500" },
  ];

  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-forest-deep">Monthly P&L Statement</h2>
          <p className="text-sm text-ink-soft mt-1">Projected monthly income statement for your business</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold text-ink-soft">Gross Margin</p>
          <p className="text-2xl font-bold text-[#16a34a]">{pnl.gross_margin_pct}%</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-premium-border shadow-sm overflow-hidden mb-6">
        <div className="px-6 py-3 bg-[#f9f8f5] border-b border-premium-border flex justify-between">
          <span className="text-xs font-bold text-ink-soft uppercase">Line Item</span>
          <span className="text-xs font-bold text-ink-soft uppercase">Monthly Amount</span>
        </div>
        {rows.map((row, i) => (
          <div
            key={i}
            className={`px-6 py-4 flex justify-between items-center border-b border-premium-border/50 last:border-0 ${row.highlight ? "bg-[#f0fdf4]" : ""}`}
          >
            <span className={`text-sm ${row.bold ? "font-bold text-ink" : "font-medium text-ink-soft"}`}>{row.label}</span>
            <span className={`text-sm font-bold font-display ${row.color || (row.value >= 0 ? "text-ink" : "text-red-500")}`}>
              {row.value >= 0 ? fmtFull(row.value) : `- ${fmtFull(Math.abs(row.value))}`}
            </span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#f0fdf4] rounded-2xl border border-[#bbf7d0] p-5">
          <p className="text-xs font-bold text-[#16a34a] mb-1">Gross Margin</p>
          <p className="text-2xl font-bold text-[#16a34a]">{pnl.gross_margin_pct}%</p>
        </div>
        <div className={`rounded-2xl border p-5 ${pnl.net_margin_pct >= 10 ? "bg-[#f0fdf4] border-[#bbf7d0]" : "bg-[#fff7ed] border-[#fed7aa]"}`}>
          <p className={`text-xs font-bold mb-1 ${pnl.net_margin_pct >= 10 ? "text-[#16a34a]" : "text-[#ea580c]"}`}>Net Margin</p>
          <p className={`text-2xl font-bold ${pnl.net_margin_pct >= 10 ? "text-[#16a34a]" : "text-[#ea580c]"}`}>{pnl.net_margin_pct}%</p>
        </div>
        <div className="bg-white rounded-2xl border border-premium-border p-5">
          <p className="text-xs font-bold text-ink-soft mb-1">Annual Net Profit</p>
          <p className="text-2xl font-bold text-ink">{fmt(pnl.net_profit * 12)}</p>
        </div>
      </div>
    </div>
  );
};

// ─── Break-Even Tab ───────────────────────────────────────────────────────────

const BreakEvenTab = ({ data }: { data: FinanceResponse }) => {
  const dailyUnits = Math.ceil(data.break_even_units / 26);
  // Protect against division by zero if monthly_revenue is 0
  const monthlyUnits = data.monthly_revenue > 0 ? (data.monthly_revenue / 100) : 1;
  const pct = data.monthly_revenue > 0 
    ? Math.min(100, Math.round((data.break_even_units / monthlyUnits) * 100))
    : 0;

  return (
    <div className="animate-in fade-in duration-300">
      <h2 className="text-xl font-bold text-forest-deep mb-6">Break-Even Analysis</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="col-span-1 md:col-span-2 bg-white rounded-2xl border border-premium-border p-8 shadow-sm flex flex-col items-center justify-center text-center">
          <p className="text-sm font-bold text-ink-soft mb-2">Monthly Break-Even Units</p>
          <p className="text-6xl font-bold font-display text-[#6366f1] mb-2">{Math.round(data.break_even_units)}</p>
          <p className="text-sm text-ink-soft mb-6">units / customers per month</p>
          <div className="w-full bg-gray-100 rounded-full h-4 mb-2">
            <div className="bg-[#6366f1] h-4 rounded-full transition-all" style={{ width: `${pct}%` }} />
          </div>
          <p className="text-xs text-ink-soft">{pct}% capacity utilization needed</p>
        </div>
        <div className="flex flex-col gap-4">
          <div className="bg-[#eff6ff] border border-[#bfdbfe] rounded-2xl p-5">
            <p className="text-xs font-bold text-[#2563eb] mb-1">Per Working Day</p>
            <p className="text-3xl font-bold text-[#2563eb]">{dailyUnits}</p>
            <p className="text-xs text-ink-soft mt-1">units/customers/day</p>
          </div>
          <div className="bg-white border border-premium-border rounded-2xl p-5">
            <p className="text-xs font-bold text-ink-soft mb-1">Fixed Costs / Month</p>
            <p className="text-2xl font-bold text-ink">{fmt(data.monthly_opex * 0.35)}</p>
          </div>
          <div className="bg-white border border-premium-border rounded-2xl p-5">
            <p className="text-xs font-bold text-ink-soft mb-1">Variable Cost / Unit</p>
            <p className="text-2xl font-bold text-ink">~₹60</p>
          </div>
        </div>
      </div>
      <div className="bg-[#f9f8f5] border border-premium-border rounded-2xl p-5">
        <div className="flex items-start">
          <Info size={16} className="text-[#6366f1] mr-2 mt-0.5 shrink-0" />
          <p className="text-sm text-ink-soft leading-relaxed">
            Once you cross <strong className="text-ink">{Math.round(data.break_even_units)} units/month</strong>, every additional sale becomes pure profit.
            Focus your first 3 months on reaching this milestone through local marketing and word-of-mouth.
          </p>
        </div>
      </div>
    </div>
  );
};

// ─── Loan & Monthly Installment Tab ───────────────────────────────────────────────────────────

const LoanTab = ({ data }: { data: FinanceResponse }) => {
  const scheme = data.scheme as any;
  const totalPayable = data.emi * (data.tenure_months - data.moratorium_months);
  const totalInterest = totalPayable - data.loan_amount;

  // Simple amortization — first 6 months
  const amortRows = Array.from({ length: 6 }, (_, i) => {
    const remaining = data.loan_amount * (1 - (i / (data.tenure_months - data.moratorium_months)));
    const interest = remaining * ((data.rate / 100) / 12);
    const principal = data.emi - interest;
    return { month: `Month ${i + 1 + data.moratorium_months}`, emi: data.emi, interest: Math.round(interest), principal: Math.round(principal), balance: Math.round(remaining - principal) };
  });

  return (
    <div className="animate-in fade-in duration-300">
      <h2 className="text-xl font-bold text-forest-deep mb-6">Loan & Monthly Installment Details</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <SummaryCard label="Loan Amount" value={fmt(data.loan_amount)} icon={CreditCard} color="text-[#2563eb]" />
        <SummaryCard label="Interest Rate" value={`${data.rate}%`} sub="Per annum" icon={TrendingUp} color="text-[#ea580c]" />
        <SummaryCard label="Monthly Monthly Installment" value={fmtFull(data.emi)} sub={`For ${data.tenure_months - data.moratorium_months} months`} icon={Clock} color="text-ink" />
        <SummaryCard label="Total Interest" value={fmt(totalInterest)} sub="Total cost of credit" icon={IndianRupee} color="text-red-500" />
      </div>

      <div className="bg-white rounded-2xl border border-premium-border shadow-sm overflow-hidden">
        <div className="px-6 py-4 bg-[#f9f8f5] border-b border-premium-border">
          <h3 className="font-bold text-forest-deep">Monthly Installment Amortization (First 6 Months)</h3>
        </div>
        <div className="overflow-x-auto">
        <table className="w-full text-sm">
            <thead className="bg-[#f9f8f5]">
              <tr className="text-xs font-bold text-ink-soft border-b border-premium-border">
                <th className="px-4 py-3 text-left">Period</th>
                <th className="px-4 py-3 text-right">Monthly Installment</th>
                <th className="px-4 py-3 text-right hidden sm:table-cell">Interest</th>
                <th className="px-4 py-3 text-right hidden sm:table-cell">Principal</th>
                <th className="px-4 py-3 text-right">Balance</th>
              </tr>
            </thead>
            <tbody>
              {amortRows.map((row, i) => (
                <tr key={i} className="border-b border-premium-border/50 hover:bg-[#f9f8f5]">
                  <td className="px-4 py-3 font-medium text-xs">{row.month}</td>
                  <td className="px-4 py-3 text-right font-bold text-ink">{fmtFull(row.emi)}</td>
                  <td className="px-4 py-3 text-right text-red-500 hidden sm:table-cell">{fmtFull(row.interest)}</td>
                  <td className="px-4 py-3 text-right text-[#16a34a] hidden sm:table-cell">{fmtFull(row.principal)}</td>
                  <td className="px-4 py-3 text-right text-ink-soft">{fmtFull(row.balance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-3 text-xs text-ink-soft bg-[#f9f8f5] border-t border-premium-border">
          {data.moratorium_months > 0 && `⏸ Moratorium period: ${data.moratorium_months} months (no Monthly Installment). `}
          Monthly Installment payments start from Month {data.moratorium_months + 1}.
        </div>
      </div>
    </div>
  );
};

// ─── Working Capital Tab ──────────────────────────────────────────────────────

const WorkingCapitalTab = ({ data }: { data: FinanceResponse }) => {
  const wc = data.working_capital;
  if (!wc) return <p className="text-ink-soft">Working capital data not available.</p>;

  const isBufferOk = data.beneficiary_contribution >= wc.monthly_working_capital;

  return (
    <div className="animate-in fade-in duration-300">
      <h2 className="text-xl font-bold text-forest-deep mb-6">Working Capital Requirement</h2>
      
      <div className={`rounded-2xl border p-5 mb-6 flex items-start gap-4 ${isBufferOk ? "bg-[#f0fdf4] border-[#bbf7d0]" : "bg-[#fff7ed] border-[#fed7aa]"}`}>
        {isBufferOk ? <CheckCircle className="text-[#16a34a] shrink-0 mt-0.5" size={20} /> : <AlertTriangle className="text-[#ea580c] shrink-0 mt-0.5" size={20} />}
        <div>
          <p className={`font-bold mb-1 ${isBufferOk ? "text-[#16a34a]" : "text-[#ea580c]"}`}>
            {isBufferOk ? "Working Capital is Sufficient" : "Working Capital Warning"}
          </p>
          <p className="text-sm text-ink-soft">
            {isBufferOk
              ? `Your contribution (${fmt(data.beneficiary_contribution)}) comfortably covers the monthly working capital need (${fmt(wc.monthly_working_capital)}).`
              : `Your contribution (${fmt(data.beneficiary_contribution)}) may not fully cover working capital needs (${fmt(wc.monthly_working_capital)}). Consider negotiating extended payment terms with suppliers.`}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <SummaryCard label="Daily Cash Needed" value={fmtFull(wc.daily_cash_needed)} sub="Operating float" icon={IndianRupee} color="text-ink" />
        <SummaryCard label="Weekly Cash Needed" value={fmtFull(wc.weekly_cash_needed)} sub="Weekly float" icon={IndianRupee} color="text-ink" />
        <SummaryCard label="Net Working Capital" value={fmt(wc.monthly_working_capital)} sub="Monthly WC requirement" icon={Wallet} color="text-[#2563eb]" />
        <SummaryCard label="Inventory Held" value={fmt(wc.inventory_requirement)} sub={`${wc.inventory_days} days of stock`} icon={BarChart3} color="text-ink" />
        <SummaryCard label="Receivables" value={fmt(wc.receivables)} sub={`Collect within ${wc.receivable_days} days`} icon={TrendingUp} color="text-[#ea580c]" />
        <SummaryCard label="Payables" value={fmt(wc.payables)} sub={`Pay within ${wc.payable_days} days`} icon={TrendingDown} color="text-[#16a34a]" />
      </div>

      <div className="bg-white rounded-2xl border border-premium-border p-5 shadow-sm">
        <div className="flex items-center mb-3">
          <Info size={16} className="text-[#6366f1] mr-2" />
          <h3 className="font-bold text-ink">Recommended Safety Buffer</h3>
        </div>
        <div className="text-3xl font-bold text-[#6366f1] mb-2">{fmt(wc.recommended_buffer)}</div>
        <p className="text-sm text-ink-soft">Keep this as emergency working capital reserve. Do not invest it all in stock on Day 1.</p>
      </div>
    </div>
  );
};

// ─── Revenue Scenarios Tab ────────────────────────────────────────────────────

const ScenariosTab = ({ data }: { data: FinanceResponse }) => {
  const s = data.revenue_scenarios;
  if (!s || !s.pessimistic) return <p className="text-ink-soft">Scenario data not available.</p>;

  const scenarios = [
    { key: "pessimistic", label: "Pessimistic", desc: "60% capacity utilization — slow start, low demand", color: "text-red-500", bg: "bg-[#fff1f2]", border: "border-[#fecdd3]", icon: TrendingDown },
    { key: "realistic",   label: "Realistic",   desc: "100% capacity — steady, expected performance",  color: "text-[#ea580c]", bg: "bg-[#fff7ed]", border: "border-[#fed7aa]", icon: Target },
    { key: "optimistic",  label: "Optimistic",  desc: "130% capacity — strong demand, effective marketing", color: "text-[#16a34a]", bg: "bg-[#f0fdf4]", border: "border-[#bbf7d0]", icon: TrendingUp },
  ];

  return (
    <div className="animate-in fade-in duration-300">
      <h2 className="text-xl font-bold text-forest-deep mb-2">Revenue Scenarios</h2>
      <p className="text-sm text-ink-soft mb-6">Three projections based on different market capture rates.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {scenarios.map(({ key, label, desc, color, bg, border, icon: Icon }) => {
          const sc = (s as any)[key];
          return (
            <div key={key} className={`${bg} border ${border} rounded-2xl p-6`}>
              <div className="flex items-center mb-3">
                <Icon size={18} className={`${color} mr-2`} />
                <h3 className={`font-bold ${color}`}>{label}</h3>
              </div>
              <p className="text-xs text-ink-soft mb-4 leading-relaxed">{desc}</p>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-xs text-ink-soft">Monthly Revenue</span>
                  <span className="text-sm font-bold text-ink">{fmt(sc.monthly_revenue)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-ink-soft">Monthly Expenses</span>
                  <span className="text-sm font-bold text-ink">{fmt(sc.monthly_opex)}</span>
                </div>
                <div className="flex justify-between border-t border-black/10 pt-2">
                  <span className="text-xs font-bold text-ink-soft">Net Profit / Month</span>
                  <span className={`text-sm font-bold ${sc.monthly_net_profit >= 0 ? color : "text-red-500"}`}>{fmt(sc.monthly_net_profit)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-ink-soft">Annual Net Profit</span>
                  <span className={`text-sm font-bold ${color}`}>{fmt(sc.annual_net_profit)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-ink-soft">Return on Investment</span>
                  <span className={`text-sm font-bold ${color}`}>{sc.roi_pct}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-ink-soft">Payback Period</span>
                  <span className="text-sm font-bold text-ink">{sc.payback_months ? `${sc.payback_months} months` : "N/A"}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {data.payback_period && (
        <div className="bg-gradient-to-br from-[#6366f1] to-[#4f46e5] text-white rounded-2xl p-6">
          <p className="text-sm font-bold text-white/70 mb-1">Realistic Payback Period</p>
          <p className="text-4xl font-bold font-display mb-2">
            {data.payback_period.payback_months ? `${data.payback_period.payback_months} months` : "50+ months"}
          </p>
          <p className="text-sm text-white/80">{data.payback_period.note}</p>
        </div>
      )}
    </div>
  );
};

// ─── Seasonal Forecast Tab ────────────────────────────────────────────────────

const SeasonalTab = ({ data }: { data: FinanceResponse }) => {
  const seasonal = data.seasonal_revenue;
  if (!seasonal || seasonal.length === 0) return <p className="text-ink-soft">Seasonal data not available.</p>;

  const maxRev = Math.max(...seasonal.map(m => m.revenue));
  const minRev = Math.min(...seasonal.map(m => m.revenue));

  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-forest-deep">Seasonal Revenue Forecast</h2>
          <p className="text-sm text-ink-soft mt-1">12-month demand variation based on your business category</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-ink-soft">Peak Revenue</p>
          <p className="font-bold text-[#16a34a]">{fmt(maxRev)}</p>
          <p className="text-xs text-ink-soft mt-1">Lowest Revenue</p>
          <p className="font-bold text-[#ea580c]">{fmt(minRev)}</p>
        </div>
      </div>

      <SeasonalChart data={seasonal} maxRev={maxRev} minRev={minRev} />

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
        {seasonal.map((m) => (
          <div
            key={m.month}
            className={`rounded-xl p-3 text-center border ${m.revenue === maxRev ? "bg-[#f0fdf4] border-[#bbf7d0]" : m.revenue === minRev ? "bg-[#fff1f2] border-[#fecdd3]" : "bg-white border-premium-border"}`}
          >
            <p className="text-xs font-bold text-ink-soft">{m.month}</p>
            <p className="text-sm font-bold text-ink mt-1">{fmt(m.revenue)}</p>
            <p className={`text-xs font-bold mt-0.5 ${m.index >= 1.1 ? "text-[#16a34a]" : m.index <= 0.9 ? "text-red-500" : "text-ink-soft"}`}>
              {m.index >= 1.0 ? "+" : ""}{Math.round((m.index - 1) * 100)}%
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function FinancialsPage() {
  const { analysisResult } = useStore();
  const [activeTab, setActiveTab] = useState("overview");

  if (!analysisResult || !analysisResult.financials) {
    return (
      <div className="min-h-screen bg-[#fcfbf8] flex flex-col items-center justify-center p-8 text-center">
        <AlertTriangle className="text-red-500 mb-4" size={48} />
        <h2 className="text-xl font-bold text-ink mb-2">Financial Analysis Not Found</h2>
        <p className="text-ink-soft mb-6">No session data found. Please complete onboarding first.</p>
        <a href="/" className="px-5 py-2.5 bg-forest text-white rounded-xl font-bold flex items-center gap-2">
          Start Over <ArrowRight size={16} />
        </a>
      </div>
    );
  }

  // Extract financial properties directly from the unified analysis response
  // We need to shape it to match what the UI expects, since UI expects FinanceResponse format
  const { financials } = analysisResult;
  
  // Transform or provide fallbacks if unified response differs from legacy FinanceResponse
  const data: any = {
    project_cost: financials.project_cost,
    loan_amount: financials.loan_amount,
    beneficiary_contribution: financials.user_capital,
    emi: financials.emi,
    rate: 10,
    tenure_months: 60,
    moratorium_months: 0,
    monthly_revenue: financials.monthly_revenue_target,
    monthly_opex: financials.monthly_opex,
    net_profit: financials.net_profit,
    roi: financials.roi_pct,
    dscr: financials.dscr,
    break_even_units: 500, // placeholder if not in unified response
    scheme: {
      scheme_name: "Standard Business Loan",
      explanation: "General SME financing based on typical market rates.",
      source_url: ""
    },
    cashflow_projection: [],
    pnl_statement: {
      revenue: financials.monthly_revenue_target,
      cogs: financials.monthly_revenue_target * (1 - (financials.gross_margin_pct / 100)),
      gross_profit: financials.monthly_revenue_target * (financials.gross_margin_pct / 100),
      operating_expenses: financials.monthly_opex,
      ebit: financials.net_profit + financials.emi,
      tax: 0,
      net_profit: financials.net_profit,
      gross_margin_pct: financials.gross_margin_pct,
      net_margin_pct: Math.round((financials.net_profit / financials.monthly_revenue_target) * 100) || 0
    },
    working_capital: {
      monthly_working_capital: financials.monthly_opex,
      daily_cash_needed: financials.monthly_opex / 30,
      weekly_cash_needed: financials.monthly_opex / 4,
      inventory_requirement: 0,
      inventory_days: 15,
      receivables: 0,
      receivable_days: 0,
      payables: 0,
      payable_days: 0,
      recommended_buffer: financials.monthly_opex * 2
    },
    revenue_scenarios: null,
    seasonal_revenue: []
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-6 pb-24 bg-[#fcfbf8] min-h-screen">
      {/* Page Header */}
      <div className="mb-8 border-b border-premium-border pb-6">
        <h1 className="text-[32px] font-bold text-forest-deep tracking-tight mb-1">Financial Analysis</h1>
        <p className="text-ink-soft font-medium">
          Complete financial model for your business — projections, Monthly Installment, P&L, and more.
        </p>
      </div>

      {/* Tab Bar — wraps to two rows on smaller screens */}
      <div className="flex flex-wrap gap-1 border-b border-premium-border mb-8 pb-0">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-bold whitespace-nowrap rounded-t-lg border-b-2 transition-all mb-[-1px] ${
              activeTab === key
                ? "border-[#ea580c] text-[#ea580c] bg-[#fff5f0]"
                : "border-transparent text-ink-soft hover:text-ink hover:bg-black/5"
            }`}
          >
            <Icon size={13} />
            {label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "overview"  && <OverviewTab data={data} />}
        {activeTab === "cashflow"  && <CashFlowTab data={data} />}
        {activeTab === "pnl"       && <PnlTab data={data} />}
        {activeTab === "breakeven" && <BreakEvenTab data={data} />}
        {activeTab === "loan"      && <LoanTab data={data} />}
        {activeTab === "working"   && <WorkingCapitalTab data={data} />}
        {activeTab === "scenarios" && <ScenariosTab data={data} />}
        {activeTab === "seasonal"  && <SeasonalTab data={data} />}
      </div>
    </div>
  );
}

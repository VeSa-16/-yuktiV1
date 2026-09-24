import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GitCommit, AlertCircle, FileSearch, HelpCircle, ShieldCheck } from "lucide-react";
import { EvidenceDrawer, EvidenceRecord } from "./EvidenceDrawer";

interface Props {
  verdict: string;
  dimensionScores: Record<string, number>;
  evidenceList: EvidenceRecord[];
  confidence: string;
  isAbstained: boolean;
}

const DIMENSION_META: Record<string, string> = {
  financial_viability: "Financial Viability",
  repayment_capacity: "Repayment Capacity",
  market_opportunity: "Market Opportunity",
  capital_efficiency: "Capital Efficiency",
  risk_exposure: "Risk Exposure",
};

export function DecisionTrace({ verdict, dimensionScores, evidenceList, confidence, isAbstained }: Props) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <Card className="border-warm-border shadow-sm bg-warm-surface rounded-2xl overflow-hidden mt-6">
      <CardHeader className="bg-warm-bg/50 pb-3 border-b border-warm-border">
        <CardTitle className="text-sm font-bold text-warm-text uppercase tracking-wider flex items-center gap-2">
          <GitCommit size={16} className="text-warm-primary" />
          Decision Trace — Why this result?
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="relative border-l-2 border-slate-200 ml-4 space-y-8 pb-4">
          {/* Step 1: Recommendation */}
          <div className="relative pl-6">
            <div className="absolute -left-[11px] top-1 bg-white border-2 border-blue-500 rounded-full p-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
            </div>
            <div className="font-bold text-sm text-warm-muted uppercase mb-1 flex items-center gap-2">
              <AlertCircle size={14} /> Recommendation
            </div>
            <div className="text-lg font-bold text-ink">
              {isAbstained ? "Abstained (Insufficient Data)" : verdict}
            </div>
          </div>

          {/* Step 2: Key Drivers */}
          <div className="relative pl-6">
            <div className="absolute -left-[11px] top-1 bg-white border-2 border-emerald-500 rounded-full p-1">
              <div className="w-2 h-2 bg-emerald-500 rounded-full" />
            </div>
            <div className="font-bold text-sm text-warm-muted uppercase mb-1 flex items-center gap-2">
              <TrendingUpIcon size={14} /> Key Drivers
            </div>
            <div className="space-y-2 mt-2">
              {Object.entries(dimensionScores).map(([key, value]) => {
                const label = DIMENSION_META[key] || key;
                return (
                  <div key={key} className="flex justify-between items-center text-sm border-b border-slate-100 pb-1">
                    <span className="text-slate-600 font-medium">{label}</span>
                    <span className="font-bold text-slate-800">{value.toFixed(0)} / 100</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 3: Linked Evidence */}
          <div className="relative pl-6">
            <div className="absolute -left-[11px] top-1 bg-white border-2 border-amber-500 rounded-full p-1">
              <div className="w-2 h-2 bg-amber-500 rounded-full" />
            </div>
            <div className="font-bold text-sm text-warm-muted uppercase mb-1 flex items-center gap-2">
              <FileSearch size={14} /> Linked Evidence
            </div>
            <div className="text-sm text-slate-600 mb-2">
              This score was generated using {evidenceList.length} localized data points.
            </div>
            <button 
              onClick={() => setDrawerOpen(true)}
              className="text-xs px-3 py-1.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg font-bold hover:bg-amber-100 transition-colors"
            >
              View Evidence Payload
            </button>
          </div>

          {/* Step 4: Assumptions */}
          <div className="relative pl-6">
            <div className="absolute -left-[11px] top-1 bg-white border-2 border-purple-500 rounded-full p-1">
              <div className="w-2 h-2 bg-purple-500 rounded-full" />
            </div>
            <div className="font-bold text-sm text-warm-muted uppercase mb-1 flex items-center gap-2">
              <HelpCircle size={14} /> Standard Assumptions
            </div>
            <ul className="list-disc pl-4 text-sm text-slate-600 space-y-1">
              <li>10% Beneficiary Contribution (Margin Money).</li>
              <li>Calculated using standard 5-year loan term at typical rates.</li>
              <li>Assumes 100% capacity utilization in realistic scenario.</li>
            </ul>
          </div>

          {/* Step 5: Confidence */}
          <div className="relative pl-6">
            <div className="absolute -left-[11px] top-1 bg-white border-2 border-slate-700 rounded-full p-1">
              <div className="w-2 h-2 bg-slate-700 rounded-full" />
            </div>
            <div className="font-bold text-sm text-warm-muted uppercase mb-1 flex items-center gap-2">
              <ShieldCheck size={14} /> Confidence Level
            </div>
            <div className="text-sm font-bold text-slate-800">
              {confidence}
            </div>
          </div>
        </div>
      </CardContent>
      <EvidenceDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} evidenceList={evidenceList} />
    </Card>
  );
}

function TrendingUpIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  );
}

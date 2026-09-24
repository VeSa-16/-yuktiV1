import React, { useState } from "react";
import { EvidenceDrawer, EvidenceRecord } from "./EvidenceDrawer";
import { ShieldCheck, ShieldAlert, ShieldQuestion } from "lucide-react";

interface Props {
  score?: number | null;
  size?: number;
  label?: string;
  animate?: boolean;
  evidenceList?: EvidenceRecord[];
  coveragePct?: number;
  confidence?: "HIGH" | "MEDIUM" | "LOW";
  isAbstained?: boolean;
}

export function ScoreDial({ 
  score, 
  size = 120, 
  label = "YuktiFi Score", 
  animate = true,
  evidenceList = [],
  coveragePct = 0,
  confidence = "LOW",
  isAbstained = false
}: Props) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const strokeWidth = size * 0.08;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const displayScore = score ?? 0;
  const strokeDashoffset = isAbstained ? circumference : circumference - (displayScore / 100) * circumference;

  let color = "text-warm-secondary";
  if (!isAbstained) {
    if (displayScore < 50) color = "text-red-600";
    else if (displayScore < 75) color = "text-orange-500";
    else color = "text-emerald-600";
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="w-full h-full transform -rotate-90" viewBox={`0 0 ${size} ${size}`}>
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-warm-border"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="square"
            className={`${color} ${animate ? "transition-all duration-1000 ease-out" : ""}`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          {isAbstained ? (
            <span className="text-xl font-sans font-bold text-slate-500">N/A</span>
          ) : (
            <span className={`text-3xl font-sans font-bold ${color}`}>{Math.round(displayScore)}</span>
          )}
        </div>
      </div>
      
      {label && <span className="mt-2 text-[10px] font-sans text-warm-muted tracking-widest uppercase">{label}</span>}

      {/* Honest abstention / Evidence Badge */}
      <div className="mt-4 flex flex-col items-center gap-2">
        {isAbstained ? (
          <div className="text-center p-4 bg-amber-50 border-2 border-amber-200 rounded-lg max-w-sm transform transition-all shadow-sm">
            <ShieldQuestion className="w-8 h-8 text-amber-500 mx-auto mb-2" />
            <div className="text-base font-bold text-amber-900">Insufficient local evidence</div>
            <div className="text-sm font-semibold text-amber-700 mt-1">
              — declining a high-confidence score —
            </div>
            <div className="text-xs text-amber-600/80 mt-2">
              Coverage is {Math.round(coveragePct)}%. YUKTI refuses to guess when data is sparse.
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs font-medium bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
            <span>Coverage: {Math.round(coveragePct)}%</span>
            <span className="text-slate-300">|</span>
            <span className={`flex items-center gap-1 ${confidence === 'HIGH' ? 'text-emerald-600' : confidence === 'MEDIUM' ? 'text-amber-600' : 'text-red-600'}`}>
              {confidence === 'HIGH' && <ShieldCheck className="w-3 h-3" />}
              {confidence === 'MEDIUM' && <ShieldAlert className="w-3 h-3" />}
              {confidence === 'LOW' && <ShieldQuestion className="w-3 h-3" />}
              {confidence}
            </span>
          </div>
        )}

        {evidenceList.length > 0 && (
          <button 
            onClick={() => setDrawerOpen(true)}
            className="text-xs text-blue-600 hover:underline font-medium"
          >
            View evidence
          </button>
        )}
      </div>

      <EvidenceDrawer 
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        evidenceList={evidenceList}
      />
    </div>
  );
}


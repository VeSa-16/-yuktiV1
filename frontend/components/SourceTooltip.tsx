import React, { useState } from "react";
import { Info } from "lucide-react";

interface Props {
  source: string;
  confidence: string;
}

export function SourceTooltip({ source, confidence }: Props) {
  const [show, setShow] = useState(false);
  
  const getConfidenceColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "high": return "text-emerald-600";
      case "medium": return "text-amber-500";
      case "low": return "text-red-500";
      default: return "text-slate-500";
    }
  };

  return (
    <div className="relative inline-block" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      <Info size={14} className="text-slate-400 cursor-help inline ml-1" />
      {show && (
        <div className="absolute z-50 w-64 p-3 mt-1 bg-white border border-slate-200 rounded shadow-lg text-sm right-0 sm:left-1/2 sm:-translate-x-1/2">
          <p className="mb-1"><span className="font-semibold">Source:</span> {source}</p>
          <p><span className="font-semibold">Confidence:</span> <span className={`font-medium ${getConfidenceColor(confidence)}`}>{confidence}</span></p>
        </div>
      )}
    </div>
  );
}

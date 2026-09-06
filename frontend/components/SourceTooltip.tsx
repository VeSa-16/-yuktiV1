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
      case "high": return "text-terminal-green";
      case "medium": return "text-terminal-amber";
      case "low": return "text-terminal-red";
      default: return "text-terminal-cyan";
    }
  };

  return (
    <div className="relative inline-block" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      <Info size={14} className="text-zinc-500 hover:text-terminal-cyan transition-colors cursor-help inline ml-1" />
      {show && (
        <div className="absolute z-50 w-64 p-3 mt-2 bg-black border border-zinc-700 shadow-[0_0_15px_rgba(0,0,0,0.5)] text-[10px] right-0 sm:left-1/2 sm:-translate-x-1/2 font-mono uppercase tracking-widest leading-relaxed">
          <div className="flex flex-col space-y-2">
            <div>
              <span className="text-zinc-500 block mb-0.5">DATA_SOURCE_ORIGIN</span>
              <span className="text-white">{source}</span>
            </div>
            <div className="pt-2 border-t border-zinc-800">
              <span className="text-zinc-500 block mb-0.5">CONFIDENCE_LEVEL</span>
              <span className={`font-bold ${getConfidenceColor(confidence)}`}>[{confidence}]</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

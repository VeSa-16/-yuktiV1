"use client";
import React, { useEffect, useState } from "react";
import { CheckCircle2, Circle } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const steps = [
  { id: "profile", name: "Profile", href: "/" },
  { id: "capital", name: "Capital", href: "/capital" },
  { id: "results", name: "Opportunities", href: "/results" },
  { id: "simulator", name: "Simulator", href: "/simulator" },
];

export function ProgressStepper() {
  const pathname = usePathname();
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  useEffect(() => {
    const idx = steps.findIndex((s) => s.href === pathname);
    if (idx !== -1) {
      setCurrentStepIdx(idx);
    } else if (pathname?.startsWith("/category/") || pathname?.startsWith("/score/")) {
      setCurrentStepIdx(2); // Keep them conceptually at step 3
    }
  }, [pathname]);

  return (
    <div className="w-full py-4 mb-6">
      <div className="flex items-center justify-between relative">
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-0.5 bg-zinc-800 z-0"></div>
        <div 
          className="absolute left-0 top-1/2 transform -translate-y-1/2 h-0.5 bg-terminal-cyan z-0 transition-all duration-300" 
          style={{ width: `${(currentStepIdx / (steps.length - 1)) * 100}%` }}
        ></div>
        
        {steps.map((step, idx) => {
          const isCompleted = idx < currentStepIdx;
          const isCurrent = idx === currentStepIdx;
          
          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center bg-black px-2">
              <Link href={isCompleted ? step.href : "#"} className={`flex items-center justify-center w-6 h-6 rounded-none border ${
                isCompleted ? "bg-terminal-cyan border-terminal-cyan text-black" : isCurrent ? "bg-black border-terminal-cyan text-terminal-cyan ring-2 ring-terminal-cyan/20" : "bg-black border-zinc-700 text-zinc-700"
              }`}>
                {isCompleted ? <CheckCircle2 size={12} /> : <span className="text-xs font-bold font-mono">{idx + 1}</span>}
              </Link>
              <span className={`mt-2 text-[10px] font-bold tracking-widest uppercase ${isCurrent ? "text-terminal-cyan" : isCompleted ? "text-terminal-text" : "text-zinc-600"}`}>
                {step.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

import React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, helperText, className, ...props }, ref) => {
    return (
      <div className="flex flex-col space-y-1">
        {label && <label className="text-xs font-bold uppercase tracking-wider text-terminal-amber">{label}</label>}
        <input
          ref={ref}
          className={cn(
            "rounded-none border border-zinc-700 bg-black px-3 py-2 text-terminal-text font-mono transition-all duration-100 focus:outline-none focus:border-terminal-cyan focus:ring-1 focus:ring-terminal-cyan disabled:opacity-50",
            className
          )}
          {...props}
        />
        {helperText && <p className="text-xs font-mono text-zinc-500">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

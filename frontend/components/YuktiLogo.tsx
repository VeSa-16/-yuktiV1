import React from 'react';

export function YuktiLogo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <g transform="translate(5, 5) scale(0.9)">
        {/* Left Arm */}
        <path d="M 15 25 Q 25 25 37 30 L 52 50 L 37 62 Q 22 40 15 25 Z" fill="#1e293b" />
        
        {/* Bottom Stem */}
        <path d="M 28 92 L 50 92 Q 55 78 59 64 L 42 77 Q 35 86 28 92 Z" fill="#1e293b" />
        
        {/* Right Sweeping Arm (Swoosh) */}
        <path d="M 30 84 C 45 60 60 45 77 35 L 67 29 C 48 42 38 60 30 84 Z" fill="#1e293b" />
        
        {/* Arrow Head - Left Side (Lighter Orange) */}
        <polygon points="82,15 63,30 73,34" fill="#ea580c" />
        
        {/* Arrow Head - Right Side (Darker Orange) */}
        <polygon points="82,15 73,34 83,39" fill="#c2410c" />
      </g>
    </svg>
  );
}

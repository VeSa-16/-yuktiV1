"use client";

import React from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from "recharts";

interface MarketRadarProps {
  data: {
    subject: string;
    A: number;
    fullMark: number;
  }[];
}

export function MarketRadar({ data }: MarketRadarProps) {
  return (
    <div className="h-[300px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke="#27272a" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#cccccc', fontSize: 10, fontFamily: 'monospace' }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Tooltip 
            contentStyle={{ borderRadius: '0', border: '1px solid #3f3f46', backgroundColor: '#000000', color: '#ffffff', fontFamily: 'monospace', fontSize: '10px', textTransform: 'uppercase' }}
            itemStyle={{ fontFamily: 'monospace', fontSize: '10px' }}
          />
          <Radar name="Market Potential" dataKey="A" stroke="#00ffff" strokeWidth={2} fill="#00ffff" fillOpacity={0.2} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

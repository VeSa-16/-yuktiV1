"use client";
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/lib/api-client';
import { useStore } from '@/lib/store';
import { Trophy, TrendingUp, Users } from 'lucide-react';
import { motion } from 'framer-motion';

export function PeerBenchmark() {
  const { categoryName, locationName, analysisResult } = useStore();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBenchmark = async () => {
      if (!analysisResult) return;
      try {
        const res = await api.getPeerBenchmarks({
          category_name: categoryName || "Business",
          district: locationName || "District",
          yukti_score: analysisResult.scores?.overall || 50
        });
        setData(res);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };
    fetchBenchmark();
  }, [analysisResult, categoryName, locationName]);

  if (loading || !data) return null;

  const isAboveAvg = data.user_score >= data.average_score;

  return (
    <Card className="border-t-4 border-t-warm-primary overflow-hidden">
      <CardHeader className="bg-warm-surface border-b border-warm-border pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <Users size={20} className="text-warm-primary" />
          Local Peer Benchmarking
        </CardTitle>
        <p className="text-xs text-warm-muted mt-1">
          Comparing against {data.peer_group_size} similar {data.category} businesses in {data.district}
        </p>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-2 divide-x divide-warm-border border-b border-warm-border">
          <div className="p-6 text-center">
            <div className="text-xs uppercase tracking-widest text-warm-muted mb-2 font-bold">District Average</div>
            <div className="text-3xl font-black text-warm-text/50">{data.average_score}</div>
          </div>
          <div className="p-6 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-terminal-cyan to-transparent opacity-50"></div>
            <div className="text-xs uppercase tracking-widest text-warm-primary mb-2 font-bold">Your Score</div>
            <div className="text-4xl font-black text-warm-primary flex items-center justify-center gap-2">
              {data.user_score}
              {isAboveAvg && <Trophy size={20} className="text-emerald-500" />}
            </div>
            <div className="text-[10px] mt-2 text-emerald-600 font-bold bg-emerald-50 inline-block px-2 py-1 rounded">
              Top {100 - data.percentile}% of applicants
            </div>
          </div>
        </div>
        
        <div className="p-6 bg-warm-bg/50">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={16} className="text-terminal-cyan" />
            <span className="text-sm font-bold uppercase tracking-wider">Top Practices in your peer group</span>
          </div>
          <ul className="space-y-3">
            {data.top_practices.map((practice: string, i: number) => (
              <li key={i} className="flex items-start gap-2 text-sm text-warm-text/90">
                <span className="shrink-0 w-5 h-5 rounded-full bg-terminal-cyan/20 text-terminal-cyan flex items-center justify-center text-xs font-bold">{i+1}</span>
                {practice}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

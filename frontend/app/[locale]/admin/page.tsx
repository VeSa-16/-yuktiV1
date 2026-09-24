"use client";
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, TrendingUp, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminSCAView() {
  const mockProfiles = [
    { id: "APP-001", name: "Ramesh Patil", category: "Dairy Farming", district: "Solapur", score: 84, status: "Loan Ready", dscr: 1.45, requested: 250000 },
    { id: "APP-002", name: "Sunita Kamble", category: "Tailoring Unit", district: "Solapur", score: 72, status: "Review Required", dscr: 1.12, requested: 50000 },
    { id: "APP-003", name: "Vijay Mane", category: "Flour Mill", district: "Solapur", score: 45, status: "High Risk", dscr: 0.85, requested: 400000 },
  ];

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 text-warm-text animate-in fade-in duration-500">
      <div className="mb-8 mt-6 border-b border-warm-border pb-6 flex items-end gap-4">
        <Users size={40} className="text-warm-primary" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">SCA Officer Dashboard</h1>
          <p className="text-warm-muted mt-2">State Channelizing Agency view for loan application triage.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-t-4 border-t-warm-primary">
          <CardHeader className="pb-2"><CardTitle className="text-sm text-warm-muted uppercase">Pending Applications</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-black">24</div></CardContent>
        </Card>
        <Card className="border-t-4 border-t-emerald-500">
          <CardHeader className="pb-2"><CardTitle className="text-sm text-warm-muted uppercase">Loan Ready (Score > 80)</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-black text-emerald-600">8</div></CardContent>
        </Card>
        <Card className="border-t-4 border-t-red-500">
          <CardHeader className="pb-2"><CardTitle className="text-sm text-warm-muted uppercase">High Risk (DSCR &lt; 1)</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-black text-red-600">5</div></CardContent>
        </Card>
      </div>

      <div className="bg-white rounded-xl border border-warm-border overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-warm-surface text-warm-muted uppercase tracking-wider text-xs border-b border-warm-border">
            <tr>
              <th className="px-6 py-4 font-bold">App ID</th>
              <th className="px-6 py-4 font-bold">Applicant</th>
              <th className="px-6 py-4 font-bold">Business Type</th>
              <th className="px-6 py-4 font-bold">Requested (₹)</th>
              <th className="px-6 py-4 font-bold">Yukti Score</th>
              <th className="px-6 py-4 font-bold">Projected DSCR</th>
              <th className="px-6 py-4 font-bold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-warm-border">
            {mockProfiles.map((p) => (
              <tr key={p.id} className="hover:bg-warm-bg transition-colors">
                <td className="px-6 py-4 font-bold">{p.id}</td>
                <td className="px-6 py-4">{p.name}</td>
                <td className="px-6 py-4">{p.category}</td>
                <td className="px-6 py-4">₹{p.requested.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded font-bold ${p.score >= 80 ? 'bg-emerald-100 text-emerald-800' : p.score >= 60 ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'}`}>
                    {p.score}
                  </span>
                </td>
                <td className="px-6 py-4 font-bold">{p.dscr}x</td>
                <td className="px-6 py-4"><Button variant="outline" size="sm">Review Report</Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

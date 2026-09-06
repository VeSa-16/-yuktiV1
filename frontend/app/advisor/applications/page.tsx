"use client";
import React from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Filter, ShieldCheck, Clock, CheckCircle2 } from 'lucide-react';
import { YuktiInsight } from '@/components/YuktiInsight';

const dummyApplications = [
  { id: "APP-001", name: "Rajesh Kumar", business: "Textile Manufacturing", location: "Nagpur Zone A", req: "₹15 Lakhs", score: 88, readiness: 100, status: "Ready for Review", time: "2 hrs ago" },
  { id: "APP-002", name: "Sunita Devi", business: "Organic Farming", location: "Pune Outskirts", req: "₹5 Lakhs", score: 92, readiness: 100, status: "Ready for Review", time: "5 hrs ago" },
  { id: "APP-003", name: "Amit Shah", business: "Retail Electronics", location: "Mumbai North", req: "₹25 Lakhs", score: 65, readiness: 60, status: "Missing Docs", time: "1 day ago" },
  { id: "APP-004", name: "Priya Patel", business: "IT Services", location: "Nashik Central", req: "₹10 Lakhs", score: 78, readiness: 85, status: "In Progress", time: "2 days ago" },
];

export default function ApplicationQueue() {
  const exportToCSV = () => {
    const headers = ["ID", "Name", "Business", "Location", "Capital Requested", "Score", "Readiness %", "Status", "Time"];
    const rows = dummyApplications.map(app => 
      [app.id, app.name, app.business, app.location, app.req, app.score, app.readiness, app.status, app.time].map(val => `"${val}"`).join(",")
    );
    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "yukti_applications_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-8 bg-black min-h-screen text-terminal-text font-mono animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-zinc-800 pb-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-widest text-white uppercase">Review Queue</h1>
          <p className="text-xs text-zinc-500 tracking-widest uppercase mt-2">Incoming Business Plans</p>
        </div>
        
        <div className="flex space-x-2 mt-4 md:mt-0">
          <div className="bg-zinc-900 border border-zinc-800 flex items-center px-3 py-1">
            <Search size={14} className="text-zinc-500 mr-2" />
            <input type="text" placeholder="SEARCH ID..." className="bg-transparent border-none outline-none text-xs text-white placeholder-zinc-700 w-32" />
          </div>
          <button 
            onClick={exportToCSV}
            className="bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 px-3 py-1 flex items-center text-xs transition-colors"
          >
            <Filter size={14} className="mr-2" /> EXPORT CSV
          </button>
        </div>
      </div>

      <YuktiInsight 
        type="positive"
        title="QUEUE STATUS"
        message="2 applications have achieved 100% readiness and passed the YUKTI viability threshold. They are ready for immediate officer review."
        className="mb-6"
      />

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900/50">
              <th className="p-4 text-[10px] text-zinc-500 uppercase tracking-widest font-normal">App ID</th>
              <th className="p-4 text-[10px] text-zinc-500 uppercase tracking-widest font-normal">Applicant & Business</th>
              <th className="p-4 text-[10px] text-zinc-500 uppercase tracking-widest font-normal">Capital Req</th>
              <th className="p-4 text-[10px] text-zinc-500 uppercase tracking-widest font-normal">YUKTI Score</th>
              <th className="p-4 text-[10px] text-zinc-500 uppercase tracking-widest font-normal">Readiness</th>
              <th className="p-4 text-[10px] text-zinc-500 uppercase tracking-widest font-normal">Status</th>
              <th className="p-4 text-[10px] text-zinc-500 uppercase tracking-widest font-normal">Action</th>
            </tr>
          </thead>
          <tbody>
            {dummyApplications.map((app, i) => (
              <tr key={i} className="border-b border-zinc-800 hover:bg-zinc-900/50 transition-colors group">
                <td className="p-4 font-bold text-xs text-terminal-cyan">{app.id}</td>
                <td className="p-4">
                  <div className="text-white font-bold text-sm">{app.name}</div>
                  <div className="text-xs text-zinc-500 mt-1">{app.business} // {app.location}</div>
                </td>
                <td className="p-4 text-sm">{app.req}</td>
                <td className="p-4">
                  <div className={`text-lg font-bold ${app.score > 80 ? 'text-terminal-green' : app.score > 70 ? 'text-terminal-amber' : 'text-terminal-red'}`}>
                    {app.score}
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold w-8">{app.readiness}%</span>
                    <div className="w-16 h-1 bg-zinc-800">
                      <div 
                        className={`h-full ${app.readiness === 100 ? 'bg-terminal-green' : 'bg-terminal-amber'}`} 
                        style={{ width: `${app.readiness}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center text-xs text-zinc-400">
                    {app.readiness === 100 ? (
                      <CheckCircle2 size={14} className="text-terminal-green mr-2" />
                    ) : (
                      <Clock size={14} className="text-terminal-amber mr-2" />
                    )}
                    {app.status}
                  </div>
                </td>
                <td className="p-4">
                  <Link 
                    href={`/advisor/applications/${app.id.toLowerCase()}`}
                    className={`px-4 py-2 text-xs font-bold rounded-none border transition-colors flex items-center justify-center w-28 ${
                      app.readiness === 100 
                        ? 'bg-terminal-cyan/10 border-terminal-cyan text-terminal-cyan hover:bg-terminal-cyan hover:text-black' 
                        : 'bg-zinc-900 border-zinc-700 text-zinc-500 hover:border-zinc-500'
                    }`}
                  >
                    <ShieldCheck size={14} className="mr-2" /> REVIEW
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

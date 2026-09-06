"use client";
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, FileText, Calendar, Filter, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

const MOCK_REPORTS = [
  { id: 1, name: "Q3 Maharashtra MSME Disbursement Analysis", date: "Oct 1, 2026", size: "2.4 MB", type: "PDF" },
  { id: 2, name: "Solapur Textile Cluster Risk Assessment", date: "Sep 15, 2026", size: "1.1 MB", type: "CSV" },
  { id: 3, name: "NSFDC Default Rate Projection 2027", date: "Sep 01, 2026", size: "3.8 MB", type: "PDF" },
  { id: 4, name: "Rural Women Entrepreneurship Impact", date: "Aug 20, 2026", size: "4.2 MB", type: "PDF" },
];

export default function ReportsPage() {
  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 animate-in fade-in duration-500 font-mono text-terminal-text">
      <div className="mb-8 mt-6 flex flex-col md:flex-row justify-between md:items-end">
        <div>
          <h1 className="text-3xl font-black tracking-widest text-white uppercase mb-2">Regional Reports</h1>
          <p className="text-zinc-500 uppercase tracking-widest text-sm">Aggregated data \ Impact analysis \ Export</p>
        </div>
        <button className="mt-4 md:mt-0 flex items-center bg-terminal-cyan hover:bg-terminal-cyan/80 text-black px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors">
          <Plus size={16} className="mr-2" /> Generate New Report
        </button>
      </div>

      <div className="flex space-x-4 mb-6">
        <div className="flex-1 relative">
          <input 
            type="text" 
            placeholder="Search reports by keyword..."
            className="w-full pl-4 pr-4 py-3 bg-black border border-zinc-800 text-white focus:outline-none focus:border-terminal-cyan transition-colors"
          />
        </div>
        <button className="flex items-center px-4 py-3 bg-zinc-900 border border-zinc-800 hover:border-terminal-amber transition-colors text-sm uppercase tracking-widest text-zinc-400">
          <Filter size={16} className="mr-2" /> Filter
        </button>
        <button className="flex items-center px-4 py-3 bg-zinc-900 border border-zinc-800 hover:border-terminal-amber transition-colors text-sm uppercase tracking-widest text-zinc-400">
          <Calendar size={16} className="mr-2" /> Date Range
        </button>
      </div>

      <Card className="bg-terminal-card border-terminal-border rounded-none shadow-2xl">
        <CardHeader className="border-b border-zinc-800">
          <CardTitle className="text-terminal-amber uppercase tracking-widest text-sm">Available Reports Archive</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-zinc-900 text-zinc-500 text-xs uppercase tracking-widest">
                <tr>
                  <th className="p-4 font-normal">Report Name</th>
                  <th className="p-4 font-normal">Date Generated</th>
                  <th className="p-4 font-normal">Format</th>
                  <th className="p-4 font-normal">Size</th>
                  <th className="p-4 font-normal text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800 text-sm">
                {MOCK_REPORTS.map((report, idx) => (
                  <motion.tr 
                    key={report.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="hover:bg-zinc-900/50 transition-colors group"
                  >
                    <td className="p-4 font-medium flex items-center">
                      <FileText size={16} className="mr-3 text-terminal-cyan" />
                      <span className="group-hover:text-terminal-cyan transition-colors">{report.name}</span>
                    </td>
                    <td className="p-4 text-zinc-400">{report.date}</td>
                    <td className="p-4">
                      <span className="bg-zinc-800 text-zinc-300 px-2 py-1 text-[10px] uppercase font-bold tracking-widest">
                        {report.type}
                      </span>
                    </td>
                    <td className="p-4 text-zinc-400">{report.size}</td>
                    <td className="p-4 text-right">
                      <button className="inline-flex items-center text-xs uppercase tracking-widest font-bold text-terminal-amber hover:text-white transition-colors">
                        <Download size={14} className="mr-1" /> Download
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

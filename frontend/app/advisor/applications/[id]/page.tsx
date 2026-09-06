"use client";
import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, CheckCircle2, ChevronLeft, FileText, Download, Target, TrendingUp, XCircle } from 'lucide-react';
import { YuktiInsight } from '@/components/YuktiInsight';

export default function ApplicationReview() {
  const params = useParams();
  const appId = params.id ? (params.id as string).toUpperCase() : 'APP-001';

  return (
    <div className="p-8 bg-black min-h-screen text-terminal-text font-mono animate-in fade-in duration-500">
      <Link href="/advisor/applications" className="inline-flex items-center text-xs text-zinc-500 hover:text-terminal-cyan mb-6 transition-colors">
        <ChevronLeft size={14} className="mr-1" /> BACK TO QUEUE
      </Link>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-zinc-800 pb-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-widest text-white uppercase">Application Review</h1>
          <p className="text-xs text-terminal-cyan tracking-widest uppercase mt-2 font-bold">ID: {appId} // Rajesh Kumar</p>
        </div>
        
        <div className="flex space-x-3 mt-4 md:mt-0">
          <button className="bg-terminal-red/10 border border-terminal-red text-terminal-red hover:bg-terminal-red hover:text-black px-6 py-2 flex items-center text-xs font-bold transition-colors uppercase tracking-widest">
            <XCircle size={14} className="mr-2" /> Reject
          </button>
          <button className="bg-terminal-green/10 border border-terminal-green text-terminal-green hover:bg-terminal-green hover:text-black px-6 py-2 flex items-center text-xs font-bold transition-colors uppercase tracking-widest">
            <CheckCircle2 size={14} className="mr-2" /> Approve Loan
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-2 space-y-6">
          <YuktiInsight 
            type="positive"
            title="ALGORITHMIC RECOMMENDATION: APPROVE"
            message="This business plan scores 88/100 on the YUKTI viability index. The applicant has requested ₹15 Lakhs for Textile Manufacturing in Nagpur Zone A. The Debt Service Coverage Ratio (DSCR) is projected at a safe 2.1x even under recession stress tests."
          />
          
          <Card className="bg-zinc-900 border-zinc-800 rounded-none shadow-none">
            <CardHeader className="border-b border-zinc-800 pb-3">
              <CardTitle className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center">
                <Target size={14} className="mr-2 text-terminal-cyan" /> YUKTI Risk Assessment
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div>
                <div className="flex justify-between items-end mb-2">
                  <div className="text-xs text-zinc-400 uppercase tracking-widest">Market Saturation Risk</div>
                  <div className="text-terminal-green text-sm font-bold">LOW</div>
                </div>
                <div className="w-full h-1 bg-zinc-800">
                  <div className="h-full bg-terminal-green" style={{ width: '15%' }}></div>
                </div>
                <p className="text-[10px] text-zinc-500 mt-2">Only 2 competitors within a 5km radius. Market is underserved.</p>
              </div>

              <div>
                <div className="flex justify-between items-end mb-2">
                  <div className="text-xs text-zinc-400 uppercase tracking-widest">Capital Efficiency</div>
                  <div className="text-terminal-green text-sm font-bold">HIGH</div>
                </div>
                <div className="w-full h-1 bg-zinc-800">
                  <div className="h-full bg-terminal-green" style={{ width: '85%' }}></div>
                </div>
                <p className="text-[10px] text-zinc-500 mt-2">Projected ROI is 22%. Applicant is bringing 10% margin money.</p>
              </div>

              <div>
                <div className="flex justify-between items-end mb-2">
                  <div className="text-xs text-zinc-400 uppercase tracking-widest">Execution Risk</div>
                  <div className="text-terminal-amber text-sm font-bold">MEDIUM</div>
                </div>
                <div className="w-full h-1 bg-zinc-800">
                  <div className="h-full bg-terminal-amber" style={{ width: '45%' }}></div>
                </div>
                <p className="text-[10px] text-zinc-500 mt-2">Applicant has 3 years of sector experience, but limited formal management training.</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-zinc-900 border-zinc-800 rounded-none shadow-none">
            <CardHeader className="border-b border-zinc-800 pb-3">
              <CardTitle className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center">
                <FileText size={14} className="mr-2 text-terminal-cyan" /> Document Verification
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-4">
                <li className="flex items-center text-xs text-zinc-300">
                  <CheckCircle2 size={16} className="text-terminal-green mr-3" /> Aadhaar / PAN (Promoter)
                </li>
                <li className="flex items-center text-xs text-zinc-300">
                  <CheckCircle2 size={16} className="text-terminal-green mr-3" /> Address Proof
                </li>
                <li className="flex items-center text-xs text-zinc-300">
                  <CheckCircle2 size={16} className="text-terminal-green mr-3" /> Equipment Quotations
                </li>
                <li className="flex items-center text-xs text-zinc-300">
                  <CheckCircle2 size={16} className="text-terminal-green mr-3" /> Bank Statements
                </li>
              </ul>
              
              <button className="w-full mt-6 bg-transparent border border-zinc-700 hover:border-terminal-cyan text-zinc-300 hover:text-terminal-cyan px-4 py-2 flex items-center justify-center text-xs transition-colors">
                <Download size={14} className="mr-2" /> Download Master Archive (ZIP)
              </button>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800 rounded-none shadow-none">
            <CardHeader className="border-b border-zinc-800 pb-3">
              <CardTitle className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center">
                <TrendingUp size={14} className="mr-2 text-terminal-cyan" /> Key Financials
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-3">
              <div className="flex justify-between">
                <span className="text-xs text-zinc-500 uppercase tracking-widest">Loan Amount</span>
                <span className="text-xs text-white font-bold">₹15,00,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-zinc-500 uppercase tracking-widest">Tenure</span>
                <span className="text-xs text-white font-bold">5 Years</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-zinc-500 uppercase tracking-widest">Base DSCR</span>
                <span className="text-xs text-terminal-green font-bold">2.4x</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-zinc-500 uppercase tracking-widest">IRR</span>
                <span className="text-xs text-white font-bold">18.5%</span>
              </div>
              
              <Link href="/report" target="_blank" className="w-full mt-4 block text-center bg-terminal-cyan text-black hover:bg-terminal-cyan/80 px-4 py-2 text-xs font-bold transition-colors">
                VIEW DETAILED PROJECT REPORT
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

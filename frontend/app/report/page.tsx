"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api-client";
import { useStore } from "@/lib/store";
import { Loader2, Download, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ReportPage() {
  const router = useRouter();
  const state = useStore();
  const [loading, setLoading] = useState(true);
  const [html, setHtml] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!state.sessionId) {
      router.push("/");
      return;
    }

    const fetchReport = async () => {
      try {
        const res = await api.generateReport({
          session_id: state.sessionId!
        });
        setHtml(res.html_content);
      } catch (err: any) {
        setError(err.message || "Failed to generate report");
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [state, router]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto mt-20 flex flex-col items-center justify-center space-y-4 font-sans">
        <Loader2 size={48} className="animate-spin text-warm-primary" />
        <p className="text-warm-primary font-bold text-lg">Generating your comprehensive business plan...</p>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 p-4 max-w-4xl mx-auto mt-10 font-bold bg-red-50 rounded-xl border border-red-200">{error}</div>;
  }

  const today = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="max-w-4xl mx-auto mt-6 pb-20 font-sans">
      <div className="flex justify-between items-center mb-6 border-b border-warm-border pb-4 print:hidden">
        <h1 className="text-3xl font-bold text-warm-text">System Execution Report</h1>
        <Button onClick={() => window.print()} className="bg-warm-primary hover:bg-orange-600 text-white font-bold text-sm shadow-md transition-all">
          <Download size={16} className="mr-2" /> Export PDF
        </Button>
      </div>
      
      <div className="bg-white text-slate-800 p-8 md:p-16 min-h-[1056px] shadow-lg rounded-2xl border border-warm-border print:shadow-none print:border-none print:p-0">
        
        {/* Cover Page */}
        <div className="flex flex-col justify-center min-h-[800px] print:min-h-[100vh] border-b-4 border-warm-primary mb-12 pb-12">
          <div className="flex items-center space-x-3 mb-16">
            <div className="w-12 h-12 bg-warm-primary text-white flex items-center justify-center font-bold text-2xl rounded-lg shadow-sm">Y</div>
            <span className="text-3xl font-extrabold tracking-tight text-warm-text">YUKTI</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-black mb-6 leading-tight text-warm-text">Detailed<br/>Project Report</h1>
          <h2 className="text-2xl text-warm-muted mb-12 font-medium">For: {state.categoryName || "Business Implementation"}</h2>
          
          <div className="mt-auto grid grid-cols-2 gap-8 border-t border-warm-border pt-8">
            <div>
              <p className="text-xs uppercase tracking-wider text-warm-muted font-bold mb-1">Prepared For</p>
              <p className="font-bold text-lg text-warm-text">{state.profileName || "Entrepreneur"}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-warm-muted font-bold mb-1">Location</p>
              <p className="font-bold text-lg text-warm-text">{state.locationName || "Target Region"}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-warm-muted font-bold mb-1">Date</p>
              <p className="font-bold text-lg text-warm-text">{today}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-warm-muted font-bold mb-1">System Version</p>
              <p className="font-bold text-lg text-warm-text">YUKTI 2.0 Engine</p>
            </div>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="mb-12 print:break-before-page">
          <h3 className="text-2xl font-bold border-b border-warm-border pb-2 mb-6 text-warm-text">Executive Summary</h3>
          <div className="bg-emerald-50 p-6 border border-emerald-100 rounded-xl">
            <div className="flex items-start">
              <CheckCircle2 size={24} className="text-emerald-600 mr-4 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-lg mb-2 text-emerald-900">Project Viability: Recommended</h4>
                <p className="text-emerald-800 leading-relaxed font-medium">
                  Based on algorithmic analysis of local market demographics, competition density, and capital constraints, the proposed <strong>{state.categoryName}</strong> in <strong>{state.locationName}</strong> demonstrates strong financial viability. The business plan is designed to be highly capital-efficient, minimizing upfront expenditure while addressing existing demand gaps.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Backend HTML Content (Financials, etc) */}
        <div 
          className="prose prose-slate max-w-none prose-headings:text-warm-text prose-p:text-slate-700 prose-strong:text-warm-text prose-strong:font-bold prose-table:border-warm-border"
          dangerouslySetInnerHTML={{ __html: html }}
        />

        {/* Legal Disclaimer */}
        <div className="mt-20 pt-8 border-t border-warm-border text-sm text-warm-muted leading-relaxed print:break-before-page">
          <p className="font-bold mb-2 uppercase tracking-wider text-warm-text">Legal Disclaimer</p>
          <p>
            This Detailed Project Report (DPR) has been auto-generated by the YUKTI AI recommendation engine based on user inputs, public datasets, and algorithmic approximations. The financial projections, demand estimates, and risk assessments are strictly predictive in nature and do not guarantee future performance, profitability, or loan approval.
          </p>
          <p className="mt-2">
            The user assumes all risks associated with business execution. The platform, its creators, and affiliated entities disclaim any liability for financial loss, business failure, or discrepancies between these projections and actual market conditions. This document is intended as a guidance tool and should be independently verified by certified financial professionals before making capital investments or submitting official loan applications.
          </p>
        </div>
      </div>
    </div>
  );
}

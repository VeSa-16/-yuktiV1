"use client";
import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Circle, FileText, Download, Building, ShieldCheck, ArrowRight } from 'lucide-react';
import { YuktiInsight } from '@/components/YuktiInsight';

export default function DocumentsPage() {
  const { categoryName, marginCapital, updateState } = useStore();
  const [docs, setDocs] = useState([
    { id: 1, name: "Aadhaar Card / PAN Card (Promoter)", required: true, checked: true },
    { id: 2, name: "Address Proof of Business Location", required: true, checked: false },
    { id: 3, name: "Quotations for Machinery/Equipment", required: true, checked: false },
    { id: 4, name: "Project Report / Business Plan", required: true, checked: true },
    { id: 5, name: "Caste Certificate (if applicable)", required: false, checked: true },
    { id: 6, name: "Bank Statement (Last 6 Months)", required: true, checked: false },
  ]);

  const toggleDoc = (id: number) => {
    setDocs(docs.map(d => d.id === id ? { ...d, checked: !d.checked } : d));
  };

  const requiredDocs = docs.filter(d => d.required);
  const completedRequired = requiredDocs.filter(d => d.checked).length;
  const readinessScore = Math.round((completedRequired / requiredDocs.length) * 100);

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 text-warm-text animate-in fade-in duration-500">
      <div className="mb-8 mt-6 border-b border-warm-border pb-6 flex flex-col md:flex-row justify-between md:items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Financing Readiness</h1>
          <p className="text-warm-muted mt-2">Track your application readiness for {categoryName || "your business"}.</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex items-center bg-warm-surface p-3 border border-warm-border rounded-xl shadow-sm">
          <div className="mr-4">
            <div className="text-[10px] uppercase font-bold text-warm-muted tracking-widest">Readiness</div>
            <div className={`text-2xl font-black ${readinessScore >= 100 ? 'text-emerald-600' : 'text-amber-600'}`}>{readinessScore}%</div>
          </div>
          <div className="w-24 h-2 bg-warm-bg rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-1000 ${readinessScore >= 100 ? 'bg-emerald-500' : 'bg-amber-500'}`} 
              style={{ width: `${readinessScore}%` }}
            ></div>
          </div>
        </div>
      </div>

      {readinessScore >= 100 && (
        <YuktiInsight 
          type="positive" 
          title="READY TO APPLY" 
          message="You have all the required documents. You can now download your YUKTI DPR (Detailed Project Report) and approach the lending agency." 
          className="mb-8 !font-sans rounded-xl bg-emerald-50 border-emerald-200 !text-emerald-800 shadow-sm"
        />
      )}

      {readinessScore < 100 && (
        <YuktiInsight 
          type="warning" 
          title="MISSING DOCUMENTS" 
          message={`You are missing ${requiredDocs.length - completedRequired} required documents. Specifically, you need to collect Equipment Quotations and Bank Statements before applying.`} 
          className="mb-8 !font-sans rounded-xl bg-amber-50 border-amber-200 !text-amber-800 shadow-sm"
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <Card className="bg-warm-surface border-warm-border shadow-sm">
            <CardHeader className="bg-warm-bg/50 border-b border-warm-border">
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-warm-text flex items-center">
                <FileText size={16} className="mr-2 text-warm-primary" /> Document Checklist
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ul className="divide-y divide-warm-border">
                {docs.map(doc => (
                  <li 
                    key={doc.id} 
                    onClick={() => toggleDoc(doc.id)}
                    className="flex items-center p-4 hover:bg-warm-bg transition-colors cursor-pointer"
                  >
                    {doc.checked ? (
                      <CheckCircle2 size={20} className="text-emerald-500 mr-4 flex-shrink-0" />
                    ) : (
                      <Circle size={20} className="text-warm-border mr-4 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <span className={`font-medium ${doc.checked ? 'text-warm-muted line-through' : 'text-warm-text'}`}>
                        {doc.name}
                      </span>
                      {!doc.required && <span className="ml-2 text-[10px] bg-warm-bg px-2 py-0.5 rounded text-warm-muted uppercase">Optional</span>}
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-warm-surface border-warm-border shadow-sm">
            <CardHeader className="bg-warm-bg/50 border-b border-warm-border">
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-warm-text flex items-center">
                <Building size={16} className="mr-2 text-warm-primary" /> Agency Match
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-50 border border-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <ShieldCheck size={32} className="text-blue-600" />
                </div>
                <h3 className="font-bold text-lg">NSFDC Term Loan</h3>
                <p className="text-sm text-warm-muted mt-1">Matched based on your profile and capital requirement.</p>
              </div>
              
              <div className="space-y-3 mb-6 bg-warm-bg p-4 rounded-lg text-sm">
                <div className="flex justify-between">
                  <span className="text-warm-muted">Interest Rate</span>
                  <span className="font-bold">6% - 8% p.a.</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-warm-muted">Margin Money</span>
                  <span className="font-bold">5% - 10%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-warm-muted">Max Tenure</span>
                  <span className="font-bold">10 Years</span>
                </div>
              </div>

              <button className="w-full bg-warm-primary hover:bg-warm-primary/90 text-warm-text font-bold py-3 rounded-lg flex items-center justify-center transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed" disabled={readinessScore < 100}>
                Begin Application <ArrowRight size={16} className="ml-2" />
              </button>
            </CardContent>
          </Card>

          <Card className="bg-warm-surface border-warm-border shadow-sm">
            <CardContent className="p-6">
              <h4 className="font-bold mb-2 flex items-center"><Download size={16} className="mr-2 text-warm-primary" /> Project Report</h4>
              <p className="text-xs text-warm-muted mb-4">Your auto-generated Detailed Project Report (DPR) is ready for download. This is required by the lending agency.</p>
              <button 
                onClick={() => window.open('/report', '_blank')}
                className="w-full border border-warm-border hover:border-warm-primary text-warm-text font-medium py-2 rounded-lg text-sm transition-colors"
              >
                Download PDF
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

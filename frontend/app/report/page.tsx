"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api-client";
import { useStore } from "@/lib/store";
import { Loader2, Download } from "lucide-react";
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
      <div className="max-w-4xl mx-auto mt-20 flex flex-col items-center justify-center space-y-4">
        <Loader2 size={48} className="animate-spin text-terminal-cyan" />
        <p className="text-terminal-cyan font-mono uppercase tracking-widest">Generating your comprehensive business plan...</p>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 p-4 max-w-4xl mx-auto mt-10">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-6 pb-20">
      <div className="flex justify-between items-center mb-6 border-b border-zinc-800 pb-4">
        <h1 className="text-2xl font-mono text-white tracking-widest uppercase">System Execution Report</h1>
        <Button onClick={() => window.print()} variant="outline" className="print:hidden text-xs">
          <Download size={14} className="mr-2" /> EXPORT_PDF
        </Button>
      </div>
      
      {/* We render the HTML returned from the backend */}
      <div 
        className="bg-black border border-zinc-800 rounded-none shadow-none p-8 min-h-[800px] overflow-auto print:border-none print:shadow-none print:p-0 prose prose-invert prose-terminal"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}

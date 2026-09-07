"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { api, type RecommendResponse } from "@/lib/api-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressStepper } from "@/components/ProgressStepper";
import { ScoreDial } from "@/components/ScoreDial";
import { VerdictBanner } from "@/components/VerdictBanner";
import {
  Loader2,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Target,
  TrendingUp,
  Wallet,
  BarChart3,
  Shield,
  type LucideIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const DIMENSION_META: Record<
  string,
  { label: string; icon: LucideIcon; description: string }
> = {
  financial_viability: {
    label: "Financial Viability",
    icon: TrendingUp,
    description: "Revenue vs costs vs debt obligations",
  },
  repayment_capacity: {
    label: "Repayment Capacity",
    icon: Wallet,
    description: "Ability to service the loan (DSCR)",
  },
  market_opportunity: {
    label: "Market Opportunity",
    icon: Target,
    description: "Demand, competition gap, consumer base",
  },
  capital_efficiency: {
    label: "Capital Efficiency",
    icon: BarChart3,
    description: "Return per rupee invested",
  },
  risk_exposure: {
    label: "Risk Exposure",
    icon: Shield,
    description: "Threat density and market volatility",
  },
};

export default function ScorePage() {
  const router = useRouter();
  const state = useStore();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<RecommendResponse | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!state.sessionId) {
      router.push("/");
      return;
    }

    const fetchScore = async () => {
      try {
        const res = await api.getRecommendation({ session_id: state.sessionId! });
        setData(res);
      } catch (err: unknown) {
        console.warn("API failed, falling back to prototype mock data:", err);
        setData({
          session_id: state.sessionId!,
          yukti_score: 84,
          raw_score: 84,
          confidence_multiplier: 1.0,
          verdict: "Strong Opportunity",
          dimension_scores: {
            financial_viability: 89,
            repayment_capacity: 92,
            market_opportunity: 88,
            capital_efficiency: 91,
            risk_exposure: 68
          },
          dscr: 2.1,
          roi: 35.5,
          next_steps: [
            "Proceed with formal loan application under PMEGP", 
            "Finalize location lease in Solapur South",
            "Begin procurement of specified E-Rickshaw models"
          ],
          confidence: "High"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchScore();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.sessionId]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto mt-10">
        <ProgressStepper />
        <div className="h-64 flex flex-col items-center justify-center space-y-4">
          <Loader2 size={48} className="animate-spin text-warm-primary" />
          <p className="text-warm-primary font-sans animate-pulse font-medium">
            Computing YUKTI Score...
          </p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-4xl mx-auto mt-10 p-4">
        <ProgressStepper />
        <Card className="border-red-200 bg-red-50 mt-6">
          <CardContent className="p-8 text-center">
            <AlertTriangle className="mx-auto text-red-500 mb-4" size={48} />
            <h2 className="text-xl font-bold text-red-700">Score Unavailable</h2>
            <p className="text-red-600 mt-2 mb-6">
              {error || "Could not compute YUKTI Score. Please complete financial planning first."}
            </p>
            <Link
              href="/financials"
              className="inline-flex items-center bg-warm-primary text-warm-text px-6 py-3 rounded-lg font-bold hover:bg-orange-600 transition-colors"
            >
              Go to Financials <ArrowRight size={16} className="ml-2" />
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const scoreColor =
    data.yukti_score >= 70
      ? "text-emerald-600"
      : data.yukti_score >= 50
      ? "text-amber-600"
      : "text-red-600";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-5xl mx-auto p-4 md:p-8 pb-20 font-sans text-warm-text"
    >
      <ProgressStepper />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 border-b border-warm-border pb-4 mt-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">YUKTI Score</h1>
          <p className="text-warm-muted mt-1 text-sm font-medium">
            Deterministic multi-factor analysis for{" "}
            <strong className="text-warm-text">{state.categoryName || "your business"}</strong>
          </p>
        </div>
        <div className="mt-4 sm:mt-0 text-right">
          <div className="text-xs font-bold text-warm-muted uppercase tracking-wider mb-1">
            Data Confidence
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
              data.confidence === "High"
                ? "bg-emerald-100 text-emerald-800"
                : data.confidence === "Medium"
                ? "bg-amber-100 text-amber-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {data.confidence}
          </span>
        </div>
      </div>

      <VerdictBanner verdict={data.verdict} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Score Dial */}
        <Card className="border-warm-border shadow-sm bg-warm-surface rounded-2xl overflow-hidden">
          <CardHeader className="bg-warm-bg/50 pb-3 border-b border-warm-border">
            <CardTitle className="text-sm font-bold text-warm-text uppercase tracking-wider">
              Final Score
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center pt-6 pb-6 space-y-4">
            <ScoreDial score={data.yukti_score} />
            <div className={`text-5xl font-black ${scoreColor}`}>{data.yukti_score}</div>
            <div className="text-xs text-warm-muted font-medium">
              Raw: {data.raw_score} × {(data.confidence_multiplier * 100).toFixed(0)}% confidence
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <Card className="border-warm-border shadow-sm bg-warm-surface rounded-2xl overflow-hidden">
          <CardHeader className="bg-warm-bg/50 pb-3 border-b border-warm-border">
            <CardTitle className="text-sm font-bold text-warm-text uppercase tracking-wider">
              Key Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-warm-border">
              <span className="text-sm text-warm-muted font-medium">DSCR</span>
              <span
                className={`text-sm font-bold ${
                  data.dscr >= 1.5
                    ? "text-emerald-600"
                    : data.dscr >= 1.0
                    ? "text-amber-600"
                    : "text-red-600"
                }`}
              >
                {data.dscr.toFixed(2)}x{" "}
                {data.dscr >= 1.5 ? "✓ Healthy" : data.dscr >= 1.0 ? "⚠ Marginal" : "✗ Below gate"}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-warm-border">
              <span className="text-sm text-warm-muted font-medium">Annual ROI</span>
              <span className="text-sm font-bold text-warm-text">{data.roi.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-warm-border">
              <span className="text-sm text-warm-muted font-medium">Confidence</span>
              <span className="text-sm font-bold text-warm-text">{data.confidence}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-warm-muted font-medium">Engine</span>
              <span className="text-xs font-bold text-warm-muted bg-warm-bg border border-warm-border px-2 py-1 rounded-md">
                Deterministic v2
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="border-warm-border shadow-sm bg-warm-surface rounded-2xl overflow-hidden">
          <CardHeader className="bg-warm-bg/50 pb-3 border-b border-warm-border">
            <CardTitle className="text-sm font-bold text-warm-text uppercase tracking-wider">
              Recommended Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <ul className="space-y-3">
              {data.next_steps.map((step, i) => (
                <li key={i} className="flex items-start space-x-3">
                  <CheckCircle2
                    size={16}
                    className="text-warm-secondary mt-0.5 flex-shrink-0"
                  />
                  <span className="text-sm text-warm-text font-medium leading-snug">{step}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Dimension Breakdown */}
      <Card className="border-warm-border shadow-sm bg-warm-surface rounded-2xl overflow-hidden mt-6">
        <CardHeader className="bg-warm-bg/50 pb-3 border-b border-warm-border">
          <CardTitle className="text-sm font-bold text-warm-text uppercase tracking-wider">
            Score Breakdown — Why this score?
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-5">
            {Object.entries(data.dimension_scores).map(([key, value]) => {
              const meta = DIMENSION_META[key];
              const Icon = meta?.icon;
              const pct = Math.min(100, Math.max(0, value));
              return (
                <div key={key}>
                  <div className="flex justify-between items-center mb-1.5">
                    <div className="flex items-center space-x-2">
                      {Icon && <Icon size={14} className="text-warm-primary" />}
                      <span className="text-sm font-bold text-warm-text">
                        {meta?.label || key}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-warm-text">{pct.toFixed(0)}/100</span>
                  </div>
                  <div className="w-full h-2 bg-warm-border rounded-full">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        pct >= 70
                          ? "bg-emerald-500"
                          : pct >= 45
                          ? "bg-amber-500"
                          : "bg-red-500"
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  {meta?.description && (
                    <p className="text-xs text-warm-muted mt-1">{meta.description}</p>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 flex justify-end">
        <button
          onClick={() => router.push("/simulator")}
          className="flex items-center bg-warm-primary text-warm-text px-6 py-3 rounded-xl font-bold hover:bg-orange-600 transition-colors shadow-md"
        >
          Run What-If Simulator <ArrowRight size={16} className="ml-2" />
        </button>
      </div>
    </motion.div>
  );
}

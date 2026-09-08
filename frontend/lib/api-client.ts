/**
 * API client to communicate with the FastAPI backend.
 * - Centralized base URL from environment variable
 * - AbortController-based timeouts (15s standard, 60s for AI)
 * - Structured error handling
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const STANDARD_TIMEOUT_MS = 15000;
const AI_TIMEOUT_MS = 120000; // Increased to 120s to allow multiple slow third-party API queries

class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public status?: number
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function fetchWithTimeout<T>(
  endpoint: string,
  options: RequestInit,
  timeoutMs: number,
  externalSignal?: AbortSignal
): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  // If the caller passes their own signal (e.g. from useEffect cleanup),
  // wire it up so aborting that signal also aborts this fetch.
  if (externalSignal) {
    if (externalSignal.aborted) {
      clearTimeout(timer);
      throw new ApiError("REQUEST_CANCELLED", "Request was cancelled.");
    }
    externalSignal.addEventListener("abort", () => controller.abort(), { once: true });
  }

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      signal: controller.signal,
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new ApiError(
        errorData.code || `HTTP_${res.status}`,
        errorData.detail || `Request failed with status ${res.status}`,
        res.status
      );
    }

    return res.json();
  } catch (err: unknown) {
    if (err instanceof Error && err.name === "AbortError") {
      // Distinguish between timeout and user-initiated cancellation
      const reason = externalSignal?.aborted ? "REQUEST_CANCELLED" : "REQUEST_TIMEOUT";
      const msg = reason === "REQUEST_CANCELLED"
        ? "Request was cancelled."
        : "The request timed out. Please try again.";
      throw new ApiError(reason, msg);
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

export { ApiError };

export class ApiClient {
  static async post<T>(endpoint: string, body: unknown, timeoutMs = STANDARD_TIMEOUT_MS, signal?: AbortSignal): Promise<T> {
    return fetchWithTimeout<T>(
      endpoint,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      },
      timeoutMs,
      signal
    );
  }

  static async get<T>(endpoint: string, timeoutMs = STANDARD_TIMEOUT_MS, signal?: AbortSignal): Promise<T> {
    return fetchWithTimeout<T>(
      endpoint,
      { method: "GET" },
      timeoutMs,
      signal
    );
  }
}

// ─── Typed API shapes ────────────────────────────────────────────────────────

export interface ProfileResponse {
  user_id: string;
  location_id: string;
  location_name: string;
  state: string;
  lat: number;
  lng: number;
  data_richness: string;
}

export interface RankResponse {
  session_id: string;
  scheme_matched: boolean;
  scheme_name?: string;
  rankings: Array<{
    category_id: string;
    category_name: string;
    yukti_score: number;
    verdict: string;
    confidence: string;
    dscr?: number;
    roi?: number;
    emi?: number;
    net_profit?: number;
    highlights: string[];
    note: string;
  }>;
}

export interface MarketResponse {
  category_name: string;
  location_id: string;
  overall_confidence: string;
  market_reach: { value: { consumer_base: number } | null; provenance: Record<string, string> };
  competitors: { value: { count: number; records: Array<{ name: string; latitude: number; longitude: number }> } | null; provenance: Record<string, string> };
  opportunity_gaps: { value: { assessment: string } | null; provenance: Record<string, string> };
  pricing: { value: { low: number; high: number; unit: string } | null; provenance: Record<string, string> };
}

export interface CashflowMonth {
  month: string;
  month_num: number;
  revenue: number;
  expenses: number;
  emi_payment: number;
  net_cash: number;
  cumulative: number;
}

export interface PnlStatement {
  revenue: number;
  cogs: number;
  gross_profit: number;
  gross_margin_pct: number;
  operating_expenses: number;
  ebit: number;
  tax: number;
  net_profit: number;
  net_margin_pct: number;
}

export interface WorkingCapital {
  daily_cash_needed: number;
  weekly_cash_needed: number;
  monthly_working_capital: number;
  inventory_requirement: number;
  receivables: number;
  payables: number;
  recommended_buffer: number;
  receivable_days: number;
  payable_days: number;
  inventory_days: number;
}

export interface RevenueScenario {
  monthly_revenue: number;
  monthly_opex: number;
  monthly_net_profit: number;
  annual_net_profit: number;
  roi_pct: number;
  payback_months: number | null;
}

export interface PaybackPeriod {
  payback_months: number | null;
  payback_achieved: boolean;
  total_investment: number;
  note: string;
}

export interface SeasonalMonth {
  month: string;
  revenue: number;
  index: number;
}

export interface FinanceResponse {
  project_cost: number;
  loan_amount: number;
  beneficiary_contribution: number;
  scheme: Record<string, unknown>;
  emi: number;
  rate: number;
  tenure_months: number;
  moratorium_months: number;
  monthly_revenue: number;
  monthly_opex: number;
  net_profit: number;
  dscr: number;
  break_even_units: number;
  roi: number;
  cost_confidence: string;
  // Extended
  cashflow_projection: CashflowMonth[];
  pnl_statement: PnlStatement | null;
  working_capital: WorkingCapital | null;
  revenue_scenarios: { pessimistic: RevenueScenario; realistic: RevenueScenario; optimistic: RevenueScenario };
  seasonal_revenue: SeasonalMonth[];
  payback_period: PaybackPeriod | null;
}

export interface RecommendResponse {
  session_id: string;
  yukti_score: number;
  raw_score: number;
  confidence_multiplier: number;
  verdict: string;
  dimension_scores: {
    financial_viability: number;
    repayment_capacity: number;
    market_opportunity: number;
    capital_efficiency: number;
    risk_exposure: number;
  };
  dscr: number;
  roi: number;
  next_steps: string[];
  confidence: string;
}

export interface SimulateResponse {
  emi: number;
  dscr: number;
  break_even_units: number;
  verdict: string;
  net_profit: number;
  simulated_roi: number;
  survives_stress: boolean;
}

export interface ExplainResponse {
  explanation: string;
  data_source: string;
}

export interface ReportResponse {
  session_id: string;
  html_content: string;
  generated_at: string;
}

// ─── API methods ─────────────────────────────────────────────────────────────

export const api = {
  createProfile: (data: { name: string; location_input: string; language: string }, signal?: AbortSignal) =>
    ApiClient.post<ProfileResponse>("/profile", data, undefined, signal),

  rankOpportunities: (data: { session_id: string; location_id: string; margin_capital: number }, signal?: AbortSignal) =>
    ApiClient.post<RankResponse>("/rank-opportunities", data, undefined, signal),

  analyzeMarket: (data: { session_id: string; location_id: string; category_id: string; category_name?: string; budget?: number; experience?: string; idea_details?: string }, signal?: AbortSignal) =>
    ApiClient.post<MarketResponse>("/analyze-market", data, AI_TIMEOUT_MS, signal),

  calculateFinance: (data: { session_id: string }, signal?: AbortSignal) =>
    ApiClient.post<FinanceResponse>("/calculate-finance", data, undefined, signal),

  getRecommendation: (data: { session_id: string }, signal?: AbortSignal) =>
    ApiClient.post<RecommendResponse>("/recommend", data, undefined, signal),

  simulate: (data: {
    session_id: string;
    revenue_delta_pct: number;
    cost_delta_pct: number;
    tenure_override_years?: number | null;
  }, signal?: AbortSignal) => ApiClient.post<SimulateResponse>("/simulate", data, undefined, signal),

  explain: (data: { session_id: string; question: string; language?: string }) =>
    ApiClient.post<ExplainResponse>("/explain", data, AI_TIMEOUT_MS),

  generateReport: (data: { session_id: string; format?: string }) =>
    ApiClient.post<ReportResponse>("/report", data, AI_TIMEOUT_MS),
};

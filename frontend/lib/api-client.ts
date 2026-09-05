/**
 * API client to communicate with the FastAPI backend.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export class ApiClient {
  static async post<T>(endpoint: string, body: any): Promise<T> {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || `API error: ${res.status}`);
    }
    return res.json();
  }

  static async get<T>(endpoint: string): Promise<T> {
    const res = await fetch(`${API_BASE_URL}${endpoint}`);
    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }
    return res.json();
  }
}

// Specific API calls
export const api = {
  createProfile: (data: { name: string; location_input: string; language: string }) => 
    ApiClient.post<any>("/profile", data),
    
  rankOpportunities: (data: { session_id: string; location_id: string; margin_capital: number }) => 
    ApiClient.post<any>("/rank-opportunities", data),
    
  analyzeMarket: (data: { session_id: string; location_id: string; category_id: string }) => 
    ApiClient.post<any>("/analyze-market", data),
    
  getRecommendation: (data: { session_id: string }) => 
    ApiClient.post<any>("/recommend", data),
    
  simulate: (data: { session_id: string; revenue_delta_pct: number; cost_delta_pct: number; tenure_override_years?: number | null }) => 
    ApiClient.post<any>("/simulate", data),
    
  explain: (data: { session_id: string; question: string; language?: string }) => 
    ApiClient.post<any>("/explain", data),
    
  generateReport: (data: { session_id: string; format?: string }) => 
    ApiClient.post<any>("/report", data),
};

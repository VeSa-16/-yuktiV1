import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, AlertCircle, ArrowRight } from "lucide-react";

interface Alternative {
  category_id: string;
  score: number;
  dscr: number;
  roi_pct: number;
}

interface Props {
  primaryIdea: {
    category_id: string;
    score: number;
    dscr: number;
    roi_pct: number;
  };
  alternatives: Alternative[];
}

const CATEGORY_NAMES: Record<string, string> = {
  "retail_shop": "Retail & Shop",
  "manufacturing": "Manufacturing",
  "agri_business": "Agri-Business",
  "services_tech": "Services & Tech",
  "food_beverage": "Food & Beverage",
  "handicrafts_artisanal": "Handicrafts",
  "logistics_delivery": "Logistics & Delivery",
  "education_training": "Education",
  "healthcare_wellness": "Healthcare",
  "fashion_apparel": "Fashion & Apparel",
};

export function CompareAlternatives({ primaryIdea, alternatives }: Props) {
  if (!alternatives || alternatives.length === 0) return null;

  const allItems = [primaryIdea, ...alternatives];
  const maxRoi = Math.max(...allItems.map(a => a.roi_pct), 1);
  const maxDscr = Math.max(...allItems.map(a => a.dscr), 1);

  return (
    <Card className="border-warm-border shadow-sm bg-warm-surface rounded-2xl overflow-hidden mb-6">
      <CardHeader className="bg-warm-bg/50 pb-3 border-b border-warm-border">
        <CardTitle className="text-sm font-bold text-warm-text uppercase tracking-wider flex items-center gap-2">
          <BarChart3 size={16} className="text-warm-primary" />
          Compare Alternatives
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <p className="text-sm text-warm-muted mb-6">
          You opted to explore similar businesses. Here is how your primary choice compares against other opportunities in the market.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* ROI Comparison */}
          <div>
            <h4 className="text-sm font-bold text-ink mb-4 flex items-center gap-2">
              <TrendingUp size={16} className="text-[#16a34a]" /> Annual Return on Investment (ROI)
            </h4>
            <div className="space-y-4">
              {allItems.map((item, idx) => {
                const isPrimary = idx === 0;
                const width = `${(item.roi_pct / maxRoi) * 100}%`;
                const label = isPrimary ? "Your Choice" : CATEGORY_NAMES[item.category_id] || item.category_id;
                
                return (
                  <div key={item.category_id} className="relative">
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className={isPrimary ? "text-warm-primary" : "text-ink-soft"}>{label}</span>
                      <span className="text-ink">{item.roi_pct}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${isPrimary ? "bg-[#ea580c]" : "bg-[#16a34a]"}`}
                        style={{ width }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* DSCR Comparison */}
          <div>
            <h4 className="text-sm font-bold text-ink mb-4 flex items-center gap-2">
              <AlertCircle size={16} className="text-blue-500" /> Repayment Capacity (DSCR)
            </h4>
            <div className="space-y-4">
              {allItems.map((item, idx) => {
                const isPrimary = idx === 0;
                const width = `${(item.dscr / maxDscr) * 100}%`;
                const label = isPrimary ? "Your Choice" : CATEGORY_NAMES[item.category_id] || item.category_id;
                
                return (
                  <div key={item.category_id} className="relative">
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className={isPrimary ? "text-warm-primary" : "text-ink-soft"}>{label}</span>
                      <span className="text-ink">{item.dscr}x</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${isPrimary ? "bg-[#ea580c]" : "bg-blue-500"}`}
                        style={{ width }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {alternatives.some(a => a.roi_pct > primaryIdea.roi_pct || a.dscr > primaryIdea.dscr) && (
          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
            <AlertCircle size={20} className="text-amber-600 shrink-0 mt-0.5" />
            <div className="text-sm text-amber-800">
              <strong>Safer alternatives exist.</strong> One or more alternatives offer better returns or higher repayment capacity with the same capital. Consider pivoting to minimize risk.
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

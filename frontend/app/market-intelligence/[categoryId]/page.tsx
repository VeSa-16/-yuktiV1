"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ProgressStepper } from "@/components/ProgressStepper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api-client";
import { useStore } from "@/lib/store";
import { Loader2, ArrowRight, Activity, Users, MapPin, TrendingUp, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { MapRadiusOverlay } from "@/components/MapRadiusOverlay";

export default function MarketIntelligencePage({ params }: { params: { categoryId: string } }) {
  const router = useRouter();
  const state = useStore();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!state.sessionId) {
      router.push("/");
      return;
    }
    const fetchMarket = async () => {
      try {
        const res = await api.analyzeMarket({
          session_id: state.sessionId!,
          location_id: state.locationId || "loc_akkalkot",
          category_id: params.categoryId
        });
        setData(res);
      } catch (err: any) {
        setError(err.message || "Failed to fetch market data");
      } finally {
        setLoading(false);
      }
    };
    fetchMarket();
  }, [state, params.categoryId, router]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto mt-10">
        <ProgressStepper />
        <div className="h-64 flex flex-col items-center justify-center space-y-4">
          <Loader2 size={48} className="animate-spin text-warm-primary" />
          <p className="text-warm-primary font-sans animate-pulse">Running deterministic market models...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-4xl mx-auto mt-10">
         <Card className="border-red-200 bg-red-50">
            <CardContent className="p-8 text-center">
              <AlertTriangle className="mx-auto text-red-500 mb-4" size={48} />
              <h2 className="text-xl font-bold text-red-700">Market Data Unavailable</h2>
              <p className="text-red-600 mt-2">YUKTI cannot confidently assess this factor because verified local market data is unavailable.</p>
            </CardContent>
         </Card>
      </div>
    );
  }

  const ProvenanceTag = ({ prov }: { prov: any }) => {
    if (!prov) return null;
    return (
      <div className="mt-2 text-[10px] font-sans bg-slate-100 p-2 rounded text-warm-muted border border-warm-border">
        <div className="flex justify-between items-center mb-1">
          <span className="font-bold uppercase tracking-wider text-warm-text">{prov.source_type}</span>
          <span className={`font-bold uppercase ${prov.confidence === 'high' ? 'text-warm-secondary' : prov.confidence === 'medium' ? 'text-orange-500' : 'text-red-500'}`}>CONFIDENCE: {prov.confidence}</span>
        </div>
        <div>Source: {prov.source_name}</div>
        {prov.methodology && <div className="mt-1 italic">Method: {prov.methodology}</div>}
      </div>
    );
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-5xl mx-auto mt-10 pb-20">
      <ProgressStepper />
      
      <div className="flex flex-col sm:flex-row justify-between items-center sm:items-end mb-8 border-b border-warm-border pb-4">
        <div>
          <h1 className="text-2xl font-sans text-warm-text tracking-widest uppercase">Hyper-Local Intelligence</h1>
          <p className="text-warm-primary mt-2 text-xs font-sans">REAL DATA INSIGHTS FOR // {data.category_name} IN {state.locationName || data.location_id}</p>
        </div>
        <div className="text-right">
          <div className="text-[10px] uppercase font-bold text-warm-muted mb-1">Global Data Quality</div>
          <span className={`inline-flex px-3 py-1 rounded text-xs font-bold ${data.overall_confidence === 'high' ? 'bg-green-100 text-green-800' : data.overall_confidence === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
            {data.overall_confidence.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Market Reach */}
        <Card className="border-warm-border shadow-sm">
          <CardHeader className="bg-warm-surface pb-3 border-b border-warm-border">
            <CardTitle className="text-sm font-sans flex items-center text-warm-text">
              <Users size={16} className="mr-2 text-warm-primary"/> Target Customer Reach
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-3xl font-light text-slate-800">
              {data.market_reach.value?.consumer_base ? data.market_reach.value.consumer_base.toLocaleString() : "N/A"}
            </div>
            <div className="text-xs text-warm-muted mt-1">Est. Addressable Consumers (10km radius)</div>
            <ProvenanceTag prov={data.market_reach.provenance} />
          </CardContent>
        </Card>

        {/* Competitor Density */}
        <Card className="border-warm-border shadow-sm">
          <CardHeader className="bg-warm-surface pb-3 border-b border-warm-border">
            <CardTitle className="text-sm font-sans flex items-center text-warm-text">
              <MapPin size={16} className="mr-2 text-warm-primary"/> Competitor Intelligence
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-3xl font-light text-slate-800">
              {data.competitors.value?.count} <span className="text-sm text-warm-muted uppercase tracking-wider">verified</span>
            </div>
            <div className="text-xs text-warm-muted mt-1">Nearest competitor distance estimated at &lt; 2km</div>
            <ProvenanceTag prov={data.competitors.provenance} />
          </CardContent>
        </Card>

        {/* Opportunity Gap */}
        <Card className="border-warm-border shadow-sm">
          <CardHeader className="bg-warm-surface pb-3 border-b border-warm-border">
            <CardTitle className="text-sm font-sans flex items-center text-warm-text">
              <Activity size={16} className="mr-2 text-warm-primary"/> Gap Finder
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-lg font-medium text-slate-800">
              {data.opportunity_gaps.value?.assessment || "No gap identified"}
            </div>
            <ProvenanceTag prov={data.opportunity_gaps.provenance} />
          </CardContent>
        </Card>

        {/* Local Pricing */}
        <Card className="border-warm-border shadow-sm">
          <CardHeader className="bg-warm-surface pb-3 border-b border-warm-border">
            <CardTitle className="text-sm font-sans flex items-center text-warm-text">
              <TrendingUp size={16} className="mr-2 text-warm-primary"/> Local Pricing Band
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-light text-slate-800">
              ₹{data.pricing.value?.low?.toFixed(0)} - ₹{data.pricing.value?.high?.toFixed(0)}
            </div>
            <div className="text-xs text-warm-muted mt-1">{data.pricing.value?.unit.replace(/_/g, ' ')}</div>
            <ProvenanceTag prov={data.pricing.provenance} />
          </CardContent>
        </Card>
      </div>

      
      {/* Interactive Opportunity Map */}
      <Card className="border-warm-border shadow-sm mt-6">
        <CardHeader className="bg-warm-surface pb-3 border-b border-warm-border">
          <CardTitle className="text-sm font-sans flex items-center text-warm-text">
            <MapPin size={16} className="mr-2 text-warm-primary"/> Opportunity Map & Competitor Layout
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <MapRadiusOverlay 
            lat={data.competitors.value?.records?.[0]?.latitude || 17.6599} 
            lng={data.competitors.value?.records?.[0]?.longitude || 75.9064} 
            radiusKm={10} 
            competitors={data.competitors.value?.records?.map((c: any) => ({ name: c.name, distance_km: Math.abs(c.latitude - (data.competitors.value?.records?.[0]?.latitude || 17.6599)) * 111 + Math.abs(c.longitude - (data.competitors.value?.records?.[0]?.longitude || 75.9064)) * 111 })) || []} 
          />
        </CardContent>
      </Card>

      <div className="mt-8 flex justify-end">
        <Button onClick={() => router.push('/financials')} className="bg-warm-primary hover:bg-orange-600 text-warm-text font-sans px-8 py-6 uppercase tracking-wider text-xs">
          Proceed to Financial Model <ArrowRight size={16} className="ml-2" />
        </Button>
      </div>
    </motion.div>
  );
}

"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";

// Dynamically import the wrapper component that statically imports react-leaflet
const MapComponent = dynamic(() => import("./MapComponent"), { 
  ssr: false,
  loading: () => <div className="w-full h-64 bg-warm-bg border border-warm-border animate-pulse rounded-none flex items-center justify-center text-warm-muted font-sans text-xs uppercase tracking-widest">Loading Map...</div>
});

interface Competitor {
  name: string;
  distance_km: number;
}

interface MapProps {
  lat: number;
  lng: number;
  radiusKm: number;
  competitors?: Competitor[];
}

export function MapRadiusOverlay({ lat, lng, radiusKm, competitors = [] }: MapProps) {
  const [showCompetitors, setShowCompetitors] = useState(true);
  const [showZones, setShowZones] = useState(true);

  return (
    <div className="w-full h-64 rounded-none overflow-hidden border border-warm-border z-0 relative grayscale">
      
      {/* Interactive Layer Toggles */}
      <div className="absolute top-2 right-2 z-[400] flex flex-col gap-2">
        <button 
          onClick={() => setShowCompetitors(!showCompetitors)}
          className={`px-3 py-1 text-[10px] uppercase font-sans tracking-widest border transition-colors ${showCompetitors ? 'bg-red-600/20 border-red-600 text-red-600' : 'bg-warm-bg/50 border-warm-border text-warm-muted'}`}
        >
          {showCompetitors ? 'Hide Competitors' : 'Show Competitors'}
        </button>
        <button 
          onClick={() => setShowZones(!showZones)}
          className={`px-3 py-1 text-[10px] uppercase font-sans tracking-widest border transition-colors ${showZones ? 'bg-warm-primary/20 border-warm-primary text-warm-primary' : 'bg-warm-bg/50 border-warm-border text-warm-muted'}`}
        >
          {showZones ? 'Hide Opp. Zones' : 'Show Opp. Zones'}
        </button>
      </div>

      <MapComponent 
        lat={lat} 
        lng={lng} 
        radiusKm={radiusKm} 
        showCompetitors={showCompetitors} 
        showZones={showZones} 
        competitors={competitors} 
      />
    </div>
  );
}

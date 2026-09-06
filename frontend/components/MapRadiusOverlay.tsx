"use client";
import React, { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";

// Dynamic import for react-leaflet components since they require window
import dynamic from "next/dynamic";
const MapContainer = dynamic(() => import("react-leaflet").then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then(mod => mod.TileLayer), { ssr: false });
const Circle = dynamic(() => import("react-leaflet").then(mod => mod.Circle), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then(mod => mod.Popup), { ssr: false });

import L from "leaflet";

// Fix leaflet icon issue in Next.js
const createIcon = (color: string) => {
  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

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
  const [mounted, setMounted] = useState(false);
  const [showCompetitors, setShowCompetitors] = useState(true);
  const [showZones, setShowZones] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-full h-64 bg-black border border-zinc-800 animate-pulse rounded-none flex items-center justify-center text-zinc-500 font-mono text-xs uppercase tracking-widest">Loading Map...</div>;
  }

  const redIcon = createIcon('red');
  const blueIcon = createIcon('blue');

  return (
    <div className="w-full h-64 rounded-none overflow-hidden border border-zinc-800 z-0 relative grayscale">
      
      {/* Interactive Layer Toggles */}
      <div className="absolute top-2 right-2 z-[400] flex flex-col gap-2">
        <button 
          onClick={() => setShowCompetitors(!showCompetitors)}
          className={`px-3 py-1 text-[10px] uppercase font-mono tracking-widest border transition-colors ${showCompetitors ? 'bg-terminal-red/20 border-terminal-red text-terminal-red' : 'bg-black/50 border-zinc-700 text-zinc-500'}`}
        >
          {showCompetitors ? 'Hide Competitors' : 'Show Competitors'}
        </button>
        <button 
          onClick={() => setShowZones(!showZones)}
          className={`px-3 py-1 text-[10px] uppercase font-mono tracking-widest border transition-colors ${showZones ? 'bg-terminal-cyan/20 border-terminal-cyan text-terminal-cyan' : 'bg-black/50 border-zinc-700 text-zinc-500'}`}
        >
          {showZones ? 'Hide Opp. Zones' : 'Show Opp. Zones'}
        </button>
      </div>

      <MapContainer center={[lat, lng]} zoom={12} style={{ height: "100%", width: "100%", backgroundColor: '#000000' }} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        
        {/* Core Radius */}
        <Circle center={[lat, lng]} radius={radiusKm * 1000} pathOptions={{ color: '#00ffff', fillColor: '#00ffff', fillOpacity: 0.05, weight: 1 }} />
        
        {/* Opp Zone (Green Heatmap/Polygon proxy) */}
        {showZones && (
          <>
            <Circle center={[lat + 0.015, lng + 0.01]} radius={(radiusKm * 1000) * 0.4} pathOptions={{ color: '#16a34a', fillColor: '#16a34a', fillOpacity: 0.2, weight: 0 }} />
            <Circle center={[lat - 0.02, lng - 0.015]} radius={(radiusKm * 1000) * 0.3} pathOptions={{ color: '#16a34a', fillColor: '#16a34a', fillOpacity: 0.15, weight: 0 }} />
          </>
        )}

        <Marker position={[lat, lng]} icon={blueIcon}>
          <Popup>Target Location</Popup>
        </Marker>
        
        {showCompetitors && competitors.map((comp, idx) => {
          // Generate deterministic fake coordinates around center based on distance
          const angle = (idx * (360 / Math.max(1, competitors.length))) * (Math.PI / 180);
          const distLat = (comp.distance_km / 111) * Math.cos(angle);
          const distLng = (comp.distance_km / (111 * Math.cos(lat * (Math.PI / 180)))) * Math.sin(angle);
          
          return (
            <Marker key={idx} position={[lat + distLat, lng + distLng]} icon={redIcon}>
              <Popup>{comp.name}<br/>{comp.distance_km.toFixed(1)} km away</Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}

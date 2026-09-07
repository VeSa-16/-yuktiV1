"use client";
import React from "react";
import { MapContainer, TileLayer, Circle, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

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

interface MapComponentProps {
  lat: number;
  lng: number;
  radiusKm: number;
  showCompetitors: boolean;
  showZones: boolean;
  competitors: Competitor[];
}

export default function MapComponent({ lat, lng, radiusKm, showCompetitors, showZones, competitors }: MapComponentProps) {
  const redIcon = createIcon('red');
  const blueIcon = createIcon('blue');

  return (
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
  );
}

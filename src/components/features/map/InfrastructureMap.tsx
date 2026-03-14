'use client';

import { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Polygon } from 'react-leaflet';
import { generateCityGrid, analyzeUnderservedAreas, GridCell } from '@/lib/geoUtils';

import 'leaflet/dist/leaflet.css';

interface MapProps {
  data: any;
  layers: Record<string, boolean>;
  serviceRadius?: number;
}

const COLORS: Record<string, string> = {
  hospitals: '#ef4444',
  schools: '#3b82f6',
  trafficNodes: '#f59e0b',
  pharmacies: '#10b981',
  police: '#8b5cf6',
  buildings: '#64748b',
};

export default function InfrastructureMap({ data, layers, serviceRadius }: MapProps) {
  const [mounted, setMounted] = useState(false);
  const center: [number, number] = [12.9716, 77.5946]; // Bangalore center

  useEffect(() => {
    setMounted(true);
  }, []);

  // Calculate underserved zones when serviceGaps layer is active
  const underservedZones = useMemo<GridCell[]>(() => {
    if (!data?.data || !layers.serviceGaps) return [];
    
    const activeDatasets: { [key: string]: { lat: number; lon: number }[] } = {};
    const relevantKeys = ['hospitals', 'schools', 'trafficNodes', 'pharmacies', 'police', 'buildings'];
    
    relevantKeys.forEach(key => {
      if (layers[key] && data.data[key]) {
        activeDatasets[key] = data.data[key];
      }
    });

    if (Object.keys(activeDatasets).length === 0) return [];

    const radius = serviceRadius || 3.0;

    // Generate a 20x20 grid over Bangalore for analysis
    const grid = generateCityGrid(12.82, 13.12, 77.38, 77.78, 20);
    const analyzed = analyzeUnderservedAreas(grid, activeDatasets, radius);
    return analyzed.filter((cell: GridCell) => cell.isUnderserved);
  }, [data, layers, serviceRadius]);

  if (!mounted) {
    return <div className="w-full h-full bg-slate-100 animate-pulse rounded-2xl" />;
  }

  const infraData = data?.data || {};

  return (
    <MapContainer
      center={center}
      zoom={12}
      style={{ height: '100%', width: '100%' }}
      zoomControl={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Hospitals */}
      {layers.hospitals && infraData.hospitals?.map((h: any) => (
        <CircleMarker
          key={`h-${h.id}`}
          center={[h.lat, h.lon]}
          radius={5}
          pathOptions={{ color: COLORS.hospitals, fillColor: COLORS.hospitals, fillOpacity: 0.8, weight: 1 }}
        >
          <Popup>
            <div className="p-1">
              <p className="font-bold text-sm text-slate-800">{h.name || 'Hospital'}</p>
              <p className="text-xs text-slate-500">Healthcare Facility</p>
            </div>
          </Popup>
        </CircleMarker>
      ))}

      {/* Schools */}
      {layers.schools && infraData.schools?.map((s: any) => (
        <CircleMarker
          key={`s-${s.id}`}
          center={[s.lat, s.lon]}
          radius={4}
          pathOptions={{ color: COLORS.schools, fillColor: COLORS.schools, fillOpacity: 0.8, weight: 1 }}
        >
          <Popup>
            <div className="p-1">
              <p className="font-bold text-sm text-slate-800">{s.name || 'School'}</p>
              <p className="text-xs text-slate-500">Educational Institution</p>
            </div>
          </Popup>
        </CircleMarker>
      ))}

      {/* Traffic Nodes */}
      {layers.trafficNodes && infraData.trafficNodes?.map((t: any) => (
        <CircleMarker
          key={`t-${t.id}`}
          center={[t.lat, t.lon]}
          radius={3}
          pathOptions={{ color: COLORS.trafficNodes, fillColor: COLORS.trafficNodes, fillOpacity: 0.7, weight: 1 }}
        />
      ))}

      {/* Pharmacies */}
      {layers.pharmacies && infraData.pharmacies?.map((p: any) => (
        <CircleMarker
          key={`p-${p.id}`}
          center={[p.lat, p.lon]}
          radius={4}
          pathOptions={{ color: COLORS.pharmacies, fillColor: COLORS.pharmacies, fillOpacity: 0.8, weight: 1 }}
        >
          <Popup>
            <div className="p-1">
              <p className="font-bold text-sm text-slate-800">{p.name || 'Pharmacy'}</p>
              <p className="text-xs text-slate-500">Medical Store</p>
            </div>
          </Popup>
        </CircleMarker>
      ))}

      {/* Police Stations */}
      {layers.police && infraData.police?.map((p: any) => (
        <CircleMarker
          key={`po-${p.id}`}
          center={[p.lat, p.lon]}
          radius={5}
          pathOptions={{ color: COLORS.police, fillColor: COLORS.police, fillOpacity: 0.8, weight: 1 }}
        >
          <Popup>
            <div className="p-1">
              <p className="font-bold text-sm text-slate-800">{p.name || 'Police Station'}</p>
              <p className="text-xs text-slate-500">Law Enforcement</p>
            </div>
          </Popup>
        </CircleMarker>
      ))}

      {/* Underserved Areas (Red overlays) */}
      {layers.serviceGaps && underservedZones.map((zone, idx) => {
        const bounds: [number, number][] = zone.bounds.map(b => [b.lat, b.lon] as [number, number]);
        return (
          <Polygon
            key={`zone-${idx}`}
            positions={bounds}
            pathOptions={{
              color: '#ef4444',
              fillColor: '#ef4444',
              fillOpacity: 0.45,
              weight: 0,
            }}
          >
            <Popup>
              <div className="p-1">
                <p className="font-bold text-red-600 text-sm">⚠️ Unserved Area</p>
                <p className="text-xs text-slate-500 mt-1">
                  Nearest core service: <strong>{zone.distanceToNearest.toFixed(1)} km</strong> away
                </p>
                <p className="text-[10px] text-slate-400 mt-2">Lacks all selected map services within a {serviceRadius || 3.0}km radius.</p>
              </div>
            </Popup>
          </Polygon>
        );
      })}
    </MapContainer>
  );
}

'use client';

import { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Search, ChevronDown, HelpCircle } from 'lucide-react';

const InfrastructureMap = dynamic(() => import('@/components/features/map/InfrastructureMap'), { ssr: false });

import { DashboardTabProps } from '@/types';

const layerOptions = [
  { key: 'serviceGaps', label: 'Heatmap: Service Gaps', active: true, accent: true },
  { key: 'hospitals', label: 'Hospitals', active: true },
  { key: 'schools', label: 'Schools', active: true },
  { key: 'trafficNodes', label: 'Traffic Nodes', active: false },
  { key: 'pharmacies', label: 'Pharmacies', active: true },
  { key: 'police', label: 'Police Stations', active: true },
];

export default function MapTab({ data, showToast }: DashboardTabProps) {
  const [layers, setLayers] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    layerOptions.forEach(l => init[l.key] = l.active);
    return init;
  });
  const [serviceRadius, setServiceRadius] = useState(3.0);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleLayer = (key: string) => {
    setLayers(prev => ({ ...prev, [key]: !prev[key] }));
    const layerName = layerOptions.find(l => l.key === key)?.label;
    if (showToast) showToast(`${layers[key] ? 'Hidden' : 'Showing'} ${layerName} layer`);
  };

  const counts = data?.counts || {};
  const totalInstitutions = (counts.hospitals || 0) + (counts.schools || 0) + (counts.trafficNodes || 0) + (counts.pharmacies || 0) + (counts.police || 0);

  const serviceGaps = useMemo(() => {
    const h = counts.hospitals || 0;
    const s = counts.schools || 0;
    const t = counts.trafficNodes || 0;
    const total = h + s + t;
    return {
      healthcare: total > 0 ? Math.min(Math.round((h / total) * 100 * 2.5), 100) : 82,
      pharmacy: total > 0 ? Math.min(Math.round((s / total) * 100 * 1.5), 100) : 45,
      transit: total > 0 ? Math.min(Math.round((t / total) * 100 * 1.2), 100) : 61,
      gapRatio: 14,
    };
  }, [counts]);

  return (
    <div className="h-full w-full relative">
      {/* Full-screen map background */}
      <div className="absolute inset-0 z-0">
        <InfrastructureMap data={data} layers={layers} serviceRadius={serviceRadius} />
      </div>
      {/* Layers panel */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 z-20">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl px-4 py-3 shadow-lg border border-white/70">
          <div className="flex items-center justify-between mb-2.5">
            <p className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">Active Layers</p>
            <div className="flex items-center gap-2 pl-6">
              <span className="text-[10px] font-bold text-slate-500">{serviceRadius.toFixed(1)}km radius</span>
              <input
                type="range"
                min="0.5" max="5" step="0.5"
                value={serviceRadius}
                onChange={(e) => setServiceRadius(parseFloat(e.target.value))}
                className="w-16 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-500"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {layerOptions.map(layer => (
              <button
                key={layer.key}
                onClick={() => toggleLayer(layer.key)}
                className={layers[layer.key]
                  ? layer.accent ? 'layer-pill-active' : 'layer-pill-active !bg-slate-800'
                  : 'layer-pill-inactive'
                }
              >
                {layer.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      {/* Top-right: Map Legend */}
      <div className="absolute top-10 right-8 z-20">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl px-4 py-3 shadow-lg border border-white/70 min-w-[160px]">
          <p className="text-[10px] font-bold tracking-widest text-slate-500 uppercase mb-2.5">Map Legend</p>
          <div className="space-y-2">
            {[
              { label: 'Hospitals', color: 'bg-red-500' },
              { label: 'Schools', color: 'bg-blue-500' },
              { label: 'Traffic Nodes', color: 'bg-amber-500' },
              { label: 'Pharmacies', color: 'bg-emerald-500' },
              { label: 'Police Stations', color: 'bg-violet-500' },
              { label: 'Underserved Area', color: 'bg-red-500/40 border border-red-500' },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-2.5">
                <div className={`w-3 h-3 rounded-full shrink-0 ${item.color}`} />
                <span className="text-xs font-semibold text-slate-700">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Stats - center bottom */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-4 pointer-events-none">
        {[
          { value: totalInstitutions > 0 ? totalInstitutions.toLocaleString() : '1,248', label: 'Total Institutions' },
          { value: '₹24.8 Cr', label: 'Infra Budget 2024' },
          { value: '72%', label: 'Coverage Score' },
        ].map(stat => (
          <div key={stat.label} className="bg-slate-900/92 backdrop-blur-md text-white px-7 py-5 rounded-3xl text-center min-w-[148px] shadow-2xl shadow-slate-900/30">
            <p className="text-2xl font-bold font-display tracking-tight">{stat.value}</p>
            <p className="text-[10px] tracking-widest text-slate-300 uppercase mt-1.5 font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Bottom-left: Zone Focus */}
      <div className="absolute bottom-10 left-8 z-20 max-w-[240px]">
        <div className="bg-white/70 backdrop-blur-md border border-white/50 shadow-xl rounded-2xl p-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-bold text-slate-800 text-sm font-display">Zone Focus</h3>
              <p className="text-xs text-slate-400 mt-0.5">Whitefield (E-Zone), Bangalore</p>
            </div>
            <div className="w-6 h-6 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#f97316"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Pop. Density', value: '12.4k', unit: 'sq/km' },
              { label: 'Daily Transit', value: '452k', unit: 'Commutes' },
              { label: 'Air Quality', value: '142', unit: 'AQI (Mod.)', alert: true },
            ].map(s => (
              <div key={s.label}>
                <p className="text-[9px] text-slate-400 uppercase font-semibold tracking-wide mb-1">{s.label}</p>
                <p className={`font-bold text-base font-display ${s.alert ? 'text-orange-500' : 'text-slate-800'}`}>{s.value}</p>
                <p className="text-[9px] text-slate-400">{s.unit}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom-right: Service Gaps */}
      <div className="absolute bottom-6 right-4 z-20 max-w-[260px]">
        <div className="bg-white/70 backdrop-blur-md border border-white/50 shadow-xl rounded-2xl p-4">
          <h3 className="font-bold text-slate-800 text-sm font-display mb-1">Service Gaps</h3>
          <p className="text-xs text-slate-400 mb-3">Identify underserved wards requiring urgent resource allocation.</p>
          <div className="flex items-center gap-4">
            <div className="flex-1 space-y-3">
              {[
                { label: 'Healthcare Access', value: serviceGaps.healthcare, color: '#14b8a6' },
                { label: 'Pharmacy Density', value: serviceGaps.pharmacy, color: '#f97316' },
                { label: 'Public Transit Nodes', value: serviceGaps.transit, color: '#3b82f6' },
              ].map(g => (
                <div key={g.label}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wide">{g.label}</span>
                    <span className="text-[10px] font-bold text-slate-500">{g.value}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${g.value}%`, background: g.color }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Gap ratio donut */}
            <div className="flex flex-col items-center shrink-0">
              <div className="relative w-16 h-16">
                <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                  <circle cx="32" cy="32" r="26" fill="none" stroke="#f1f5f9" strokeWidth="7" />
                  <circle cx="32" cy="32" r="26" fill="none" stroke="#f97316" strokeWidth="7"
                    strokeDasharray={`${serviceGaps.gapRatio * 1.634} 163.4`}
                    strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-bold text-slate-800">{serviceGaps.gapRatio}%</span>
                </div>
              </div>
              <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-wide mt-1">Gap Ratio</p>
            </div>
          </div>
        </div>
      </div>

      {/* Help button bottom-right of map */}
      <div className="absolute bottom-[200px] right-4 z-20">
        <button
          onClick={() => showToast && showToast('Map help guide — coming soon')}
          className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-lg hover:bg-slate-700 transition-colors"
        >
          <HelpCircle className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

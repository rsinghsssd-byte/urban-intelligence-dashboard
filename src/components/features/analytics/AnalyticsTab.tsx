'use client';

import { useMemo } from 'react';
import { Download, RefreshCw, MoreHorizontal, Info } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend,
} from 'recharts';

import { DashboardTabProps } from '@/types';
import { analyticsDensityData, analyticsZoneData, analyticsProjectionData } from '@/lib/constants/analytics';

export default function AnalyticsTab({ data, showToast }: DashboardTabProps) {
  const counts = data?.counts || {};

  const densityData = analyticsDensityData;
  const zoneData = analyticsZoneData;
  const projectionData = analyticsProjectionData;

  const totalInstitutions = (counts.hospitals || 0) + (counts.schools || 0) + (counts.trafficNodes || 0) + (counts.pharmacies || 0) + (counts.police || 0);

  return (
    <div className="h-full flex flex-col bg-[#f8f9fa] overflow-hidden">
      {/* Header bar */}
      <div className="px-12 pt-10 pb-6 flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-display tracking-tight">Data Analytics</h1>
          <p className="text-slate-400 text-sm mt-0.5">Advanced Infrastructure &amp; Service Gap Modeling</p>
        </div>
        <div className="flex gap-3">
          <button
            className="btn-outline rounded-full"
            onClick={() => showToast && showToast('Exporting report as PDF...')}
          >
            <Download className="w-4 h-4" />
            Export PDF
          </button>
          <button
            className="btn-dark rounded-full"
            onClick={() => showToast && showToast('Syncing real-time data...')}
          >
            <RefreshCw className="w-4 h-4" />
            Real-time Sync
          </button>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-12 pb-12 space-y-4">

        {/* Hero: Core Service Gap Insights */}
        <div className="card p-10">
          <div className="flex items-start gap-6">
            <div className="flex-1">
              <span className="analytics-tag rounded-md">Exploratory Data Analysis</span>
              <h2 className="text-2xl font-bold text-slate-900 font-display mt-3 mb-3">Core Service Gap Insights</h2>
              <p className="text-sm text-slate-500 leading-relaxed max-w-xl">
                Our longitudinal study across 198 wards reveals a critical correlation between urban expansion in{' '}
                <strong className="text-slate-800">East Bangalore</strong> and healthcare undersaturation. While transit
                networks have expanded by 14%, specialized pharmacy density remains significantly below the target
                threshold for 62% of the peripheral population.
              </p>
              <div className="flex items-center gap-10 mt-5 pt-5 border-t border-slate-100">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Critical Wards</p>
                  <p className="text-2xl font-bold text-orange-500 font-display">24 / 198</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Growth Delta</p>
                  <p className="text-2xl font-bold text-teal-500 font-display">+8.2%</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Equity Score</p>
                  <p className="text-2xl font-bold text-slate-800 font-display">0.68</p>
                </div>
              </div>
            </div>

            {/* Density Surface mini chart */}
            <div className="w-52 shrink-0">
              <div className="h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={densityData.slice(0, 5)} margin={{ top: 4, right: 4, left: -32, bottom: 0 }}>
                    <Bar dataKey="population" fill="#14b8a6" radius={[0, 0, 0, 0]} barSize={20} />
                    <Bar dataKey="hospitals" fill="#14b8a6" opacity={0.5} radius={[0, 0, 0, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-center text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-2">Density Surface v2.4</p>
            </div>
          </div>
        </div>

        {/* Two-column row */}
        <div className="grid grid-cols-3 gap-4">
          {/* Institutions by Zone */}
          <div className="card p-8 col-span-1 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-slate-900 font-display">Institutions by Zone</h3>
              <button className="text-slate-400 hover:text-slate-600 p-1 rounded-md border border-transparent hover:border-slate-200 hover:bg-slate-50" onClick={() => showToast && showToast('Options menu — coming soon')}>
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex gap-2 items-start mb-4 bg-blue-50/50 p-2.5 rounded-xl border border-blue-100">
              <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
              <p className="text-xs text-slate-600 leading-snug">
                This horizontal bar chart compares the total count of infrastructure institutions across the city's four primary administrative zones.
              </p>
            </div>

            <div className="space-y-4 flex-1">
              {zoneData.map(zone => (
                <div key={zone.name}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">{zone.name}</span>
                    <span className="text-sm font-bold text-slate-800">{zone.institutions}</span>
                  </div>
                  <div className="progress-bar rounded-full h-2 bg-slate-100">
                    <div
                      className="progress-fill rounded-full bg-slate-800"
                      style={{ width: `${(zone.institutions / 450) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Coverage Growth Projection */}
          <div className="card p-8 col-span-2 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-slate-900 font-display">Coverage Growth Projection</h3>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5"><span className="inline-block w-2.5 h-2.5 rounded-full bg-teal-500" />Actual</span>
                <span className="flex items-center gap-1.5 text-slate-400"><span className="inline-block w-2.5 h-2.5 rounded-full bg-slate-300" />Forecast</span>
              </div>
            </div>
            
            <div className="flex gap-2 items-start mb-4 bg-teal-50/50 p-2.5 rounded-xl border border-teal-100">
              <Info className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
              <p className="text-xs text-slate-600 leading-snug">
                This time-series model plots historical service coverage rates alongside AI-driven forecasts for the remainder of the year.
              </p>
            </div>

            <div className="flex-1 min-h-[144px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={projectionData} margin={{ top: 5, right: 10, left: -24, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" fontSize={10} tickLine={false} axisLine={false} tick={{ fill: '#94a3b8' }} />
                  <YAxis fontSize={10} tickLine={false} axisLine={false} tick={{ fill: '#94a3b8' }} />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                  />
                  <Line
                    type="monotone" dataKey="actual" stroke="#14b8a6" strokeWidth={2.5}
                    dot={{ r: 3.5, fill: '#fff', stroke: '#14b8a6', strokeWidth: 2 }}
                    connectNulls={false}
                  />
                  <Line
                    type="monotone" dataKey="forecast" stroke="#cbd5e1" strokeWidth={2}
                    strokeDasharray="5 3"
                    dot={{ r: 3, fill: '#fff', stroke: '#cbd5e1', strokeWidth: 1.5 }}
                    connectNulls={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* 3D Population Density Index */}
        <div className="card p-10">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-bold text-slate-900 font-display text-lg">3D Population Density Index</h3>
              <p className="text-sm text-slate-400 mt-1 max-w-sm">
                Visualizing the volumetric impact of population surge on existing infrastructure nodes.
                The Z-axis represents ward-level saturation pressure.
              </p>
            </div>
            <div className="flex gap-2 items-start max-w-xs bg-indigo-50/50 p-2.5 rounded-none border-l-2 border-indigo-400">
              <Info className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
              <p className="text-xs text-slate-600 leading-snug">
                A multi-dimensional bar chart overlapping population volume against health and education assets to highlight saturation pressure per district.
              </p>
            </div>
          </div>
          <div className="flex items-end gap-10 mb-4">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Peak Pressure</p>
              <p className="text-2xl font-bold text-slate-800 font-display">92.4%</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Volumetric Load</p>
              <p className="text-2xl font-bold text-slate-800 font-display">1.4x</p>
            </div>
          </div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={densityData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }} barGap={2}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" fontSize={11} tickLine={false} axisLine={false} tick={{ fill: '#64748b' }} />
                <YAxis fontSize={11} tickLine={false} axisLine={false} tick={{ fill: '#94a3b8' }} />
                <Tooltip
                  cursor={{ fill: '#f8f9fc' }}
                  contentStyle={{ borderRadius: '0px', border: '1px solid #e2e8f0', boxShadow: 'none', fontSize: '12px' }}
                />
                <Bar dataKey="population" fill="#14b8a6" radius={[0, 0, 0, 0]} barSize={22} name="Population (k)" />
                <Bar dataKey="hospitals" fill="#f97316" radius={[0, 0, 0, 0]} barSize={22} name="Hospitals" />
                <Bar dataKey="schools" fill="#14b8a6" opacity={0.6} radius={[0, 0, 0, 0]} barSize={22} name="Schools" />
                <Bar dataKey="population" fill="#0f172a" radius={[0, 0, 0, 0]} barSize={22} name="Density Index" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

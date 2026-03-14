'use client';

import { FileText, Waves, Bus, TreePine } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';

import { DashboardTabProps } from '@/types';
import { strategies, impactData, infraPriorities } from '@/lib/constants/strategy';

export default function StrategyTab({ data, showToast }: DashboardTabProps) {
  return (
    <div className="h-full flex flex-col bg-[#f8f9fa] overflow-hidden">
      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-12 py-10 space-y-4 pb-12">

        {/* Strategy Overview Hero */}
        <div className="card p-10 bg-gradient-to-br from-slate-50 via-blue-50/30 to-white overflow-hidden relative">
          <div className="absolute -top-8 -right-8 w-48 h-48 rounded-full bg-teal-50/60 pointer-events-none" />
          <div className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full bg-blue-50/40 pointer-events-none" />
          <div className="relative z-10 flex items-start justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-slate-900 font-display mb-3 tracking-tight">Strategy Overview</h1>
              <p className="text-slate-500 text-sm leading-relaxed max-w-lg">
                AI-driven recommendations for city-wide public service improvements based on current
                population density and infrastructure gaps.
              </p>
            </div>
            <button
              className="btn-dark shrink-0 mt-1 rounded-full"
              onClick={() => showToast && showToast('Generating detailed strategy report...')}
            >
              <FileText className="w-4 h-4" />
              Generate Detailed Report
            </button>
          </div>
        </div>

        {/* Strategy Cards */}
        <div className="grid grid-cols-3 gap-4">
          {strategies.map((strategy, idx) => (
            <div key={idx} className="card overflow-hidden flex flex-col hover:shadow-lg transition-shadow duration-200">
              {/* Card image/map preview */}
              <div
                className="h-40 bg-cover bg-center shrink-0 border-b border-slate-100"
                style={{ backgroundImage: `url(${strategy.image})` }}
              >
              </div>

              {/* Card content */}
              <div className="p-8 flex-1 flex flex-col">
                <div className="mb-2">
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${strategy.tagClass}`}>
                    {strategy.tag}
                  </span>
                </div>
                <h3 className="font-bold text-slate-800 text-sm mb-2 leading-snug">{strategy.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed flex-1">{strategy.description}</p>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                  <span className="text-[10px] font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">{strategy.info}</span>
                  <span className="text-xs font-bold text-teal-600">{strategy.impactScore} Impact Score</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom row */}
        <div className="grid grid-cols-5 gap-4">
          {/* Projected Impact */}
          <div className="col-span-3 card p-8 flex flex-col">
            <div className="flex items-center justify-between mb-1">
              <div>
                <h3 className="font-bold text-slate-800 font-display">Projected Impact</h3>
                <p className="text-xs text-slate-400 mt-0.5">Gap reduction over next 12 months</p>
              </div>
              <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">Healthcare Gap</span>
            </div>
            <div className="flex-1 min-h-[180px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={impactData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }} barSize={48}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="quarter" tick={{ fill: '#94a3b8', fontSize: 12 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '0', fontSize: '12px' }} />
                  <Bar dataKey="value" radius={[0, 0, 0, 0]}>
                    {impactData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill="#14b8a6" />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Infrastructure priority */}
          <div className="col-span-2 card p-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800 font-display">Infrastructure</h3>
              <button
                className="text-xs font-bold text-teal-600 hover:text-teal-500 transition-colors uppercase tracking-wide"
                onClick={() => showToast && showToast('Infrastructure list — coming soon')}
              >
                Manage List
              </button>
            </div>
            <div className="space-y-4">
              {infraPriorities.map((item, idx) => {
                const Icon = item.icon;
                const [textColor, bgColor] = item.color.split(' ');
                return (
                  <div key={idx} className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl ${bgColor} flex items-center justify-center shrink-0`}>
                      <Icon className={`w-5 h-5 ${textColor}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-700">{item.label}</p>
                      <p className="text-xs text-slate-400">{item.pending} Pending</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-bold ${textColor}`}>{item.score}</p>
                      <p className={`text-[10px] font-bold uppercase tracking-wider ${textColor}`}>{item.severity}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  PieChart, Pie, Cell
} from 'recharts';
import { motion } from 'framer-motion';

interface DashboardProps {
  data: any;
}

const COLORS = ['#ff2a2a', '#00f0ff', '#eab308', '#b026ff'];

export default function AnalyticsDashboard({ data }: DashboardProps) {

  const stats = useMemo(() => {
    if (!data || !data.counts) return [];
    return [
      { name: 'Hospitals', value: data.counts.hospitals, color: COLORS[0] },
      { name: 'Schools', value: data.counts.schools, color: COLORS[1] },
      { name: 'Traffic Nodes', value: data.counts.trafficNodes, color: COLORS[2] },
      { name: 'Buildings (Sample)', value: data.counts.buildings, color: COLORS[3] },
    ];
  }, [data]);

  const radarData = useMemo(() => {
    if (!data || !data.counts) return [];
    
    // Normalizing data just for visual effect on radar chart
    const maxVal = Math.max(
      data.counts.hospitals, 
      data.counts.schools, 
      data.counts.trafficNodes,
      data.counts.buildings / 10 // scale down buildings
    );
    
    return [
      { subject: 'Hospitals', A: (data.counts.hospitals / maxVal) * 100 },
      { subject: 'Schools', A: (data.counts.schools / maxVal) * 100 },
      { subject: 'Traffic Flow', A: (data.counts.trafficNodes / maxVal) * 100 },
      { subject: 'Infrastructure', A: ((data.counts.buildings / 10) / maxVal) * 100 },
    ];
  }, [data]);

  if (!data) return <div className="animate-pulse w-full h-[300px] bg-slate-800/50 rounded-xl" />;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-panel p-3 rounded-lg border-white/20">
          <p className="font-semibold text-white">{label}</p>
          <p style={{ color: payload[0].payload.color }}>
            Count: {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="w-full flex flex-col gap-6"
    >
      <div className="flex gap-4 mb-4">
        {stats.map((stat, idx) => (
          <motion.div 
            key={stat.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + (idx * 0.1) }}
            className="flex-1 glass-panel p-4 rounded-xl flex flex-col items-center justify-center transform transition-all hover:scale-105"
            style={{ borderTop: `2px solid ${stat.color}` }}
          >
            <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider text-center">{stat.name}</h3>
            <p className="text-3xl font-bold mt-2" style={{ color: stat.color, textShadow: `0 0 15px ${stat.color}80` }}>
              {stat.value.toLocaleString()}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[300px]">
        {/* Bar Chart */}
        <div className="glass-panel rounded-xl p-4 flex flex-col relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-neonBlue/10 rounded-full blur-3xl -mr-10 -mt-10 transition-all group-hover:bg-neonBlue/20" />
          <h3 className="text-white font-medium mb-4 z-10">Infrastructure Counts</h3>
          <div className="flex-1 w-full z-10 min-h-0 relative">
            <div className="absolute inset-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {stats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Radar Chart */}
        <div className="glass-panel rounded-xl p-4 flex flex-col relative overflow-hidden group">
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-neonPurple/10 rounded-full blur-3xl -ml-10 -mb-10 transition-all group-hover:bg-neonPurple/20" />
          <h3 className="text-white font-medium mb-4 z-10">Density Distribution Index</h3>
          <div className="flex-1 w-full z-10 min-h-0 relative">
            <div className="absolute inset-0">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid stroke="#ffffff20" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <PolarRadiusAxis tick={false} axisLine={false} />
                  <Radar name="Density" dataKey="A" stroke="#b026ff" fill="#b026ff" fillOpacity={0.3} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

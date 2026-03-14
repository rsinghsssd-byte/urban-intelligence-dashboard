'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Sidebar from '@/components/layout/Sidebar';
import Toast from '@/components/ui/Toast';
import { useDashboardData } from '@/hooks/useDashboardData';

const MapTab = dynamic(() => import('@/components/features/map/MapTab'), { ssr: false });
const AnalyticsTab = dynamic(() => import('@/components/features/analytics/AnalyticsTab'), { ssr: false });
const StrategyTab = dynamic(() => import('@/components/features/strategy/StrategyTab'), { ssr: false });

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState(0);
  const { data, loading } = useDashboardData();
  const [toast, setToast] = useState({ message: '', visible: false });

  const showToast = (message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000);
  };



  return (
    // Sidebar is always a flex sibling — it NEVER overlaps content
    <div className="h-screen w-screen bg-[#f0f2f5] overflow-hidden flex">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} showToast={showToast} />

      {/* Content takes all remaining space */}
      <main className="flex-1 h-full overflow-hidden min-w-0">
        {loading ? (
          <div className="w-full h-full flex flex-col items-center justify-center gap-4">
            <div className="relative">
              <div className="w-14 h-14 border-2 border-teal-500/30 rounded-full" />
              <div className="absolute inset-0 w-14 h-14 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
            </div>
            <p className="text-slate-400 tracking-widest text-sm font-medium">Loading infrastructure data...</p>
          </div>
        ) : (
          <div className="w-full h-full">
            {activeTab === 0 && <MapTab data={data} showToast={showToast} />}
            {activeTab === 1 && <AnalyticsTab data={data} showToast={showToast} />}
            {activeTab === 2 && <StrategyTab data={data} showToast={showToast} />}
          </div>
        )}
      </main>

      {/* Global Toast */}
      <Toast toast={toast} />
    </div>
  );
}

'use client';

import { Home, BarChart3, Lightbulb } from 'lucide-react';

interface SidebarProps {
  activeTab: number;
  onTabChange: (tab: number) => void;
  showToast: (message: string) => void;
}

const navItems = [
  { icon: Home, label: 'Map View', tab: 0 },
  { icon: BarChart3, label: 'Analytics', tab: 1 },
  { icon: Lightbulb, label: 'Strategy', tab: 2 },
];

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  return (
    <aside className="h-full w-[72px] bg-[#0A0B10] flex flex-col items-center py-5 border-r border-slate-800 shrink-0 z-50">
      {/* Main Nav */}
      <nav className="flex flex-col items-center gap-1.5 mt-4 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.tab;
          return (
            <button
              key={item.tab}
              onClick={() => onTabChange(item.tab)}
              className={`relative w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 group ${
                isActive
                  ? 'bg-slate-800/80 text-white shadow-lg shadow-black/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
              title={item.label}
            >
              <Icon className="w-5 h-5" strokeWidth={isActive ? 2.2 : 1.8} />
              {/* Active indicator */}
              {isActive && (
                <span className="absolute -left-[6px] top-1/2 -translate-y-1/2 w-[4px] h-6 bg-white rounded-r-full" />
              )}
              {/* Tooltip */}
              <span className="absolute left-14 bg-slate-800 text-white text-xs px-2.5 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-150 whitespace-nowrap z-50 shadow-lg">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* User avatar at bottom */}
      <div className="mt-4 w-10 h-10 rounded-full bg-slate-700 text-slate-300 flex items-center justify-center text-sm font-semibold tracking-wider cursor-pointer hover:bg-slate-600 transition-colors shadow-md border border-slate-600">
        JD
      </div>
    </aside>
  );
}

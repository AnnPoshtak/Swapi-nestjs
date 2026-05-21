import React from "react";

export interface StatItem {
  label: string;
  value: number;
  max?: number;
  color: "emerald" | "purple" | "amber" | "cyan" | "rose" | "blue";
  icon: React.ReactNode;
}

interface GenericStatsDashboardProps {
  items: StatItem[];
}
const colorMaps = {
  emerald: {
    border: "border-emerald-500/20",
    text: "text-emerald-400",
    bgBadge: "bg-emerald-500/10",
    bar: "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]",
  },
  purple: {
    border: "border-purple-500/20",
    text: "text-purple-400",
    bgBadge: "bg-purple-500/10",
    bar: "bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.6)]",
  },
  amber: {
    border: "border-amber-500/20",
    text: "text-amber-400",
    bgBadge: "bg-amber-500/10",
    bar: "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]",
  },
  cyan: {
    border: "border-cyan-500/20",
    text: "text-cyan-400",
    bgBadge: "bg-cyan-500/10",
    bar: "bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.6)]",
  },
  rose: {
    border: "border-rose-500/20",
    text: "text-rose-400",
    bgBadge: "bg-rose-500/10",
    bar: "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]",
  },
  blue: {
    border: "border-blue-500/20",
    text: "text-blue-400",
    bgBadge: "bg-blue-500/10",
    bar: "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]",
  },
};

export const GenericStatsDashboard = ({ items }: GenericStatsDashboardProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 font-mono w-full">
      {items.map((item, index) => {
        const theme = colorMaps[item.color] || colorMaps.blue;
        const maxVal = item.max || 100;
        const widthPercentage = `${Math.min((item.value / maxVal) * 100, 100)}%`;

        return (
          <div 
            key={index} 
            className={`bg-slate-900/80 border ${theme.border} rounded-xl p-3 shadow-lg flex flex-col justify-between`}
          >
            <div className={`flex justify-between items-center text-xs ${theme.text} font-bold mb-2 uppercase tracking-wider`}>
              <span className="flex items-center gap-1.5 truncate">
                {item.icon}
                <span className="truncate">{item.label}</span>
              </span>
              <span className={`${theme.bgBadge} px-2 py-0.5 rounded text-xs font-mono`}>
                {item.value}
              </span>
            </div>

            <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-800/60 mt-2">
              <div 
                className={`${theme.bar} h-full transition-all duration-500 ease-out`} 
                style={{ width: widthPercentage }}
              ></div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
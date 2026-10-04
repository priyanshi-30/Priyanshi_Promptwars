import React from 'react';
import { DimensionAnalysis, DimensionKey } from '../types';
import { Network, Scale, Target, EyeOff, ShieldAlert } from 'lucide-react';

interface DimensionCardProps {
  analysis: DimensionAnalysis;
}

const DIMENSION_ICONS: Record<DimensionKey, React.ReactNode> = {
  second_order_effects: <Network className="w-5 h-5 text-indigo-400" />,
  opportunity_costs: <Scale className="w-5 h-5 text-amber-400" />,
  goal_alignment: <Target className="w-5 h-5 text-emerald-400" />,
  information_asymmetry: <EyeOff className="w-5 h-5 text-sky-400" />,
  hidden_assumptions: <ShieldAlert className="w-5 h-5 text-purple-400" />,
};

const RISK_BADGES: Record<'high' | 'medium' | 'low', { label: string; style: string }> = {
  high: {
    label: 'High Impact Blindspot',
    style: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
  },
  medium: {
    label: 'Medium Risk Angle',
    style: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  },
  low: {
    label: 'Minor Blindspot',
    style: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
  },
};

export const DimensionCard: React.FC<DimensionCardProps> = ({ analysis }) => {
  const icon = DIMENSION_ICONS[analysis.dimension] || <EyeOff className="w-5 h-5 text-indigo-400" />;
  const badge = RISK_BADGES[analysis.riskOrImpact] || RISK_BADGES.medium;

  return (
    <div className="bg-slate-950/80 border border-slate-800 hover:border-slate-700/80 rounded-xl p-5 shadow-lg transition-all duration-200 flex flex-col justify-between">
      <div>
        {/* Card Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-slate-900 border border-slate-800 rounded-lg shrink-0">
              {icon}
            </div>
            <h4 className="text-base font-semibold text-white leading-snug">
              {analysis.title}
            </h4>
          </div>
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border shrink-0 ${badge.style}`}>
            {badge.label}
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-slate-300 leading-relaxed mb-4">
          {analysis.description}
        </p>
      </div>

      {/* Probing Question Box */}
      <div className="bg-slate-900/90 border-l-2 border-indigo-500 rounded-r-lg p-3 text-xs text-slate-300 font-medium">
        <span className="text-indigo-400 font-bold uppercase block text-[10px] tracking-wider mb-1">
          Socratic Probing Question
        </span>
        "{analysis.keyQuestion}"
      </div>
    </div>
  );
};

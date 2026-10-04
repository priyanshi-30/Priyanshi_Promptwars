import React, { useEffect, useState } from 'react';
import { Sparkles, Brain, CheckCircle2, Layers } from 'lucide-react';

export const LoadingSkeleton: React.FC = () => {
  const [pass, setPass] = useState(1);

  useEffect(() => {
    const timer1 = setTimeout(() => setPass(2), 600);
    const timer2 = setTimeout(() => setPass(3), 1200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div 
      aria-live="polite" 
      aria-busy="true"
      className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl my-8 animate-pulse"
    >
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-600/20 text-indigo-400 rounded-xl">
            <Brain className="w-6 h-6 animate-bounce" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              Gemini Socratic Analysis Engine Active
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-indigo-500/20 text-indigo-300">
                Multi-Pass Reasoning
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Evaluating facts, unstated assumptions, 5 structural dimensions, and Socratic questions...
            </p>
          </div>
        </div>
      </div>

      {/* Multi-Pass Step Progress */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className={`p-3.5 rounded-xl border transition-all ${pass >= 1 ? 'bg-indigo-950/40 border-indigo-500/40 text-indigo-300' : 'bg-slate-950 border-slate-800 text-slate-500'}`}>
          <div className="flex items-center gap-2 font-semibold text-xs mb-1">
            {pass > 1 ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Layers className="w-4 h-4 text-indigo-400 animate-spin" />}
            Pass 1: Facts vs. Assumptions
          </div>
          <p className="text-[11px] text-slate-400">Extracting explicit premises and implicit assumptions</p>
        </div>

        <div className={`p-3.5 rounded-xl border transition-all ${pass >= 2 ? 'bg-indigo-950/40 border-indigo-500/40 text-indigo-300' : 'bg-slate-950 border-slate-800 text-slate-500'}`}>
          <div className="flex items-center gap-2 font-semibold text-xs mb-1">
            {pass > 2 ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Layers className="w-4 h-4 text-indigo-400 animate-spin" />}
            Pass 2: 5 Blindspot Dimensions
          </div>
          <p className="text-[11px] text-slate-400">Evaluating second-order effects & opportunity costs</p>
        </div>

        <div className={`p-3.5 rounded-xl border transition-all ${pass >= 3 ? 'bg-indigo-950/40 border-indigo-500/40 text-indigo-300' : 'bg-slate-950 border-slate-800 text-slate-500'}`}>
          <div className="flex items-center gap-2 font-semibold text-xs mb-1">
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            Pass 3: Socratic Synthesis
          </div>
          <p className="text-[11px] text-slate-400">Building probing questions & data-gathering actions</p>
        </div>
      </div>

      {/* Skeleton Cards */}
      <div className="space-y-4 pt-2">
        <div className="h-6 bg-slate-800/80 rounded w-1/3"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-28 bg-slate-800/50 rounded-xl border border-slate-800"></div>
          <div className="h-28 bg-slate-800/50 rounded-xl border border-slate-800"></div>
        </div>
        <div className="h-40 bg-slate-800/40 rounded-xl border border-slate-800"></div>
      </div>
    </div>
  );
};

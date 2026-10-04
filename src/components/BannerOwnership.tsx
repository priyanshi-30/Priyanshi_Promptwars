import React from 'react';
import { ShieldAlert, HelpCircle } from 'lucide-react';

export const BannerOwnership: React.FC = () => {
  return (
    <div 
      role="region" 
      aria-label="Decision Ownership Banner"
      className="bg-gradient-to-r from-amber-500/15 via-indigo-500/15 to-purple-500/15 border border-amber-500/30 rounded-xl p-4 mb-6 text-slate-200 shadow-md backdrop-blur-sm"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500/20 text-amber-400 rounded-lg shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wide uppercase bg-amber-500/30 text-amber-300 border border-amber-400/40">
                Decision Ownership: 100% User
              </span>
              <span className="text-xs text-slate-400 hidden md:inline">Socratic Critical Thinking Assistant</span>
            </div>
            <p className="text-sm text-slate-300 mt-1">
              This engine illuminates blind spots, second-order effects, and missing facts. It <strong className="text-amber-300">never</strong> recommends what you should do.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <HelpCircle className="w-4 h-4 text-indigo-400" /> Non-Prescriptive Analysis
          </span>
        </div>
      </div>
    </div>
  );
};

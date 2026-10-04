import React, { useState } from 'react';
import { SocraticNode } from '../types';
import { GitBranch, Layers, HelpCircle, AlertTriangle, ArrowRight } from 'lucide-react';

interface DecisionTreeMapProps {
  nodes?: SocraticNode[];
}

export const DecisionTreeMap: React.FC<DecisionTreeMapProps> = ({ nodes = [] }) => {
  const [filter, setFilter] = useState<'all' | 'assumptions' | 'reflections'>('all');
  const [selectedNode, setSelectedNode] = useState<SocraticNode | null>(null);

  if (!nodes || nodes.length === 0) {
    return (
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-8 text-center">
        <GitBranch className="w-8 h-8 text-slate-500 mx-auto mb-2" />
        <p className="text-slate-400 text-sm">No decision tree nodes generated yet.</p>
      </div>
    );
  }

  const root = nodes.find(n => n.type === 'root');
  const assumptions = nodes.filter(n => n.type === 'assumption');
  const dimensions = nodes.filter(n => n.type === 'dimension');
  const questions = nodes.filter(n => n.type === 'question');
  const reflections = nodes.filter(n => n.type === 'reflection');

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-xl">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-indigo-400" />
            Dynamic Socratic Decision Node Map
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Visual breakdown of stated premises, unstated assumptions, and answered reflections.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              filter === 'all' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Nodes
          </button>
          <button
            type="button"
            onClick={() => setFilter('assumptions')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              filter === 'assumptions' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Assumptions Only
          </button>
          <button
            type="button"
            onClick={() => setFilter('reflections')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              filter === 'reflections' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Answered Reflections
          </button>
        </div>
      </div>

      {/* Interactive Visual Graph Canvas */}
      <div className="overflow-x-auto pb-4">
        <div className="min-w-[650px] space-y-8 py-2">
          
          {/* Level 0: Decision Root */}
          <div className="flex justify-center">
            <div 
              onClick={() => setSelectedNode(root || null)}
              className="bg-gradient-to-r from-indigo-900/80 to-purple-900/80 border-2 border-indigo-500 rounded-xl p-4 max-w-lg text-center shadow-lg shadow-indigo-500/10 cursor-pointer hover:border-amber-400 transition-all"
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded border border-indigo-400/30">
                Core Decision Goal
              </span>
              <h4 className="text-base font-bold text-white mt-1">
                "{root?.label || 'Decision Goal'}"
              </h4>
            </div>
          </div>

          {/* Connective Line */}
          <div className="w-0.5 h-6 bg-gradient-to-b from-indigo-500 to-slate-700 mx-auto"></div>

          {/* Level 1: Multi-Pass Breakdown Columns */}
          <div className="grid grid-cols-3 gap-4">
            
            {/* Column A: Stated Facts vs Unstated Assumptions */}
            {(filter === 'all' || filter === 'assumptions') && (
              <div className="space-y-3 bg-slate-900/80 border border-slate-800 rounded-xl p-4">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-300 border-b border-slate-800 pb-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  Unstated Assumptions ({assumptions.length})
                </div>
                <div className="space-y-2">
                  {assumptions.map((ass, i) => (
                    <div 
                      key={ass.id || i}
                      onClick={() => setSelectedNode(ass)}
                      className="bg-slate-950 border border-amber-500/30 rounded-lg p-3 text-xs text-amber-200 cursor-pointer hover:border-amber-400 transition-all"
                    >
                      <span className="font-semibold block text-amber-400 text-[10px] uppercase">Assumption #{i+1}</span>
                      {ass.label}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Column B: Analytical Dimensions */}
            {filter === 'all' && (
              <div className="space-y-3 bg-slate-900/80 border border-slate-800 rounded-xl p-4">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-300 border-b border-slate-800 pb-2">
                  <Layers className="w-4 h-4 text-indigo-400" />
                  Overlooked Dimensions ({dimensions.length})
                </div>
                <div className="space-y-2">
                  {dimensions.map((dim, i) => (
                    <div 
                      key={dim.id || i}
                      onClick={() => setSelectedNode(dim)}
                      className="bg-slate-950 border border-indigo-500/30 rounded-lg p-3 text-xs text-indigo-200 cursor-pointer hover:border-indigo-400 transition-all"
                    >
                      <span className="font-semibold block text-indigo-400 text-[10px] uppercase">Dimension #{i+1}</span>
                      {dim.label}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Column C: Socratic Questions & Answered Reflections */}
            {(filter === 'all' || filter === 'reflections') && (
              <div className="space-y-3 bg-slate-900/80 border border-slate-800 rounded-xl p-4">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-300 border-b border-slate-800 pb-2">
                  <HelpCircle className="w-4 h-4 text-emerald-400" />
                  Socratic Reflections ({reflections.length})
                </div>
                <div className="space-y-2">
                  {questions.map((q, i) => {
                    const ansNode = reflections.find(r => r.parentId === `q_${q.id}`);
                    return (
                      <div 
                        key={q.id || i}
                        onClick={() => setSelectedNode(q)}
                        className={`border rounded-lg p-3 text-xs transition-all cursor-pointer ${
                          ansNode 
                            ? 'bg-slate-950 border-emerald-500/40 text-emerald-200 hover:border-emerald-400' 
                            : 'bg-slate-950/60 border-slate-800 text-slate-400'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="font-semibold text-[10px] uppercase text-emerald-400">
                            Question #{i+1}
                          </span>
                          {ansNode && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300">
                              Answered
                            </span>
                          )}
                        </div>
                        <p className="line-clamp-2">{q.label}</p>
                        {ansNode && (
                          <div className="mt-2 pt-2 border-t border-slate-800/80 text-[11px] text-slate-300 italic flex items-start gap-1">
                            <ArrowRight className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                            <span className="line-clamp-2">Reflection: "{ansNode.label}"</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Node Detail Popup / Drawer */}
      {selectedNode && (
        <div className="mt-4 p-4 rounded-xl bg-slate-900 border border-slate-700 flex items-start justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
              Selected Node Details ({selectedNode.type})
            </span>
            <p className="text-sm font-semibold text-white mt-1">{selectedNode.label}</p>
            {selectedNode.details && (
              <p className="text-xs text-slate-400 mt-1">{selectedNode.details}</p>
            )}
          </div>
          <button
            type="button"
            onClick={() => setSelectedNode(null)}
            className="text-xs text-slate-400 hover:text-white px-2 py-1 bg-slate-800 rounded"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

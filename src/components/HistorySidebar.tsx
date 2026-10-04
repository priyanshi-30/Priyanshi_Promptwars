import React, { useState } from 'react';
import { DecisionRecord } from '../types';
import { formatDate, truncateText } from '../utils/sanitize';
import { History, X, Trash2, Plus, Search, Compass, ChevronRight } from 'lucide-react';

interface HistorySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  history: DecisionRecord[];
  currentRecordId: string | null;
  onSelectRecord: (record: DecisionRecord) => void;
  onNewDecision: () => void;
  onDeleteRecord: (recordId: string) => void;
}

export const HistorySidebar: React.FC<HistorySidebarProps> = ({
  isOpen,
  onClose,
  history,
  currentRecordId,
  onSelectRecord,
  onNewDecision,
  onDeleteRecord,
}) => {
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filteredHistory = history.filter(record => 
    record.input.summary.toLowerCase().includes(search.toLowerCase()) ||
    record.input.context.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-slate-900 border-l border-slate-800 text-slate-100 flex flex-col shadow-2xl">
          
          {/* Header */}
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-indigo-400" />
              <h3 className="text-lg font-bold text-white">Decision History</h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close history sidebar"
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* New Decision Button & Search */}
          <div className="p-4 border-b border-slate-800 space-y-3">
            <button
              type="button"
              onClick={() => {
                onNewDecision();
                onClose();
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Start New Decision Analysis</span>
            </button>

            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search history..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* History List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {filteredHistory.length === 0 ? (
              <div className="text-center py-12 text-slate-500 space-y-2">
                <Compass className="w-8 h-8 mx-auto text-slate-600" />
                <p className="text-sm">No saved decision analyses found.</p>
              </div>
            ) : (
              filteredHistory.map((record) => {
                const isActive = record.id === currentRecordId;

                return (
                  <div
                    key={record.id}
                    className={`group relative p-4 rounded-xl border transition-all cursor-pointer ${
                      isActive 
                        ? 'bg-indigo-950/60 border-indigo-500/80 shadow-md' 
                        : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                    }`}
                    onClick={() => {
                      onSelectRecord(record);
                      onClose();
                    }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-2">
                        "{record.input.summary}"
                      </h4>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteRecord(record.id);
                        }}
                        aria-label="Delete record"
                        className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 transition-all"
                        title="Delete record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                      {truncateText(record.input.context || record.input.reasoning, 70)}
                    </p>

                    <div className="flex items-center justify-between mt-3 text-[10px] text-slate-500 font-mono">
                      <span>{formatDate(record.createdAt)}</span>
                      <span className="flex items-center gap-1 text-indigo-400">
                        View <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

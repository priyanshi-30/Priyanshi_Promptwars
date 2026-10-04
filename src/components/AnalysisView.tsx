import React, { useState } from 'react';
import { DecisionRecord } from '../types';
import { BannerOwnership } from './BannerOwnership';
import { DimensionCard } from './DimensionCard';
import { SocraticQuestions } from './SocraticQuestions';
import { DecisionTreeMap } from './DecisionTreeMap';
import { exportToMarkdown, downloadFile } from '../utils/export';
import { 
  CheckCircle2, 
  HelpCircle, 
  Layers, 
  ListOrdered, 
  GitBranch, 
  Download, 
  Share2, 
  RefreshCw, 
  FileText,
  AlertTriangle,
  Lightbulb
} from 'lucide-react';

interface AnalysisViewProps {
  record: DecisionRecord;
  onUpdateReflection: (questionId: string, reflectionText: string) => void;
  onNewDecision: () => void;
}

export const AnalysisView: React.FC<AnalysisViewProps> = ({
  record,
  onUpdateReflection,
  onNewDecision,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'dimensions' | 'questions' | 'actions' | 'map'>('overview');
  const [copied, setCopied] = useState(false);

  const { input, analysis, reflectionsHistory, nodes } = record;

  const handleExportMarkdown = () => {
    const md = exportToMarkdown(record);
    const filename = `blindspot-analysis-${record.id}.md`;
    downloadFile(md, filename, 'text/markdown');
  };

  const handleShareCopy = () => {
    const md = exportToMarkdown(record);
    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. Visual Warning Tag: Decision Ownership: 100% User */}
      <BannerOwnership />

      {/* Decision Summary Header Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded border border-indigo-500/20">
            Active Decision Analysis
          </span>
          <h2 className="text-xl md:text-2xl font-bold text-white mt-2 leading-snug">
            "{input.summary}"
          </h2>
          <p className="text-xs text-slate-400 mt-1 line-clamp-2">
            Context: {input.context || 'None specified'}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-start md:self-center shrink-0">
          <button
            type="button"
            onClick={handleExportMarkdown}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            title="Download Markdown Report"
          >
            <Download className="w-3.5 h-3.5 text-indigo-400" />
            <span>Export MD</span>
          </button>

          <button
            type="button"
            onClick={handleShareCopy}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            title="Copy Analysis to Clipboard"
          >
            <Share2 className="w-3.5 h-3.5 text-amber-400" />
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>

          <button
            type="button"
            onClick={onNewDecision}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>New Analysis</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800 no-scrollbar">
        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'overview'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          Pass 1: Stated Facts vs. Assumptions
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('dimensions')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'dimensions'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          Pass 2: 5 Overlooked Dimensions
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('questions')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'questions'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          Pass 3: Probing Questions ({analysis.socraticQuestions.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('actions')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'actions'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <ListOrdered className="w-4 h-4" />
          Data-Gathering Actions ({analysis.dataSteps.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('map')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'map'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <GitBranch className="w-4 h-4 text-amber-300" />
          Visual Decision Tree Map
        </button>
      </div>

      {/* TAB 1: PASS 1 - STATED FACTS VS UNSTATED ASSUMPTIONS */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Stated Facts Card */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-slate-800">
              <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Stated Facts & Verified Premises</h3>
                <p className="text-xs text-slate-400">Explicit evidence specified in input context</p>
              </div>
            </div>

            <ul className="space-y-3">
              {analysis.factsAndAssumptions.statedFacts.map((fact, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs text-slate-200 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 shrink-0"></span>
                  <span>{fact}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Unstated Assumptions Card */}
          <div className="bg-slate-950 border border-amber-500/30 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-slate-800">
              <div className="p-2 bg-amber-500/15 text-amber-400 rounded-lg">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Identified Unstated Assumptions</h3>
                <p className="text-xs text-slate-400">Implicit unexamined premises embedded in reasoning</p>
              </div>
            </div>

            <ul className="space-y-3">
              {analysis.factsAndAssumptions.unstatedAssumptions.map((ass, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs text-amber-200 bg-amber-500/5 p-3 rounded-xl border border-amber-500/20">
                  <span className="w-2 h-2 rounded-full bg-amber-400 mt-1.5 shrink-0"></span>
                  <span>{ass}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* TAB 2: PASS 2 - 5 OVERLOOKED DIMENSIONS */}
      {activeTab === 'dimensions' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {analysis.dimensions.map((dim, idx) => (
            <DimensionCard key={idx} analysis={dim} />
          ))}
        </div>
      )}

      {/* TAB 3: PASS 3 - SOCRATIC PROBING QUESTIONS & REFLECTIONS */}
      {activeTab === 'questions' && (
        <SocraticQuestions
          questions={analysis.socraticQuestions}
          onSaveReflection={onUpdateReflection}
          reflectionsHistory={reflectionsHistory}
        />
      )}

      {/* TAB 4: CONCRETE DATA-GATHERING ACTIONS */}
      {activeTab === 'actions' && (
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-lg">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-xl">
              <Lightbulb className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Actionable Data-Gathering Plan</h3>
              <p className="text-xs text-slate-400">Concrete non-prescriptive data steps to reduce information asymmetry</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {analysis.dataSteps.map((step, idx) => (
              <div key={step.id || idx} className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <h4 className="text-sm font-semibold text-white">{step.action}</h4>
                </div>
                <div className="text-xs space-y-1 text-slate-300 pl-8">
                  <p><strong className="text-slate-400">Purpose:</strong> {step.purpose}</p>
                  <p><strong className="text-indigo-400">Target Output / Metric:</strong> {step.metricOrOutput}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: VISUAL DECISION TREE MAP */}
      {activeTab === 'map' && (
        <DecisionTreeMap nodes={nodes} />
      )}
    </div>
  );
};

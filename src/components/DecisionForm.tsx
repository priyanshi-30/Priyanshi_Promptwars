import React, { useState } from 'react';
import { DecisionInput } from '../types';
import { VoiceInputButton } from './VoiceInputButton';
import { Sparkles, Compass, ArrowRight, Zap } from 'lucide-react';

interface DecisionFormProps {
  onSubmit: (input: DecisionInput) => void;
  isAnalyzing: boolean;
}

const SAMPLE_DECISIONS: { label: string; summary: string; context: string; reasoning: string }[] = [
  {
    label: '🎓 6-Month Internship vs. Job Offer',
    summary: 'Should I take a 6-month specialized AI internship or accept a stable full-time junior software engineer offer?',
    context: 'Internship offers \$4,000/mo in a high-growth AI startup (remote), no guarantee of full-time return offer. Full-time job offers \$90,000/yr salary with full benefits in a medium-sized enterprise company (hybrid, 3 days in office). Current goal: rapid skill acceleration in machine learning.',
    reasoning: 'I feel leaning towards the internship because AI skills are in hot demand, but I am worried about financial stability if a return offer is not extended after 6 months.'
  },
  {
    label: '🚀 Joining Early-Stage Startup',
    summary: 'Should I leave my secure Senior Engineer job to join a Series A fintech startup as Lead Architect?',
    context: 'Current role pays \$160,000/yr with low stress and 40 hrs/wk. Startup offers \$130,000 base + 1.2% equity, 60+ hrs/wk, high ownership. Family constraints: mortgage payment and young child.',
    reasoning: 'I want to build something from 0 to 1 and accelerate my career path, but I am concerned about equity illiquidity and high workload impacting family life.'
  },
  {
    label: '🏙️ Relocating for Higher Pay',
    summary: 'Should I relocate to San Francisco for a 35% salary increase?',
    context: 'Current location: Austin, TX (low cost of living). SF offer increases total compensation from \$140k to \$190k. SF living expenses (rent, taxes) are significantly higher.',
    reasoning: 'Higher headline compensation and closer proximity to tech ecosystem meetups, but net savings might be equal or lower after SF rent.'
  }
];

export const DecisionForm: React.FC<DecisionFormProps> = ({ onSubmit, isAnalyzing }) => {
  const [summary, setSummary] = useState('');
  const [context, setContext] = useState('');
  const [reasoning, setReasoning] = useState('');
  const [activeVoiceField, setActiveVoiceField] = useState<'summary' | 'context' | 'reasoning'>('summary');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!summary.trim()) return;
    onSubmit({ summary, context, reasoning });
  };

  const loadSample = (sample: typeof SAMPLE_DECISIONS[0]) => {
    setSummary(sample.summary);
    setContext(sample.context);
    setReasoning(sample.reasoning);
  };

  const handleVoiceTranscript = (text: string) => {
    if (activeVoiceField === 'summary') {
      setSummary(prev => (prev ? `${prev} ${text}` : text));
    } else if (activeVoiceField === 'context') {
      setContext(prev => (prev ? `${prev} ${text}` : text));
    } else {
      setReasoning(prev => (prev ? `${prev} ${text}` : text));
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-2xl backdrop-blur-md">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-800">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
            <Compass className="w-6 h-6 text-indigo-400" />
            Decision Brainstorming Canvas
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Provide details about your impending decision. Socratic analysis will extract unstated assumptions and blind spots.
          </p>
        </div>

        {/* Voice Input Toggle */}
        <div className="flex items-center gap-2">
          <VoiceInputButton 
            onTranscript={handleVoiceTranscript} 
            label={`Voice to (${activeVoiceField})`} 
          />
        </div>
      </div>

      {/* Quick Sample Presets */}
      <div className="mb-6">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2.5 flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-amber-400" /> Try a Pre-Loaded Scenario:
        </span>
        <div className="flex flex-wrap gap-2">
          {SAMPLE_DECISIONS.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => loadSample(sample)}
              className="text-xs px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/80 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              {sample.label}
            </button>
          ))}
        </div>
      </div>

      {/* Decision Input Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Field 1: Summary */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label 
              htmlFor="decision-summary" 
              className="block text-sm font-medium text-slate-200"
              onClick={() => setActiveVoiceField('summary')}
            >
              1. Primary Decision Summary <span className="text-rose-400">*</span>
            </label>
            <span className="text-[11px] text-indigo-400 font-mono">Step 1 of 3</span>
          </div>
          <input
            id="decision-summary"
            type="text"
            required
            placeholder='e.g., "Should I take a 6-month internship or full-time offer?"'
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            onFocus={() => setActiveVoiceField('summary')}
            className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700/80 text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none"
          />
        </div>

        {/* Field 2: Context & Constraints */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label 
              htmlFor="decision-context" 
              className="block text-sm font-medium text-slate-200"
              onClick={() => setActiveVoiceField('context')}
            >
              2. Context & Constraints
            </label>
            <span className="text-[11px] text-slate-400 font-mono">Stipend, location, schedule, timeline</span>
          </div>
          <textarea
            id="decision-context"
            rows={3}
            placeholder="Detail relevant facts, constraints, financial considerations, family expectations, or deadline pressure..."
            value={context}
            onChange={(e) => setContext(e.target.value)}
            onFocus={() => setActiveVoiceField('context')}
            className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700/80 text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none resize-none"
          />
        </div>

        {/* Field 3: Current Reasoning */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label 
              htmlFor="decision-reasoning" 
              className="block text-sm font-medium text-slate-200"
              onClick={() => setActiveVoiceField('reasoning')}
            >
              3. Your Current Reasoning / Justification
            </label>
            <span className="text-[11px] text-slate-400 font-mono">Why you feel drawn to an option</span>
          </div>
          <textarea
            id="decision-reasoning"
            rows={3}
            placeholder="Explain why you currently prefer one path, what core assumptions you are making, or what fears you have..."
            value={reasoning}
            onChange={(e) => setReasoning(e.target.value)}
            onFocus={() => setActiveVoiceField('reasoning')}
            className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700/80 text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none resize-none"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-3">
          <button
            type="submit"
            disabled={isAnalyzing || !summary.trim()}
            className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-semibold text-base shadow-xl shadow-indigo-600/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            {isAnalyzing ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Executing Multi-Pass Socratic Analysis...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-amber-300" />
                <span>Begin Multi-Pass Socratic Analysis</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

import React, { useState } from 'react';
import { SocraticQuestion } from '../types';
import { HelpCircle, MessageSquare, CheckCircle, Volume2, VolumeX, Send, Sparkles } from 'lucide-react';
import { useTextToSpeech } from '../hooks/useTextToSpeech';

interface SocraticQuestionsProps {
  questions: SocraticQuestion[];
  onSaveReflection: (questionId: string, reflectionText: string) => void;
  reflectionsHistory: Record<string, string>;
}

export const SocraticQuestions: React.FC<SocraticQuestionsProps> = ({
  questions,
  onSaveReflection,
  reflectionsHistory,
}) => {
  const [activeInputs, setActiveInputs] = useState<Record<string, string>>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const { speakingId, speak } = useTextToSpeech();

  const handleInputChange = (id: string, value: string) => {
    setActiveInputs(prev => ({ ...prev, [id]: value }));
  };

  const handleSave = async (id: string) => {
    const text = activeInputs[id] !== undefined ? activeInputs[id] : (reflectionsHistory[id] || '');
    setSavingId(id);
    await onSaveReflection(id, text);
    setTimeout(() => setSavingId(null), 400);
  };

  const answeredCount = questions.filter(q => Boolean(reflectionsHistory[q.id] || q.userReflection)).length;

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950 border border-slate-800 rounded-xl p-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-amber-400" />
            Targeted Socratic Probing Questions
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Answer these questions to challenge your assumptions. Your answers dynamically expand your decision map.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-center">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            {answeredCount} of {questions.length} Answered
          </span>
        </div>
      </div>

      {/* Question Cards */}
      <div className="space-y-4">
        {questions.map((q, idx) => {
          const currentAnswer = activeInputs[q.id] !== undefined 
            ? activeInputs[q.id] 
            : (reflectionsHistory[q.id] || q.userReflection || '');
          const isAnswered = Boolean((reflectionsHistory[q.id] || q.userReflection)?.trim());
          const isSpeaking = speakingId === q.id;

          return (
            <div 
              key={q.id || idx}
              className={`bg-slate-950/90 border rounded-2xl p-5 md:p-6 transition-all duration-200 shadow-lg ${
                isAnswered 
                  ? 'border-emerald-500/40 bg-slate-950' 
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Top row: Target Blindspot & Audio Narration */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  Blindspot Target: {q.targetBlindspot}
                </span>

                <button
                  type="button"
                  onClick={() => speak(q.id, q.question)}
                  aria-label={isSpeaking ? "Stop audio narration" : "Listen to question audio"}
                  className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition-all ${
                    isSpeaking 
                      ? 'bg-rose-500/20 border-rose-500/40 text-rose-300 animate-pulse' 
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                  title="Listen to question"
                >
                  {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  <span className="hidden sm:inline">{isSpeaking ? 'Stop Audio' : 'Audio Narration'}</span>
                </button>
              </div>

              {/* Probing Question */}
              <h4 className="text-base sm:text-lg font-semibold text-white leading-relaxed mb-2">
                Q{idx + 1}: "{q.question}"
              </h4>
              <p className="text-xs text-slate-400 italic mb-4">
                Socratic Prompt: {q.reflectionPrompt}
              </p>

              {/* User Interactive Reflection Input */}
              <div className="mt-4 pt-4 border-t border-slate-900">
                <label 
                  htmlFor={`reflection-${q.id}`} 
                  className="block text-xs font-semibold text-slate-300 mb-2 flex items-center justify-between"
                >
                  <span className="flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                    Your Reflection & Refinement:
                  </span>
                  {isAnswered && (
                    <span className="text-emerald-400 text-[11px] flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> Decision Map Updated
                    </span>
                  )}
                </label>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3">
                  <textarea
                    id={`reflection-${q.id}`}
                    rows={2}
                    placeholder="Type your thoughtful response here to challenge your assumption and update the decision graph..."
                    value={currentAnswer}
                    onChange={(e) => handleInputChange(q.id, e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-sm outline-none resize-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleSave(q.id)}
                    disabled={savingId === q.id}
                    className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-md shrink-0 flex items-center justify-center gap-1.5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                  >
                    {savingId === q.id ? (
                      <Sparkles className="w-4 h-4 animate-spin text-amber-300" />
                    ) : (
                      <Send className="w-3.5 h-3.5" />
                    )}
                    <span>{isAnswered ? 'Update Reflection' : 'Save & Map'}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

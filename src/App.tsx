import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { useDecisions } from './hooks/useDecisions';
import { Header } from './components/Header';
import { DecisionForm } from './components/DecisionForm';
import { AnalysisView } from './components/AnalysisView';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { HistorySidebar } from './components/HistorySidebar';
import { DataPrivacyModal } from './components/DataPrivacyModal';
import { ErrorBanner } from './components/ErrorBanner';
import { ShieldCheck, EyeOff, Sparkles } from 'lucide-react';

export const App: React.FC = () => {
  const { user, signInGoogle, signOut } = useAuth();
  const userId = user ? user.uid : null;

  const {
    history,
    currentRecord,
    isAnalyzing,
    error,
    analyzeDecision,
    updateReflection,
    selectRecord,
    clearCurrent,
    removeRecord,
    purgeAllData,
  } = useDecisions(userId);

  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* 1. Header Navigation Bar */}
      <Header
        user={user}
        onSignInGoogle={signInGoogle}
        onSignOut={signOut}
        onOpenPrivacyModal={() => setIsPrivacyOpen(true)}
        onToggleHistory={() => setIsHistoryOpen(true)}
        historyCount={history.length}
        onNewDecision={clearCurrent}
      />

      {/* 2. Main Content Canvas */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Error Display */}
        {error && <ErrorBanner message={error} onRetry={() => clearCurrent()} />}

        {/* Loading Skeleton during Multi-Pass AI execution */}
        {isAnalyzing && <LoadingSkeleton />}

        {/* Dynamic Display State */}
        {!isAnalyzing && (
          currentRecord ? (
            <AnalysisView
              record={currentRecord}
              onUpdateReflection={updateReflection}
              onNewDecision={clearCurrent}
            />
          ) : (
            <div className="space-y-10">
              {/* Hero Banner Intro */}
              <div className="text-center max-w-3xl mx-auto pt-4 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Socratic Multi-Pass Reasoning Assistant
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
                  Uncover Invisible Blind Spots in Your Decisions
                </h2>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  Most mistakes stem from unstated assumptions, second-order effects, and missing data. THE BLIND SPOT uses multi-pass Socratic analysis to challenge your premises without ever deciding for you.
                </p>
              </div>

              {/* Decision Input Form */}
              <DecisionForm
                onSubmit={analyzeDecision}
                isAnalyzing={isAnalyzing}
              />
            </div>
          )
        )}
      </main>

      {/* 3. Drawers & Modals */}
      <HistorySidebar
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        currentRecordId={currentRecord?.id || null}
        onSelectRecord={selectRecord}
        onNewDecision={clearCurrent}
        onDeleteRecord={removeRecord}
      />

      <DataPrivacyModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
        onPurgeData={purgeAllData}
      />

      {/* 4. Footer */}
      <footer className="border-t border-slate-800 bg-slate-950/80 py-6 px-4 text-center text-xs text-slate-400 space-y-2">
        <div className="flex items-center justify-center gap-4">
          <span className="flex items-center gap-1 text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Decision Ownership: 100% User
          </span>
          <span>•</span>
          <span className="flex items-center gap-1 text-slate-300">
            <EyeOff className="w-4 h-4 text-indigo-400" />
            Strictly Non-Prescriptive Tone
          </span>
        </div>
        <p className="text-slate-500">
          Powered by Google Gemini API (@google/genai) & Firebase. Built for production excellence.
        </p>
      </footer>
    </div>
  );
};

export default App;

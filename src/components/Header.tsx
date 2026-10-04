import { EyeOff, History, Shield, LogIn, LogOut, Sparkles } from 'lucide-react';
import { UserProfile } from '../types';
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
  user: UserProfile | null;
  onSignInGoogle: () => void;
  onSignOut: () => void;
  onOpenPrivacyModal: () => void;
  onToggleHistory: () => void;
  historyCount: number;
  onNewDecision: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  onSignInGoogle,
  onSignOut,
  onOpenPrivacyModal,
  onToggleHistory,
  historyCount,
  onNewDecision,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/85 backdrop-blur-md border-b border-slate-800 px-4 lg:px-8 py-3 transition-colors duration-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={onNewDecision}>
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-amber-500 shadow-lg shadow-indigo-500/20 text-white">
            <EyeOff className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
            </span>
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
              THE BLIND SPOT
              <span className="px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Socratic AI
              </span>
            </h1>
            <p className="text-xs text-slate-400 hidden sm:block">
              Multi-pass assumption & blind spot analyzer
            </p>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* New Session Button */}
          <button
            onClick={onNewDecision}
            type="button"
            className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>New Analysis</span>
          </button>

          {/* History Toggle */}
          <button
            onClick={onToggleHistory}
            type="button"
            aria-label="Toggle decision history"
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 relative"
          >
            <History className="w-4 h-4 text-slate-400" />
            <span className="hidden sm:inline">History</span>
            {historyCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-indigo-500/30 text-indigo-300 border border-indigo-400/40">
                {historyCount}
              </span>
            )}
          </button>

          {/* Privacy & Wipe Modal Trigger */}
          <button
            onClick={onOpenPrivacyModal}
            type="button"
            aria-label="Data Privacy & Security options"
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            title="Privacy & Data Control"
          >
            <Shield className="w-4 h-4 text-teal-400" />
          </button>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Auth Button */}
          {user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-700">
              {user.photoURL ? (
                <img src={user.photoURL} alt={user.displayName || 'User'} className="w-8 h-8 rounded-full border border-indigo-500/40" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-indigo-700 flex items-center justify-center text-xs font-bold text-white">
                  {user.displayName?.charAt(0) || 'G'}
                </div>
              )}
              <button
                onClick={onSignOut}
                type="button"
                aria-label="Sign out"
                className="p-1.5 text-slate-400 hover:text-white transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onSignInGoogle}
              type="button"
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white transition-all shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Google Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

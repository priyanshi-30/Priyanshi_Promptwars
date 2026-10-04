import React, { useState } from 'react';
import { Shield, ShieldAlert, Trash2, X, Lock, Database } from 'lucide-react';

interface DataPrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPurgeData: () => Promise<void>;
}

export const DataPrivacyModal: React.FC<DataPrivacyModalProps> = ({
  isOpen,
  onClose,
  onPurgeData,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  if (!isOpen) return null;

  const handlePurge = async () => {
    if (confirmText.toLowerCase() !== 'delete') return;
    setIsDeleting(true);
    try {
      await onPurgeData();
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-teal-500/10 text-teal-400 rounded-lg">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Security & Data Ownership</h3>
              <p className="text-xs text-slate-400">100% User Ownership & Privacy Guarantees</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-1 text-slate-400 hover:text-white rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Guarantees List */}
        <div className="space-y-3 text-xs text-slate-300">
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-950 border border-slate-800">
            <Lock className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">Firestore Security Rules Enforced:</strong>
              <p className="text-slate-400 mt-0.5">Row-level security ensures <code className="bg-slate-900 px-1 py-0.5 rounded text-indigo-300">request.auth.uid == resource.data.userId</code>. No third party can read or access your decision reflections.</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-950 border border-slate-800">
            <Database className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">Zero Hardcoded Keys & XSS Sanitization:</strong>
              <p className="text-slate-400 mt-0.5">All user text input is sanitized via DOMPurify before parsing or rendering.</p>
            </div>
          </div>
        </div>

        {/* Purge Section */}
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-rose-300">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span>Wipe All Local & Cloud Session Data</span>
          </div>
          <p className="text-[11px] text-slate-300">
            This action instantly purges all saved decision analyses and reflections from your device and Firestore.
          </p>

          <div className="pt-1 space-y-2">
            <label htmlFor="confirm-delete" className="block text-[11px] font-semibold text-slate-300">
              Type <span className="text-rose-400 font-mono font-bold">DELETE</span> to confirm:
            </label>
            <div className="flex items-center gap-2">
              <input
                id="confirm-delete"
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="DELETE"
                className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-600 outline-none focus:border-rose-500 font-mono"
              />
              <button
                type="button"
                onClick={handlePurge}
                disabled={confirmText.toLowerCase() !== 'delete' || isDeleting}
                className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white font-semibold text-xs shrink-0 flex items-center gap-1.5 transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{isDeleting ? 'Wiping...' : 'Wipe Data'}</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

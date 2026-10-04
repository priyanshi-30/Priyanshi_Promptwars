import { Mic, MicOff } from 'lucide-react';
import { useSpeechToText } from '../hooks/useSpeechToText';

interface VoiceInputButtonProps {
  onTranscript: (text: string) => void;
  label?: string;
}

export const VoiceInputButton: React.FC<VoiceInputButtonProps> = ({ onTranscript, label = 'Voice Input' }) => {
  const { isListening, supported, toggleListening } = useSpeechToText(onTranscript);

  if (!supported) {
    return null; // Graceful degradation if browser lacks Web Speech API
  }

  return (
    <button
      type="button"
      onClick={toggleListening}
      aria-label={isListening ? 'Stop voice recording' : 'Start voice recording'}
      aria-pressed={isListening}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
        isListening
          ? 'bg-rose-500 text-white animate-pulse shadow-lg shadow-rose-500/30'
          : 'bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-indigo-500/30 hover:border-indigo-400'
      }`}
      title={isListening ? 'Listening... Click to stop' : 'Click to speak'}
    >
      {isListening ? (
        <>
          <MicOff className="w-3.5 h-3.5 animate-bounce text-white" />
          <span>Recording... (Click to Stop)</span>
        </>
      ) : (
        <>
          <Mic className="w-3.5 h-3.5 text-indigo-400" />
          <span>{label}</span>
        </>
      )}
    </button>
  );
};

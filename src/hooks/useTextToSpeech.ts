import { useState, useCallback } from 'react';
import { speakText, stopSpeech, isSpeechSynthesisSupported } from '../services/speech';

export const useTextToSpeech = () => {
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const supported = isSpeechSynthesisSupported();

  const speak = useCallback((id: string, text: string) => {
    if (!supported) return;

    if (speakingId === id) {
      stopSpeech();
      setSpeakingId(null);
      return;
    }

    setSpeakingId(id);
    speakText(text, () => {
      setSpeakingId(null);
    });
  }, [speakingId, supported]);

  const stop = useCallback(() => {
    stopSpeech();
    setSpeakingId(null);
  }, []);

  return {
    speakingId,
    supported,
    speak,
    stop,
  };
};

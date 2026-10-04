import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Web Speech API
if (typeof window !== 'undefined') {
  window.SpeechRecognition = vi.fn();
  window.webkitSpeechRecognition = vi.fn();
  window.speechSynthesis = {
    speak: vi.fn(),
    cancel: vi.fn(),
    pause: vi.fn(),
    resume: vi.fn(),
    getVoices: vi.fn().mockReturnValue([]),
    onvoiceschanged: null,
    pending: false,
    speaking: false,
    paused: false,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  };
}

/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export type VoiceMode = 'no-bs' | 'corporate';

interface ToneContextType {
  voiceMode: VoiceMode;
  toggleVoiceMode: () => void;
  setVoiceMode: (mode: VoiceMode) => void;
}

export const ToneContext = createContext<ToneContextType | undefined>(
  undefined
);

interface ToneProviderProps {
  children: ReactNode;
}

export function ToneProvider({ children }: ToneProviderProps) {
  const [voiceMode, setVoiceMode] = useState<VoiceMode>(() => {
    const stored = localStorage.getItem('voiceMode');
    return (stored as VoiceMode) || 'no-bs';
  });

  useEffect(() => {
    localStorage.setItem('voiceMode', voiceMode);
  }, [voiceMode]);

  const toggleVoiceMode = () => {
    setVoiceMode((prev) => (prev === 'no-bs' ? 'corporate' : 'no-bs'));
  };

  const value = {
    voiceMode,
    toggleVoiceMode,
    setVoiceMode,
  };

  return <ToneContext.Provider value={value}>{children}</ToneContext.Provider>;
}

/**
 * VoiceMode Context Provider
 *
 * Manages global voice mode state (direct vs suitable-for-work)
 * with localStorage persistence.
 *
 * @version 1.0.0
 */

/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/exhaustive-deps */
import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { VoiceMode } from "@shared/types";
import { getVoiceMode, setVoiceMode as saveVoiceMode } from '../utils/storage.js';

interface VoiceModeContextValue {
  voiceMode: VoiceMode;
  setVoiceMode: (mode: VoiceMode) => void;
  toggleVoiceMode: () => void;
}

const VoiceModeContext = createContext<VoiceModeContextValue | undefined>(undefined);

export function VoiceModeProvider({ children }: { children: ReactNode }) {
  const [voiceMode, setVoiceModeState] = useState<VoiceMode>(() => getVoiceMode());

  const setVoiceMode = (mode: VoiceMode) => {
    setVoiceModeState(mode);
    saveVoiceMode(mode);
  };

  const toggleVoiceMode = () => {
    const newMode: VoiceMode = voiceMode === 'direct' ? 'suitable-for-work' : 'direct';
    setVoiceMode(newMode);
  };

  useEffect(() => {
    // Sync with localStorage on mount in case it changed in another tab
    const stored = getVoiceMode();
    if (stored !== voiceMode) {
      setVoiceModeState(stored);
    }
  }, []);

  return (
    <VoiceModeContext.Provider value={{ voiceMode, setVoiceMode, toggleVoiceMode }}>
      {children}
    </VoiceModeContext.Provider>
  );
}

export function useVoiceMode() {
  const context = useContext(VoiceModeContext);
  if (!context) {
    throw new Error('useVoiceMode must be used within VoiceModeProvider');
  }
  return context;
}

import { useContext } from 'react';
import { ToneContext } from '../contexts/ToneContext';

export function useTone() {
  const context = useContext(ToneContext);
  
  if (context === undefined) {
    throw new Error('useTone must be used within a ToneProvider');
  }
  
  return context;
}

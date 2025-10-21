/**
 * LocalStorage Utility for AI Vendor Evaluation Framework
 *
 * Handles persistence of evaluations and user preferences.
 *
 * @version 1.0.0
 */

import type { Evaluation, VoiceMode } from "@shared/types";

const STORAGE_VERSION = '1.0.0';

export const STORAGE_KEYS = {
  EVALUATIONS: 'ai-vendor-evaluations',
  CURRENT_EVALUATION_ID: 'ai-vendor-current-evaluation-id',
  VOICE_MODE: 'ai-vendor-voice-mode',
  STORAGE_VERSION: 'ai-vendor-storage-version',
} as const;

/**
 * Storage schema for evaluations
 */
interface EvaluationsStorage {
  version: string;
  evaluations: Evaluation[];
  lastModified: string;
}

/**
 * Get all evaluations from localStorage
 */
export function getAllEvaluations(): Evaluation[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.EVALUATIONS);
    if (!stored) {
      return [];
    }

    const data: EvaluationsStorage = JSON.parse(stored);

    // Version migration logic can go here in future
    if (data.version !== STORAGE_VERSION) {
      console.warn(`Storage version mismatch: ${data.version} vs ${STORAGE_VERSION}`);
    }

    return data.evaluations || [];
  } catch (error) {
    console.error('Failed to load evaluations from localStorage:', error);
    return [];
  }
}

/**
 * Save all evaluations to localStorage
 */
export function saveAllEvaluations(evaluations: Evaluation[]): boolean {
  try {
    const data: EvaluationsStorage = {
      version: STORAGE_VERSION,
      evaluations,
      lastModified: new Date().toISOString(),
    };

    const jsonString = JSON.stringify(data);

    try {
      localStorage.setItem(STORAGE_KEYS.EVALUATIONS, jsonString);
      return true;
    } catch (quotaError) {
      // Handle quota exceeded error
      if (quotaError instanceof DOMException && quotaError.name === 'QuotaExceededError') {
        console.error('LocalStorage quota exceeded. Cannot save evaluations.');
        alert(
          'Storage limit reached!\n\n' +
          'Your browser\'s storage is full. To continue:\n' +
          '1. Delete old evaluations\n' +
          '2. Export important evaluations as PDF or Markdown\n' +
          '3. Clear browser data for this site\n\n' +
          'Current size: ' + (jsonString.length / 1024).toFixed(1) + ' KB'
        );
        return false;
      }
      throw quotaError; // Re-throw if it's not a quota error
    }
  } catch (error) {
    console.error('Failed to save evaluations to localStorage:', error);
    return false;
  }
}

/**
 * Get a single evaluation by ID
 */
export function getEvaluationById(id: string): Evaluation | null {
  const evaluations = getAllEvaluations();
  return evaluations.find((e) => e.id === id) || null;
}

/**
 * Save or update a single evaluation
 */
export function saveEvaluation(evaluation: Evaluation): boolean {
  const evaluations = getAllEvaluations();
  const existingIndex = evaluations.findIndex((e) => e.id === evaluation.id);

  if (existingIndex >= 0) {
    evaluations[existingIndex] = evaluation;
  } else {
    evaluations.push(evaluation);
  }

  return saveAllEvaluations(evaluations);
}

/**
 * Delete an evaluation
 */
export function deleteEvaluation(id: string): boolean {
  const evaluations = getAllEvaluations();
  const filtered = evaluations.filter((e) => e.id !== id);

  if (filtered.length === evaluations.length) {
    // No evaluation was deleted
    return false;
  }

  // Clear current evaluation ID if it was the deleted one
  if (getCurrentEvaluationId() === id) {
    clearCurrentEvaluationId();
  }

  return saveAllEvaluations(filtered);
}

/**
 * Get current evaluation ID
 */
export function getCurrentEvaluationId(): string | null {
  return localStorage.getItem(STORAGE_KEYS.CURRENT_EVALUATION_ID);
}

/**
 * Set current evaluation ID
 */
export function setCurrentEvaluationId(id: string): void {
  localStorage.setItem(STORAGE_KEYS.CURRENT_EVALUATION_ID, id);
}

/**
 * Clear current evaluation ID
 */
export function clearCurrentEvaluationId(): void {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_EVALUATION_ID);
}

/**
 * Get voice mode preference
 */
export function getVoiceMode(): VoiceMode {
  const stored = localStorage.getItem(STORAGE_KEYS.VOICE_MODE);
  if (stored === 'direct' || stored === 'suitable-for-work') {
    return stored;
  }
  return 'suitable-for-work'; // Default
}

/**
 * Set voice mode preference
 */
export function setVoiceMode(mode: VoiceMode): void {
  localStorage.setItem(STORAGE_KEYS.VOICE_MODE, mode);
}

/**
 * Clear all storage (for testing or reset)
 */
export function clearAllStorage(): void {
  Object.values(STORAGE_KEYS).forEach((key) => {
    localStorage.removeItem(key);
  });
}

/**
 * Get storage usage estimate (in KB)
 */
export function getStorageSize(): number {
  let total = 0;
  Object.values(STORAGE_KEYS).forEach((key) => {
    const item = localStorage.getItem(key);
    if (item) {
      total += item.length;
    }
  });
  return Math.round(total / 1024); // Convert to KB
}

/**
 * Check if storage is available
 */
export function isStorageAvailable(): boolean {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

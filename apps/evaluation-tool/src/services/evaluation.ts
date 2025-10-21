/**
 * Evaluation Service
 *
 * Handles evaluation CRUD operations with auto-save debouncing
 */

import { databaseService } from './database';
import type { Answer } from "@shared/types";

/**
 * Debounced auto-save for evaluation answers
 * Waits 500ms after last change before saving to database
 */
class EvaluationService {
  private saveTimers: Map<string, number> = new Map();
  private readonly DEBOUNCE_MS = 500;

  /**
   * Auto-save answers with debouncing
   * Cancels pending save if called again within debounce window
   */
  async autoSaveAnswers(
    evaluationId: string,
    answers: Answer[]
  ): Promise<void> {
    // Clear existing timer for this evaluation
    const existingTimer = this.saveTimers.get(evaluationId);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    // Create new timer
    return new Promise((resolve, reject) => {
      const timer = setTimeout(async () => {
        try {
          await databaseService.updateEvaluation(evaluationId, answers);
          this.saveTimers.delete(evaluationId);
          resolve();
        } catch (error) {
          this.saveTimers.delete(evaluationId);
          reject(error);
        }
      }, this.DEBOUNCE_MS);

      this.saveTimers.set(evaluationId, timer);
    });
  }

  /**
   * Force immediate save (bypasses debounce)
   * Useful for explicit save actions like export or navigation
   */
  async forceSave(
    evaluationId: string,
    answers: Answer[]
  ): Promise<void> {
    // Cancel pending auto-save
    const existingTimer = this.saveTimers.get(evaluationId);
    if (existingTimer) {
      clearTimeout(existingTimer);
      this.saveTimers.delete(evaluationId);
    }

    // Save immediately
    await databaseService.updateEvaluation(evaluationId, answers);
  }

  /**
   * Cancel pending auto-save for an evaluation
   */
  cancelAutoSave(evaluationId: string): void {
    const existingTimer = this.saveTimers.get(evaluationId);
    if (existingTimer) {
      clearTimeout(existingTimer);
      this.saveTimers.delete(evaluationId);
    }
  }

  /**
   * Check if evaluation has pending save
   */
  hasPendingSave(evaluationId: string): boolean {
    return this.saveTimers.has(evaluationId);
  }
}

export const evaluationService = new EvaluationService();

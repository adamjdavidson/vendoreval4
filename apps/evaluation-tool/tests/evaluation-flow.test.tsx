/**
 * Integration test for complete evaluation flow
 *
 * Tests the entire evaluation workflow from start to finish.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import type { ReactNode } from 'react';
import { EvaluationProvider, useEvaluation } from '../src/hooks/useEvaluation';
import { VoiceModeProvider, useVoiceMode } from '../src/hooks/useVoiceMode';
import { clearAllStorage } from '../src/utils/storage';
import { QUESTIONS } from '../src/data/questions';
import { CATEGORIES } from '../src/data/categories';

// Combined wrapper with all providers
function wrapper({ children }: { children: ReactNode }) {
  return (
    <VoiceModeProvider>
      <EvaluationProvider>{children}</EvaluationProvider>
    </VoiceModeProvider>
  );
}

describe('Complete Evaluation Flow', () => {
  beforeEach(() => {
    clearAllStorage();
  });

  it('completes full evaluation workflow', () => {
    const { result } = renderHook(
      () => ({
        evaluation: useEvaluation(),
        voiceMode: useVoiceMode(),
      }),
      { wrapper }
    );

    // Step 1: Start new evaluation
    act(() => {
      result.current.evaluation.startNewEvaluation('TestVendor AI');
    });

    expect(result.current.evaluation.evaluation).not.toBe(null);
    expect(result.current.evaluation.evaluation?.vendorName).toBe('TestVendor AI');
    expect(result.current.evaluation.completionPercentage).toBe(0);

    // Step 2: Toggle voice mode
    expect(result.current.voiceMode.voiceMode).toBe('suitable-for-work');

    act(() => {
      result.current.voiceMode.toggleVoiceMode();
    });

    expect(result.current.voiceMode.voiceMode).toBe('direct');

    // Step 3: Answer all questions in SEE category as "yes"
    const seeCategory = CATEGORIES.find((c) => c.key === 'see');
    expect(seeCategory).toBeDefined();

    act(() => {
      seeCategory?.questionIds.forEach((qId) => {
        result.current.evaluation.updateAnswer(qId, 'yes', `Note for ${qId}`);
      });
    });

    // Verify category grade
    expect(result.current.evaluation.evaluation?.categoryGrades.see).toBe('green');

    // Step 4: Answer half of CHANGE category questions as "yes", half as "no"
    const changeCategory = CATEGORIES.find((c) => c.key === 'change');
    expect(changeCategory).toBeDefined();

    act(() => {
      changeCategory?.questionIds.forEach((qId, index) => {
        const value = index < changeCategory.questionIds.length / 2 ? 'yes' : 'no';
        result.current.evaluation.updateAnswer(qId, value);
      });
    });

    // Category should be yellow (mixed)
    expect(result.current.evaluation.evaluation?.categoryGrades.change).toBe('yellow');

    // Step 5: Answer all USE category questions as "not-enough-info"
    const useCategory = CATEGORIES.find((c) => c.key === 'use');
    expect(useCategory).toBeDefined();

    act(() => {
      useCategory?.questionIds.forEach((qId) => {
        result.current.evaluation.updateAnswer(qId, 'not-enough-info');
      });
    });

    // Category should be grey
    expect(result.current.evaluation.evaluation?.categoryGrades.use).toBe('grey');

    // Step 6: Check completion percentage
    const totalQuestions = QUESTIONS.length;
    const answeredQuestions =
      (seeCategory?.questionIds.length || 0) +
      (changeCategory?.questionIds.length || 0) +
      (useCategory?.questionIds.length || 0);
    const expectedPercentage = Math.round((answeredQuestions / totalQuestions) * 100);

    expect(result.current.evaluation.completionPercentage).toBe(expectedPercentage);

    // Step 7: Verify overall grade is calculated
    expect(result.current.evaluation.evaluation?.overallGrade).not.toBe(null);

    // Step 8: Save and reload evaluation
    const evaluationId = result.current.evaluation.evaluation!.id;

    act(() => {
      result.current.evaluation.clearEvaluation();
    });

    expect(result.current.evaluation.evaluation).toBe(null);

    act(() => {
      result.current.evaluation.loadEvaluation(evaluationId);
    });

    expect(result.current.evaluation.evaluation).not.toBe(null);
    expect(result.current.evaluation.evaluation?.vendorName).toBe('TestVendor AI');
    expect(result.current.evaluation.evaluation?.categoryGrades.see).toBe('green');
    expect(result.current.evaluation.evaluation?.categoryGrades.change).toBe('yellow');
  });

  it('handles multiple evaluations', () => {
    const { result } = renderHook(() => useEvaluation(), { wrapper });

    // Create first evaluation
    act(() => {
      result.current.startNewEvaluation('Vendor A');
    });

    const vendor1Id = result.current.evaluation!.id;

    act(() => {
      result.current.updateAnswer('see-1', 'yes');
    });

    // Create second evaluation
    act(() => {
      result.current.startNewEvaluation('Vendor B');
    });

    const vendor2Id = result.current.evaluation!.id;

    act(() => {
      result.current.updateAnswer('see-1', 'no');
    });

    // Load first evaluation
    act(() => {
      result.current.loadEvaluation(vendor1Id);
    });

    const answer1 = result.current.evaluation?.answers.find((a) => a.questionId === 'see-1');
    expect(answer1?.value).toBe('yes');

    // Load second evaluation
    act(() => {
      result.current.loadEvaluation(vendor2Id);
    });

    const answer2 = result.current.evaluation?.answers.find((a) => a.questionId === 'see-1');
    expect(answer2?.value).toBe('no');
  });

  it('calculates red grade when critical question is answered no', () => {
    const { result } = renderHook(() => useEvaluation(), { wrapper });

    act(() => {
      result.current.startNewEvaluation('Test Vendor');
    });

    // Find a critical question
    const criticalQuestion = QUESTIONS.find((q) => q.isCritical);
    expect(criticalQuestion).toBeDefined();

    // Answer critical question as "no"
    act(() => {
      result.current.updateAnswer(criticalQuestion!.id, 'no');
    });

    // The category should be red
    const categoryGrade =
      result.current.evaluation?.categoryGrades[criticalQuestion!.categoryKey];
    expect(categoryGrade).toBe('red');
  });

  it('persists voice mode across page reloads', () => {
    const { result: result1 } = renderHook(() => useVoiceMode(), { wrapper });

    act(() => {
      result1.current.setVoiceMode('direct');
    });

    expect(result1.current.voiceMode).toBe('direct');

    // Simulate page reload by creating new hook instance
    const { result: result2 } = renderHook(() => useVoiceMode(), { wrapper });

    expect(result2.current.voiceMode).toBe('direct');
  });

  it('deletes evaluation permanently', () => {
    const { result } = renderHook(() => useEvaluation(), { wrapper });

    act(() => {
      result.current.startNewEvaluation('To Delete');
    });

    const evaluationId = result.current.evaluation!.id;

    act(() => {
      result.current.deleteEvaluation(evaluationId);
    });

    expect(result.current.evaluation).toBe(null);

    // Try to load deleted evaluation
    act(() => {
      result.current.loadEvaluation(evaluationId);
    });

    // Should still be null (not found)
    expect(result.current.evaluation).toBe(null);
  });

  it('maintains answer timestamps chronologically', () => {
    const { result } = renderHook(() => useEvaluation(), { wrapper });

    act(() => {
      result.current.startNewEvaluation('Test Vendor');
    });

    let timestamp1: string;
    let timestamp2: string;

    act(() => {
      result.current.updateAnswer('see-1', 'yes');
      timestamp1 =
        result.current.evaluation?.answers.find((a) => a.questionId === 'see-1')?.timestamp || '';
    });

    // Wait a tiny bit to ensure different timestamp
    setTimeout(() => {}, 10);

    act(() => {
      result.current.updateAnswer('see-2', 'yes');
      timestamp2 =
        result.current.evaluation?.answers.find((a) => a.questionId === 'see-2')?.timestamp || '';
    });

    expect(new Date(timestamp2!).getTime()).toBeGreaterThanOrEqual(
      new Date(timestamp1!).getTime()
    );
  });

  it('calculates completion percentage correctly for all 20 questions', () => {
    const { result } = renderHook(() => useEvaluation(), { wrapper });

    act(() => {
      result.current.startNewEvaluation('Test Vendor');
    });

    expect(result.current.completionPercentage).toBe(0);

    // Answer 10 questions
    act(() => {
      QUESTIONS.slice(0, 10).forEach((q) => {
        result.current.updateAnswer(q.id, 'yes');
      });
    });

    expect(result.current.completionPercentage).toBe(50);

    // Answer all 20 questions
    act(() => {
      QUESTIONS.forEach((q) => {
        result.current.updateAnswer(q.id, 'yes');
      });
    });

    expect(result.current.completionPercentage).toBe(100);
  });
});

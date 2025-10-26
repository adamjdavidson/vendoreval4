/**
 * Progress Calculation Utility
 * Feature: 004-analytical-report-format
 *
 * Calculates progress and time estimates for Extended Report generation:
 * - Research phase: 0-60% (6 categories × 2 APIs = 12 steps, ~5-10s each)
 * - Synthesis phase: 60-100% (Claude API call ~30-60s)
 * - Total: 90-180 seconds (~2-3 minutes)
 */

export interface ProgressEstimate {
  progress: number; // 0-100
  estimatedTimeRemaining: number; // Seconds
}

/**
 * Calculate progress during research phase
 *
 * Research phase covers 0-60% of overall progress
 * 6 categories × 2 APIs = 12 research steps
 * Each step contributes 5% progress
 *
 * @param completedCategories - Number of categories fully researched (both Brave + Exa)
 * @param currentCategoryProgress - Progress within current category (0-1 for partial API completion)
 */
export function calculateResearchProgress(
  completedCategories: number,
  currentCategoryProgress: number = 0
): ProgressEstimate {
  const TOTAL_CATEGORIES = 6;
  const RESEARCH_PROGRESS_RANGE = 60; // 0-60%

  // Each category = 10% progress (5% per API)
  const progressPerCategory = RESEARCH_PROGRESS_RANGE / TOTAL_CATEGORIES;

  const progress = Math.min(
    60,
    completedCategories * progressPerCategory +
      currentCategoryProgress * progressPerCategory
  );

  // Time estimation: assume 10s per API call (conservative)
  const remainingCategories = TOTAL_CATEGORIES - completedCategories;
  const remainingAPIsInCurrentCategory = currentCategoryProgress < 1 ? (1 - currentCategoryProgress) * 2 : 0;
  const remainingAPIs = remainingCategories * 2 + remainingAPIsInCurrentCategory;
  const researchTime = remainingAPIs * 10; // 10s per API

  // Add synthesis time (will happen after research)
  const synthesisTime = 45; // Conservative estimate

  const estimatedTimeRemaining = researchTime + synthesisTime;

  return {
    progress: Math.round(progress),
    estimatedTimeRemaining: Math.round(estimatedTimeRemaining),
  };
}

/**
 * Calculate progress during synthesis phase
 *
 * Synthesis phase covers 60-100% of overall progress
 * Typically takes 30-60 seconds for Claude API call
 *
 * @param synthesisStarted - Whether synthesis has started (true) or not (false)
 * @param synthesisProgress - Progress within synthesis (0-1), estimated based on time elapsed
 */
export function calculateSynthesisProgress(
  synthesisStarted: boolean,
  synthesisProgress: number = 0
): ProgressEstimate {
  if (!synthesisStarted) {
    return {
      progress: 60,
      estimatedTimeRemaining: 45,
    };
  }

  const SYNTHESIS_PROGRESS_RANGE = 40; // 60-100%

  const progress = Math.min(
    100,
    60 + synthesisProgress * SYNTHESIS_PROGRESS_RANGE
  );

  // Estimate remaining time (conservative)
  const estimatedSynthesisTime = 45; // seconds
  const estimatedTimeRemaining = Math.round(
    (1 - synthesisProgress) * estimatedSynthesisTime
  );

  return {
    progress: Math.round(progress),
    estimatedTimeRemaining: Math.max(0, estimatedTimeRemaining),
  };
}

/**
 * Format time remaining as human-readable string
 */
export function formatTimeRemaining(seconds: number): string {
  if (seconds < 0) return 'Complete';
  if (seconds === 0) return 'Finishing...';
  if (seconds < 60) return `${seconds} second${seconds !== 1 ? 's' : ''}`;

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (remainingSeconds === 0) {
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  }

  return `${minutes}m ${remainingSeconds}s`;
}

/**
 * Generate progress message based on phase and category
 */
export function generateProgressMessage(
  phase: 'research' | 'synthesis' | 'complete',
  currentCategory?: string,
  currentAPI?: 'brave' | 'exa'
): string {
  if (phase === 'complete') {
    return 'Report generation complete!';
  }

  if (phase === 'synthesis') {
    return 'Synthesizing findings into Cons/Pros/Extended sections...';
  }

  // Research phase
  if (currentCategory && currentAPI) {
    const apiName = currentAPI === 'brave' ? 'Brave Search' : 'Exa';
    return `Researching ${currentCategory} category via ${apiName}...`;
  }

  return 'Gathering external research...';
}

/**
 * Calculate overall progress estimate
 *
 * Convenience function that determines phase and calculates progress
 */
export function calculateOverallProgress(
  completedCategories: number,
  currentCategoryProgress: number,
  isSynthesizing: boolean,
  synthesisProgress: number
): ProgressEstimate {
  if (isSynthesizing) {
    return calculateSynthesisProgress(true, synthesisProgress);
  }

  return calculateResearchProgress(completedCategories, currentCategoryProgress);
}

/**
 * TypeScript Type Definitions for VendorEval3
 *
 * This file contains all shared types and interfaces used across the
 * AI Vendor Evaluation Framework application.
 *
 * @version 1.0.0
 * @date 2025-10-19
 */

// ============================================================================
// Enums and Literal Types
// ============================================================================

/**
 * Answer values for evaluation questions
 * - yes: Full capability available
 * - limited: Partial/restricted capability
 * - no: Not available
 * - not-enough-info: Insufficient information to determine
 */
export type AnswerValue = 'yes' | 'limited' | 'no' | 'not-enough-info' | null;

/**
 * Voice mode for content presentation
 * - direct: Candid, cuts through BS, names what vendors hide
 * - suitable-for-work: Professional, politically safe, formal tone
 */
export type VoiceMode = 'direct' | 'suitable-for-work';

/**
 * Category keys matching the 6-dimension evaluation framework
 */
export type CategoryKey = 'see' | 'change' | 'use' | 'adapt' | 'leave' | 'learn';

/**
 * Color-coded assessment grades
 * - green: Strong performance, no concerns
 * - yellow: Acceptable with caveats
 * - red: Critical issues found
 * - grey: Insufficient information
 * - null: No answers yet
 */
export type CategoryGrade = 'green' | 'yellow' | 'red' | 'grey' | null;

// ============================================================================
// Question & Explanation Types
// ============================================================================

/**
 * Explanation content for a single question in a specific voice mode
 */
export interface QuestionExplanation {
  /** Why this question is important for vendor evaluation */
  whyMatters: string;

  /** Example of positive vendor behavior */
  goodLooksLike: string;

  /** Red flags or concerning vendor responses */
  badLooksLike: string;

  /** Specific questions to ask the vendor */
  whatToAsk: string;
}

/**
 * A framework question used to evaluate vendors
 * Matches database schema from questions table
 */
export interface Question {
  /** Unique identifier (UUID) */
  id: string;

  /** Unique key (format: {category_key}-{number}) */
  key: string;

  /** Foreign key to categories table */
  category_id: string;

  /** Display order within category */
  order_index: number;

  /** Question text (direct/no-bs version) */
  text_no_bs: string;

  /** Question text (corporate/professional version) */
  text_corporate: string;

  /** Help text explaining why this matters (direct version) */
  help_text_no_bs: string | null;

  /** Help text explaining why this matters (corporate version) */
  help_text_corporate: string | null;

  /** If true, answering "no" triggers red flag for category */
  is_critical: boolean;

  /** Creation timestamp */
  created_at: string;

  /** Last update timestamp */
  updated_at: string;
}

// ============================================================================
// Answer & Evaluation Types
// ============================================================================

/**
 * User's response to a single evaluation question
 * Matches the JSONB structure stored in evaluations.answers
 */
export interface Answer {
  /** ID of the question being answered */
  question_id: string;

  /** User's answer */
  answer: AnswerValue;

  /** Optional context or evidence */
  notes?: string;

  /** When this answer was last updated (ISO 8601) */
  timestamp: string;
}

/**
 * Complete or in-progress vendor assessment
 * Matches database schema from evaluations table
 */
export interface Evaluation {
  /** Unique evaluation identifier (UUID) */
  id: string;

  /** Foreign key to users table (nullable for anonymous evaluations) */
  user_id: string | null;

  /** Name of vendor being evaluated */
  vendor_name: string;

  /** Answers JSONB array */
  answers: Answer[];

  /** When evaluation was created (ISO 8601) */
  created_at: string;

  /** Last modification time (ISO 8601) */
  updated_at: string;
}

// ============================================================================
// Category Types
// ============================================================================

/**
 * One of 6 evaluation dimensions used to group questions
 * Matches database schema from categories table
 */
export interface Category {
  /** Unique identifier (UUID) */
  id: string;

  /** Unique key (e.g., "see", "change") */
  key: string;

  /** Display order (1-6) */
  order_index: number;

  /** Display name - direct version (e.g., "SEE: What you're actually buying") */
  title_no_bs: string;

  /** Display name - corporate version (e.g., "SEE: Product Transparency") */
  title_corporate: string;

  /** One-sentence description - direct version */
  subtitle_no_bs: string;

  /** One-sentence description - corporate version */
  subtitle_corporate: string;

  /** Background color for category box (hex code) */
  color: string;

  /** Creation timestamp */
  created_at: string;

  /** Last update timestamp */
  updated_at: string;
}

// ============================================================================
// Pre-Analyzed Vendor Types
// ============================================================================

/**
 * Complete vendor evaluation created by framework authors
 * Used as reference example for users
 */
export interface PreAnalyzedVendor {
  /** Vendor name */
  vendorName: string;

  /** URL or path to vendor logo image */
  logoUrl?: string;

  /** When this analysis was completed (ISO 8601) */
  completedAt: string;

  /** Complete evaluation with all 20 questions answered */
  evaluation: Evaluation;

  /** Executive summary (3-5 sentences) */
  summary: string;

  /** Critical concerns found (empty array if none) */
  redFlags: string[];
}

// ============================================================================
// Storage Types
// ============================================================================

/**
 * LocalStorage schema for storing evaluations
 * Key: 'ai-vendor-evaluations'
 */
export interface StorageSchema {
  /** Schema version for future migrations */
  version: '1.0.0';

  /** ID of evaluation user is actively working on (null if none) */
  currentEvaluationId: string | null;

  /** Array of all saved evaluations */
  evaluations: Evaluation[];
}

/**
 * Voice mode storage
 * Key: 'ai-vendor-voice-mode'
 * Value: VoiceMode (stored as plain string)
 */
export type VoiceModeStorage = VoiceMode;

// ============================================================================
// Export & Report Types
// ============================================================================

/**
 * Options for exporting evaluation reports
 */
export interface ExportOptions {
  /** Export format */
  format: 'pdf' | 'markdown' | 'json';

  /** Which voice mode to use for report content */
  voiceMode: VoiceMode;

  /** Whether to include user notes in export */
  includeNotes: boolean;
}

/**
 * Report generation result
 */
export interface ReportResult {
  /** Report filename */
  filename: string;

  /** Report content (Blob for PDF, string for Markdown/JSON) */
  content: Blob | string;

  /** MIME type */
  mimeType: string;

  /** File size in bytes */
  size: number;
}

// ============================================================================
// UI State Types
// ============================================================================

/**
 * UI state for evaluation tool
 */
export interface EvaluationUIState {
  /** Currently active category (for filtering/navigation) */
  activeCategory: CategoryKey | null;

  /** Currently expanded question (for help modal) */
  expandedQuestionId: string | null;

  /** Whether report generation modal is open */
  showReportModal: boolean;

  /** Loading states */
  isLoading: boolean;
  isSaving: boolean;
  isGeneratingReport: boolean;

  /** Error message (null if no error) */
  error: string | null;
}

/**
 * Props for category box component
 */
export interface CategoryBoxProps {
  category: Category;
  grade: CategoryGrade;
  answeredCount: number;
  totalCount: number;
  onClick: () => void;
}

/**
 * Props for question component
 */
export interface QuestionProps {
  question: Question;
  answer: Answer | null;
  voiceMode: VoiceMode;
  onAnswer: (questionId: string, value: AnswerValue) => void;
  onNoteChange: (questionId: string, note: string) => void;
  onHelpClick: (questionId: string) => void;
}

// ============================================================================
// Utility Types
// ============================================================================

/**
 * Function to calculate category grade based on answers
 */
export type CalculateGradeFunction = (
  questions: Question[],
  answers: Answer[]
) => CategoryGrade;

/**
 * Function to save evaluation to LocalStorage
 */
export type SaveEvaluationFunction = (evaluation: Evaluation) => Promise<void>;

/**
 * Function to load evaluation from LocalStorage
 */
export type LoadEvaluationFunction = (id: string) => Promise<Evaluation | null>;

/**
 * Function to generate PDF report
 */
export type GeneratePDFFunction = (
  evaluation: Evaluation,
  voiceMode: VoiceMode
) => Promise<Blob>;

/**
 * Function to generate Markdown report
 */
export type GenerateMarkdownFunction = (
  evaluation: Evaluation,
  voiceMode: VoiceMode
) => string;

// ============================================================================
// Type Guards
// ============================================================================

/**
 * Type guard to check if value is a valid AnswerValue
 */
export function isAnswerValue(value: unknown): value is AnswerValue {
  return (
    value === 'yes' ||
    value === 'limited' ||
    value === 'no' ||
    value === 'not-enough-info' ||
    value === null
  );
}

/**
 * Type guard to check if value is a valid VoiceMode
 */
export function isVoiceMode(value: unknown): value is VoiceMode {
  return value === 'direct' || value === 'suitable-for-work';
}

/**
 * Type guard to check if value is a valid CategoryKey
 */
export function isCategoryKey(value: unknown): value is CategoryKey {
  return (
    value === 'see' ||
    value === 'change' ||
    value === 'use' ||
    value === 'adapt' ||
    value === 'leave' ||
    value === 'learn'
  );
}

/**
 * Type guard to check if value is a valid CategoryGrade
 */
export function isCategoryGrade(value: unknown): value is CategoryGrade {
  return (
    value === 'green' ||
    value === 'yellow' ||
    value === 'red' ||
    value === 'grey' ||
    value === null
  );
}

// ============================================================================
// Constants
// ============================================================================

/**
 * Storage keys used in LocalStorage
 */
export const STORAGE_KEYS = {
  EVALUATIONS: 'ai-vendor-evaluations',
  VOICE_MODE: 'ai-vendor-voice-mode',
  SETTINGS: 'ai-vendor-settings', // Reserved for future use
} as const;

/**
 * Maximum note length (characters)
 */
export const MAX_NOTE_LENGTH = 5000;

/**
 * Total number of evaluation questions
 */
export const TOTAL_QUESTIONS = 20;

/**
 * Category colors (hex codes)
 */
export const CATEGORY_COLORS: Record<CategoryKey, string> = {
  see: '#DFF7FF',
  change: '#DFFEF1',
  use: '#FFF4E0',
  adapt: '#FFEAEA',
  leave: '#F5F5F5',
  learn: '#E8E8FF',
};

/**
 * Grade colors for UI display
 */
export const GRADE_COLORS: Record<NonNullable<CategoryGrade>, string> = {
  green: '#DFFEF1',
  yellow: '#FFF4E0',
  red: '#FFEAEA',
  grey: '#F5F5F5',
};

// ============================================================================
// Re-exports for Convenience
// ============================================================================

export type {
  Question as QuestionType,
  Answer as AnswerType,
  Evaluation as EvaluationType,
  Category as CategoryType,
};

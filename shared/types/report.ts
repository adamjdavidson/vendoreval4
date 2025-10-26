// Type definitions for AI-Powered Vendor Evaluation Report
// Feature: 003-ai-report-generation
// See: specs/003-ai-report-generation/data-model.md

export type CategoryKey = 'see' | 'change' | 'use' | 'adapt' | 'leave' | 'learn';
export type Grade = 'A' | 'B' | 'C' | 'D' | 'F';
export type VoiceMode = 'no-bs' | 'corporate';
export type Confidence = 'high' | 'medium' | 'low';

export interface GeneratedReport {
  id: string;
  evaluationId: string;
  vendorName: string;
  generatedAt: number;
  voiceMode: VoiceMode;
  isPartial: boolean;
  completedCategories: CategoryKey[];
  headline: string;
  categoryAnalyses: CategoryAnalysis[];
  researchFindings: ResearchFinding[];
  metadata: ReportMetadata;
}

export interface CategoryAnalysis {
  categoryKey: CategoryKey;
  categoryName: string;
  grade: Grade;
  yesCount: number;
  limitedCount: number;
  noCount: number;
  unknownCount: number;
  totalQuestions: number;
  userAnswerSummary: string;
  analysisText: string;
  keyInsights: string[];
}

export interface ResearchFinding {
  categoryKey: CategoryKey;
  topic: string;
  finding: string;
  sources: Source[];
  confidence: Confidence;
  researchedAt: number;
  cacheExpiresAt: number;
}

export interface Source {
  url: string;
  title: string;
  snippet: string;
  publishedDate?: string;
}

export interface ReportMetadata {
  generationDurationMs: number;
  claudeTokensUsed: number;
  researchQueriesPerformed: number;
  researchCacheHits: number;
  errors: string[];
  warnings: string[];
}

export interface ReportGenerationRequest {
  evaluationId: string;
  vendorName: string;
  answers: Record<string, 'yes' | 'limited' | 'no' | 'not-enough-info'>;
  questions: Question[];
  categories: Category[];
  voiceMode: VoiceMode;
  includeResearch: boolean;
}

export interface Question {
  key: string;
  categoryKey: CategoryKey;
  text: string;
  isCritical: boolean;
}

export interface Category {
  key: CategoryKey;
  name: string;
  description: string;
}

export interface StorageStats {
  totalReports: number;
  totalSizeBytes: number;
  oldestReportAge: number;
  averageReportSize: number;
}

export interface CacheStats {
  totalEntries: number;
  totalSizeBytes: number;
  oldestEntryAge: number;
  hitRate: number;
}

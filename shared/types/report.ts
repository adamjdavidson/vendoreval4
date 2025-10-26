// Type definitions for AI-Powered Vendor Evaluation Report
// Feature: 003-ai-report-generation
// See: specs/003-ai-report-generation/data-model.md

export type CategoryKey = 'see' | 'change' | 'use' | 'adapt' | 'leave' | 'learn';
export type Grade = 'A' | 'B' | 'C' | 'D' | 'F';
export type VoiceMode = 'no-bs' | 'corporate';
export type Confidence = 'high' | 'medium' | 'low';

export type ReportMode = 'quick' | 'extended';

export interface GeneratedReport {
  id: string;
  evaluationId: string;
  vendorName: string;
  evaluationDate: string; // ISO date string
  generatedAt: number;
  voiceMode: VoiceMode;
  isPartial: boolean;
  reportMode: ReportMode; // Quick=no research, Extended=with research
  completionStatus: string; // e.g., "20/20 questions answered (100%)"
  headline: string;
  cons: string; // Summary of negatives and why they're concerning
  pros: string; // Summary of positives and why they matter
  extended: string; // How to think about the mix without firm recommendation
  categoryAnalyses: CategoryAnalysis[]; // Detailed breakdown for reference
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

export type SourceType = 'brave' | 'exa';
export type DomainAuthority = 'official' | 'tech-news' | 'community' | 'github' | 'general';

export interface ResearchFinding {
  categoryKey: CategoryKey;
  topic: string;
  finding: string;
  sources: Source[];
  confidence: Confidence;
  researchedAt: number;
  cacheExpiresAt: number;
  // New fields for analytical format
  sourceType: SourceType; // Which API provided this
  sourceAge: string; // Human-readable: "2 months ago"
  ageMonths: number; // Numeric age for filtering
  isFoundational: boolean; // True if >12 months but foundational
  domainAuthority: DomainAuthority;
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
  evaluationDate?: string; // ISO date string (YYYY-MM-DD)
  answers: Record<string, 'yes' | 'limited' | 'no' | 'not-enough-info'>;
  notes: Record<string, string>; // User notes by question key
  questions: Question[];
  categories: Category[];
  voiceMode: VoiceMode;
  reportMode: ReportMode; // Quick vs Extended
  includeResearch: boolean; // Derived: reportMode === 'extended'
}

export interface ReportProgressUpdate {
  phase: 'research' | 'synthesis' | 'complete';
  currentCategory?: CategoryKey;
  currentAPI?: SourceType;
  progress: number; // 0-100
  estimatedTimeRemaining: number; // Seconds
  canCancel: boolean;
  message: string; // e.g., "Researching See category via Brave..."
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

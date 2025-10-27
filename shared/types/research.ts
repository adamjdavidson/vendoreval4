/**
 * Research Pipeline Type Definitions
 * Feature: 005-ai-research-pipeline
 *
 * This file defines TypeScript interfaces for the 5-stage AI research pipeline.
 * Each interface represents data at a specific stage boundary.
 */

// ============================================================================
// Stage 1: Search Results (Raw API Output)
// ============================================================================

export interface SearchResult {
  title: string;                    // Article/page title
  url: string;                      // Full URL
  snippet: string;                  // Search result snippet/description
  publishedDate?: string;           // ISO 8601 date string
  sourceType: 'brave' | 'exa';      // Which API returned this
  score?: number;                   // Relevance score from search API (0-1)
}

// ============================================================================
// Stage 2: Filtered Results (AI-Verified Relevance)
// ============================================================================

export interface FilteredResult extends SearchResult {
  relevanceScore: number;           // 0-1, Gemini's confidence this is about target vendor
  relevanceReasoning: string;       // Why Gemini considers this relevant
  isAboutTargetVendor: boolean;     // True = about specific vendor, False = unrelated project
  geminiFilteredAt: number;         // Unix timestamp when filtered
}

// ============================================================================
// Stage 3: Article Content (Full Text Extraction)
// ============================================================================

export interface ArticleContent {
  url: string;                      // Original URL (matches FilteredResult.url)
  title: string;                    // Extracted article title
  author?: string;                  // Article author if available
  publishedDate?: string;           // ISO 8601 date if available
  textContent: string;              // Full extracted text content
  excerpt?: string;                 // Article summary/excerpt
  wordCount: number;                // Total words in textContent
  fetchStatus: 'success' | 'failed' | 'skipped';
  fetchError?: string;              // Error message if fetchStatus != 'success'
  fetchedAt: number;                // Unix timestamp when fetched
  extractionMethod: 'readability' | 'cheerio' | 'fallback';
}

// ============================================================================
// Stage 4: Category Insights (AI-Analyzed Findings)
// ============================================================================

export interface CategoryInsight {
  categoryKey: 'see' | 'change' | 'use' | 'adapt' | 'leave' | 'learn';
  categoryName: string;             // Human-readable: "Transparency & Observability"
  findings: string;                 // Multi-paragraph synthesis of research
  keyPoints: string[];              // 3-5 bullet points summarizing findings
  sources: CategorySource[];        // Citations with context
  confidence: 'high' | 'medium' | 'low';
  contradictions?: string[];        // If user answers conflict with research
  additionalConsiderations?: string[]; // New info not covered in questions
  analyzedAt: number;               // Unix timestamp
  articlesAnalyzed: number;         // Count of articles used in analysis
}

export interface CategorySource {
  url: string;                      // Link to original article
  title: string;                    // Article title
  relevantQuote?: string;           // Specific quote supporting finding
  context: string;                  // How this source relates to category
}

// ============================================================================
// Stage 5: Research Report (Final Output)
// ============================================================================

export interface ResearchReport {
  vendorName: string;
  evaluationId: string;             // Links to user's evaluation
  generatedAt: number;              // Unix timestamp
  voiceMode: 'no-bs' | 'corporate';

  // Metadata
  metadata: ResearchMetadata;

  // Report sections
  headline: string;                 // Executive summary
  consAnalysis: string;             // Negative findings synthesis
  prosAnalysis: string;             // Positive findings synthesis
  extendedAnalysis: string;         // Balanced synthesis with user notes
  categoryAnalyses: CategoryInsight[]; // All 6 category insights
  researchFindings: string;         // External research with sources
}

export interface ResearchMetadata {
  totalSearchResults: number;       // Stage 1 output count
  filteredResults: number;          // Stage 2 output count
  articlesAnalyzed: number;         // Stage 3 success count
  articlesFailed: number;           // Stage 3 failed count
  generationTimeSeconds: number;    // Total pipeline duration
  cacheHit: boolean;                // Whether results came from cache
  stages: {
    search: StageMetadata;
    filter: StageMetadata;
    fetch: StageMetadata;
    analyze: StageMetadata;
    synthesize: StageMetadata;
  };
}

export interface StageMetadata {
  startTime: number;                // Unix timestamp
  endTime: number;                  // Unix timestamp
  durationMs: number;               // Milliseconds elapsed
  status: 'success' | 'partial' | 'failed';
  errorMessage?: string;            // If status != 'success'
}

// ============================================================================
// Supporting Types
// ============================================================================

export type CategoryKey = 'see' | 'change' | 'use' | 'adapt' | 'leave' | 'learn';

export type ConfidenceLevel = 'high' | 'medium' | 'low';

export type FetchStatus = 'success' | 'failed' | 'skipped';

export type ExtractionMethod = 'readability' | 'cheerio' | 'fallback';

export type SourceType = 'brave' | 'exa';

export type VoiceMode = 'no-bs' | 'corporate';

// ============================================================================
// Cache Types
// ============================================================================

export interface CachedResearchFinding {
  vendorName: string;
  categoryKey: CategoryKey;
  searchResults: SearchResult[];
  filteredResults: FilteredResult[];
  articles: ArticleContent[];
  insight: CategoryInsight;
  cachedAt: number;
  expiresAt: number;
  cacheVersion: string;             // 'v5'
}

export interface CacheMetadata {
  key: string;
  hits: number;
  lastAccessed: number;
  cacheVersion: string;
}

// ============================================================================
// Request/Response Types for Edge Functions
// ============================================================================

// Stage 2: Filter Research Results
export interface FilterResearchRequest {
  vendorName: string;
  searchResults: SearchResult[];
  userAnswers: Record<string, unknown>; // User's evaluation answers for context
}

export interface FilterResearchResponse {
  filteredResults: FilteredResult[];
  metadata: {
    totalInput: number;
    totalOutput: number;
    filterRate: number;              // Percentage kept
    processingTimeMs: number;
  };
}

// Stage 3: Fetch Article Content
export interface FetchArticleRequest {
  urls: string[];
  batchSize?: number;                // Default 10
  timeout?: number;                  // Default 30000ms
}

export interface FetchArticleResponse {
  articles: ArticleContent[];
  metadata: {
    successCount: number;
    failedCount: number;
    skippedCount: number;
    processingTimeMs: number;
  };
}

// Stage 4: Analyze Category Content
export interface AnalyzeCategoryRequest {
  vendorName: string;
  categoryKey: CategoryKey;
  articles: ArticleContent[];
  userAnswers: Record<string, unknown>;
  categoryQuestions: string[];
}

export interface AnalyzeCategoryResponse {
  categoryInsight: CategoryInsight;
  metadata: {
    articlesAnalyzed: number;
    processingTimeMs: number;
    tokensUsed: number;
  };
}

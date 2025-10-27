/**
 * Research Pipeline Types for Frontend
 * Feature: 005-ai-research-pipeline
 *
 * Re-exports types from shared/types/research.ts for frontend use.
 * This provides a stable import path for frontend code.
 */

export type {
  // Stage outputs
  SearchResult,
  FilteredResult,
  ArticleContent,
  CategoryInsight,
  CategorySource,
  ResearchReport,
  ResearchMetadata,
  StageMetadata,

  // Supporting types
  CategoryKey,
  ConfidenceLevel,
  FetchStatus,
  ExtractionMethod,
  SourceType,
  VoiceMode,

  // Cache types
  CachedResearchFinding,
  CacheMetadata,

  // Request/Response types
  FilterResearchRequest,
  FilterResearchResponse,
  FetchArticleRequest,
  FetchArticleResponse,
  AnalyzeCategoryRequest,
  AnalyzeCategoryResponse,
} from '@shared/types/research';

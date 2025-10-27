# Data Model: Multi-Stage AI Research Pipeline

**Feature**: 005-ai-research-pipeline
**Date**: 2025-10-26

## Overview

This document defines the data structures that flow through the five-stage research pipeline. Each entity represents data at a specific stage boundary, with strict TypeScript interfaces ensuring type safety throughout the pipeline.

---

## Entity Relationship Diagram

```
SearchResult (Stage 1 output)
   ↓ (filtered by Gemini)
FilteredResult (Stage 2 output)
   ↓ (content fetched)
ArticleContent (Stage 3 output)
   ↓ (analyzed by Gemini)
CategoryInsight (Stage 4 output)
   ↓ (synthesized by Claude)
ResearchReport (Stage 5 output)
```

---

## Core Entities

### SearchResult

**Purpose**: Raw search result from Brave or Exa API (Stage 1 output)

**TypeScript Interface**:
```typescript
interface SearchResult {
  title: string;                    // Article/page title
  url: string;                      // Full URL
  snippet: string;                  // Search result snippet/description
  publishedDate?: string;           // ISO 8601 date string
  sourceType: 'brave' | 'exa';      // Which API returned this
  score?: number;                   // Relevance score from search API
}
```

**Validation Rules**:
- `title`: Non-empty string, max 500 chars
- `url`: Valid HTTP/HTTPS URL
- `snippet`: Non-empty string, max 1000 chars
- `publishedDate`: ISO 8601 format if provided
- `sourceType`: Must be 'brave' or 'exa'
- `score`: 0-1 range if provided

**Example**:
```json
{
  "title": "Jasper AI Review: Transparency and Lock-in Concerns",
  "url": "https://example.com/jasper-review",
  "snippet": "An analysis of Jasper AI's pricing model reveals...",
  "publishedDate": "2025-08-15T00:00:00Z",
  "sourceType": "brave",
  "score": 0.92
}
```

**Cardinality**: 240-300 per research operation (12 searches × 20-25 results each)

---

### FilteredResult

**Purpose**: Search result confirmed relevant by AI (Stage 2 output)

**TypeScript Interface**:
```typescript
interface FilteredResult extends SearchResult {
  relevanceScore: number;           // 0-1, Gemini's confidence this is about target vendor
  relevanceReasoning: string;       // Why Gemini considers this relevant
  isAboutTargetVendor: boolean;     // True = about specific vendor, False = unrelated project
  geminiFilteredAt: number;         // Unix timestamp when filtered
}
```

**Additional Validation Rules**:
- `relevanceScore`: 0-1 range, higher = more relevant
- `relevanceReasoning`: Non-empty string explaining relevance
- `isAboutTargetVendor`: Boolean flag for binary decision
- Inherits all `SearchResult` validation rules

**Example**:
```json
{
  "title": "Jasper AI Review: Transparency and Lock-in Concerns",
  "url": "https://example.com/jasper-review",
  "snippet": "An analysis of Jasper AI's pricing model reveals...",
  "publishedDate": "2025-08-15T00:00:00Z",
  "sourceType": "brave",
  "score": 0.92,
  "relevanceScore": 0.95,
  "relevanceReasoning": "Article specifically discusses Jasper.ai (AI writing tool), mentions pricing, lock-in concerns, and transparency issues relevant to evaluation framework.",
  "isAboutTargetVendor": true,
  "geminiFilteredAt": 1729987200000
}
```

**Cardinality**: 30-50 per research operation (filtered from 240-300 SearchResults)

---

### ArticleContent

**Purpose**: Full text content extracted from web page (Stage 3 output)

**TypeScript Interface**:
```typescript
interface ArticleContent {
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
```

**Validation Rules**:
- `url`: Valid HTTP/HTTPS URL, must match a FilteredResult.url
- `title`: Non-empty string
- `textContent`: Non-empty for success status, min 100 chars
- `wordCount`: Calculated from textContent, min 50 for success
- `fetchStatus`: Must be one of three values
- `fetchError`: Required if fetchStatus != 'success'
- `extractionMethod`: Tracks which parser succeeded

**Example** (Success):
```json
{
  "url": "https://example.com/jasper-review",
  "title": "Jasper AI Review: Transparency and Lock-in Concerns",
  "author": "Jane Smith",
  "publishedDate": "2025-08-15T00:00:00Z",
  "textContent": "Jasper AI has emerged as a leading AI writing assistant... [5000 words]",
  "excerpt": "An in-depth analysis of Jasper AI's business model and technical architecture.",
  "wordCount": 5234,
  "fetchStatus": "success",
  "fetchedAt": 1729987300000,
  "extractionMethod": "readability"
}
```

**Example** (Failed):
```json
{
  "url": "https://paywall-site.com/article",
  "title": "Premium Content",
  "textContent": "",
  "wordCount": 0,
  "fetchStatus": "failed",
  "fetchError": "Paywall detected - requires authentication",
  "fetchedAt": 1729987300000,
  "extractionMethod": "readability"
}
```

**Cardinality**: 30-50 per research operation (one per FilteredResult)

---

### CategoryInsight

**Purpose**: AI-synthesized insights for one evaluation category (Stage 4 output)

**TypeScript Interface**:
```typescript
interface CategoryInsight {
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

interface CategorySource {
  url: string;                      // Link to original article
  title: string;                    // Article title
  relevantQuote?: string;           // Specific quote supporting finding
  context: string;                  // How this source relates to category
}
```

**Validation Rules**:
- `categoryKey`: Must be one of 6 valid categories
- `categoryName`: Non-empty string
- `findings`: Multi-paragraph text, min 200 chars
- `keyPoints`: 3-5 items, each 50-200 chars
- `sources`: 2-10 citations per category
- `confidence`: Based on article quantity and consistency
- `contradictions`: Present only if conflicts detected
- `additionalConsiderations`: Present only if new info discovered

**Example**:
```json
{
  "categoryKey": "see",
  "categoryName": "Transparency & Observability",
  "findings": "Research reveals significant transparency concerns with Jasper AI's system architecture. Multiple sources indicate that users cannot view or modify system prompts, raising questions about output predictability...",
  "keyPoints": [
    "No access to system prompts or model routing logic",
    "Limited observability into content generation process",
    "Users report unexpected output variations without explanation",
    "Documentation lacks technical depth on AI decision-making",
    "No audit logs for tracking AI behavior over time"
  ],
  "sources": [
    {
      "url": "https://example.com/jasper-review",
      "title": "Jasper AI Review: Transparency and Lock-in Concerns",
      "relevantQuote": "Jasper provides no mechanism for users to inspect or modify the underlying prompts that guide content generation.",
      "context": "Confirms lack of system prompt visibility mentioned in user's evaluation"
    },
    {
      "url": "https://forum.example.com/jasper-discussion",
      "title": "Community Discussion: Jasper Output Inconsistency",
      "context": "User reports corroborate unpredictable outputs due to hidden system changes"
    }
  ],
  "confidence": "high",
  "contradictions": [
    "User answered 'partial visibility' for system prompts, but research indicates NO visibility at all"
  ],
  "additionalConsiderations": [
    "Recent users report unexpected pricing changes with limited advance notice",
    "API rate limits not clearly documented, affecting enterprise integrations"
  ],
  "analyzedAt": 1729987400000,
  "articlesAnalyzed": 8
}
```

**Cardinality**: Exactly 6 per research operation (one per category)

---

### ResearchReport

**Purpose**: Final report structure combining all insights (Stage 5 output)

**TypeScript Interface**:
```typescript
interface ResearchReport {
  vendorName: string;
  evaluationId: string;             // Links to user's evaluation
  generatedAt: number;              // Unix timestamp
  voiceMode: 'no-bs' | 'corporate';

  // Metadata
  metadata: {
    totalSearchResults: number;     // Stage 1 output count
    filteredResults: number;        // Stage 2 output count
    articlesAnalyzed: number;       // Stage 3 success count
    articlesFailed: number;         // Stage 3 failed count
    generationTimeSeconds: number;  // Total pipeline duration
  };

  // Report sections
  headline: string;                 // Executive summary
  consAnalysis: string;             // Negative findings synthesis
  prosAnalysis: string;             // Positive findings synthesis
  extendedAnalysis: string;         // Balanced synthesis with user notes

  categoryInsights: CategoryInsight[]; // All 6 categories

  researchSources: ResearchSource[]; // Deduplicated source list
}

interface ResearchSource {
  url: string;
  title: string;
  publishedDate?: string;
  usedInCategories: string[];       // Which categories cited this
  sourceType: 'brave' | 'exa';
}
```

**Validation Rules**:
- `vendorName`: Must match evaluation vendor name
- `evaluationId`: Valid UUID
- `categoryInsights`: Must have exactly 6 items (all categories)
- `researchSources`: Deduplicated list, no duplicate URLs
- `metadata.filteredResults`: Should be 30-50 for full research
- `metadata.articlesAnalyzed`: Should be close to filteredResults

**Example**:
```json
{
  "vendorName": "Jasper",
  "evaluationId": "550e8400-e29b-41d4-a716-446655440000",
  "generatedAt": 1729987500000,
  "voiceMode": "no-bs",
  "metadata": {
    "totalSearchResults": 287,
    "filteredResults": 45,
    "articlesAnalyzed": 42,
    "articlesFailed": 3,
    "generationTimeSeconds": 68
  },
  "headline": "Jasper AI shows concerning lock-in patterns and limited transparency...",
  "consAnalysis": "Research reveals three critical concerns: ...",
  "prosAnalysis": "On the positive side, Jasper excels in...",
  "extendedAnalysis": "Balancing these findings with your specific use case...",
  "categoryInsights": [ /* 6 CategoryInsight objects */ ],
  "researchSources": [
    {
      "url": "https://example.com/jasper-review",
      "title": "Jasper AI Review: Transparency and Lock-in Concerns",
      "publishedDate": "2025-08-15T00:00:00Z",
      "usedInCategories": ["see", "change", "leave"],
      "sourceType": "brave"
    }
  ]
}
```

**Cardinality**: 1 per Extended Report generation

---

## Supporting Entities

### ResearchRequest

**Purpose**: Input to research pipeline

**TypeScript Interface**:
```typescript
interface ResearchRequest {
  vendorName: string;
  evaluationId: string;
  userAnswers: Record<string, Answer>; // All 20 question answers
  categories: CategoryKey[];        // Usually all 6
  voiceMode: 'no-bs' | 'corporate';
}

interface Answer {
  questionId: string;
  answer: 'yes' | 'no' | 'partial' | 'unknown';
  notes?: string;
}
```

**Validation Rules**:
- `vendorName`: Non-empty string
- `userAnswers`: Must include answers for critical questions
- `categories`: 1-6 valid category keys
- `voiceMode`: Required for report generation

---

### PipelineProgress

**Purpose**: Real-time progress feedback for UI

**TypeScript Interface**:
```typescript
interface PipelineProgress {
  stage: 1 | 2 | 3 | 4 | 5;
  stageName: string;                // "Searching", "Filtering", etc.
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  progress: number;                 // 0-100 percentage
  message: string;                  // User-friendly status message
  estimatedTimeRemaining?: number;  // Seconds
  error?: string;                   // Error message if failed
}
```

**Example**:
```json
{
  "stage": 3,
  "stageName": "Fetching Content",
  "status": "in_progress",
  "progress": 65,
  "message": "Fetching article content... (28 of 43 complete)",
  "estimatedTimeRemaining": 8
}
```

---

## State Transitions

### Successful Flow
```
1. ResearchRequest → SearchResult[] (Stage 1)
2. SearchResult[] → FilteredResult[] (Stage 2)
3. FilteredResult[] → ArticleContent[] (Stage 3)
4. ArticleContent[] → CategoryInsight[] (Stage 4)
5. CategoryInsight[] → ResearchReport (Stage 5)
```

### Error Handling Flow
```
Stage 1 fails → Return error, no fallback
Stage 2 fails → Use all SearchResults (no filtering)
Stage 3 partial → Continue with successful ArticleContent[]
Stage 4 partial → Continue with successful CategoryInsight[]
Stage 5 fails → Return Quick Report (no research)
```

---

## Database Schema

**Note**: Currently using client-side localStorage only. If server-side storage needed in future:

### research_cache Table
```sql
CREATE TABLE research_cache (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vendor_name VARCHAR(255) NOT NULL,
  category_key VARCHAR(20) NOT NULL,
  filtered_results JSONB NOT NULL,        -- FilteredResult[]
  article_contents JSONB,                 -- ArticleContent[] (optional)
  category_insight JSONB,                 -- CategoryInsight (optional)
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP NOT NULL,
  cache_version VARCHAR(10) DEFAULT 'v5',
  UNIQUE(vendor_name, category_key, cache_version)
);

CREATE INDEX idx_research_cache_vendor ON research_cache(vendor_name);
CREATE INDEX idx_research_cache_expires ON research_cache(expires_at);
```

### research_usage Table (Optional - for monitoring)
```sql
CREATE TABLE research_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vendor_name VARCHAR(255) NOT NULL,
  total_results INTEGER,
  filtered_results INTEGER,
  articles_analyzed INTEGER,
  articles_failed INTEGER,
  generation_time_ms INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  api_costs JSONB                        -- Track API usage costs
);
```

---

## Cache Structure (LocalStorage)

### Cache Key Format
```
vendoreval:research:v5:{vendorName}:{categoryKey}
```

### Cached Value Structure
```typescript
interface CachedResearchFinding extends FilteredResult {
  articleContent?: ArticleContent;       // Full content if fetched
  categoryInsight?: CategoryInsight;     // Analysis if completed
  cacheMetadata: {
    hits: number;                        // Cache hit count
    lastAccessed: number;                // Unix timestamp
    cacheVersion: string;                // 'v5'
  };
}
```

### Cache Operations
- **Save**: After Stage 2 (filtered results)
- **Update**: After Stage 3 (add article content)
- **Update**: After Stage 4 (add category insight)
- **Retrieve**: Before Stage 1 (check if cached)
- **Invalidate**: Version bump or 7-day expiration

---

## API Response Formats

### Brave Search API Response (External)
```typescript
interface BraveSearchResponse {
  web: {
    results: Array<{
      title: string;
      url: string;
      description: string;
      age?: string;                      // "2 months ago"
      page_age?: string;                 // "2025-08"
    }>;
  };
  discussions?: {
    results: Array<{
      data: Array<{
        title: string;
        url: string;
        description: string;
      }>;
    }>;
  };
}
```

### Exa API Response (External)
```typescript
interface ExaSearchResponse {
  results: Array<{
    title: string;
    url: string;
    text?: string;                       // Full text if requested
    publishedDate?: string;
    score: number;
  }>;
}
```

### Gemini API Response (Structured Output)
```typescript
// Stage 2: Filter Response
interface GeminiFilterResponse {
  filteredResults: Array<{
    url: string;                         // Matches original SearchResult
    isRelevant: boolean;
    relevanceScore: number;
    reasoning: string;
  }>;
}

// Stage 4: Analysis Response
interface GeminiAnalysisResponse {
  findings: string;
  keyPoints: string[];
  sources: Array<{
    url: string;
    quote?: string;
    context: string;
  }>;
  confidence: 'high' | 'medium' | 'low';
  contradictions?: string[];
  additionalConsiderations?: string[];
}
```

---

## Type Guards & Validation

### Runtime Validation Functions
```typescript
function isValidSearchResult(obj: any): obj is SearchResult {
  return (
    typeof obj.title === 'string' &&
    typeof obj.url === 'string' &&
    typeof obj.snippet === 'string' &&
    ['brave', 'exa'].includes(obj.sourceType)
  );
}

function isValidFilteredResult(obj: any): obj is FilteredResult {
  return (
    isValidSearchResult(obj) &&
    typeof obj.relevanceScore === 'number' &&
    obj.relevanceScore >= 0 &&
    obj.relevanceScore <= 1 &&
    typeof obj.isAboutTargetVendor === 'boolean'
  );
}

function isValidCategoryInsight(obj: any): obj is CategoryInsight {
  const validCategories = ['see', 'change', 'use', 'adapt', 'leave', 'learn'];
  return (
    validCategories.includes(obj.categoryKey) &&
    typeof obj.findings === 'string' &&
    Array.isArray(obj.keyPoints) &&
    obj.keyPoints.length >= 3 &&
    Array.isArray(obj.sources) &&
    ['high', 'medium', 'low'].includes(obj.confidence)
  );
}
```

---

## Migration from Current System

### Current Structure (v4)
```typescript
interface ResearchFinding {  // OLD
  categoryKey: string;
  topic: string;
  finding: string;           // Just concatenated titles
  sources: Source[];
  confidence: string;
  // ... other fields
}
```

### New Structure (v5)
```typescript
interface CategoryInsight {  // NEW
  categoryKey: CategoryKey;
  categoryName: string;
  findings: string;          // Full article analysis
  keyPoints: string[];
  sources: CategorySource[];
  confidence: 'high' | 'medium' | 'low';
  contradictions?: string[];
  additionalConsiderations?: string[];
  // ... more structured data
}
```

### Migration Strategy
1. Bump cache version to v5 (invalidates all v4 cache)
2. Update TypeScript interfaces in shared/types/report.ts
3. Update researchService to return new structure
4. Update ReportPreview component to display new structure
5. Keep backward compatibility for existing reports (read-only)

---

## Performance Considerations

### Memory Usage
- SearchResult[]: ~1KB × 300 = 300KB
- FilteredResult[]: ~2KB × 50 = 100KB
- ArticleContent[]: ~50KB × 50 = 2.5MB (largest - batch processing needed)
- CategoryInsight[]: ~10KB × 6 = 60KB
- Total peak: ~3MB (manageable in browser)

### Storage
- LocalStorage limit: ~5-10MB per domain
- Current usage: Evaluations + old cache
- New usage: Add ~500KB per cached vendor research
- Cleanup strategy: Delete cache older than 7 days automatically

---

## Summary

This data model provides:
- ✅ Type safety throughout the pipeline
- ✅ Clear stage boundaries with validation
- ✅ Extensible structure for future enhancements
- ✅ Efficient caching strategy
- ✅ Comprehensive error tracking
- ✅ Rich metadata for debugging and monitoring

All entities follow TypeScript strict mode and align with constitutional requirements.

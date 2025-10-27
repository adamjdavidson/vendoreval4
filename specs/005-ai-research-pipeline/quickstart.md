# Quickstart: AI Research Pipeline

**Feature**: 005-ai-research-pipeline
**Purpose**: Multi-stage AI-powered research system for vendor evaluation

---

## Prerequisites

- Node.js 18+ (native fetch API)
- Supabase CLI installed (`npm install -g supabase`)
- Access to Supabase project: `leicgzljnodyrdbbcgoq`
- API keys configured in Supabase secrets

---

## Required API Keys

Configure these secrets in Supabase Edge Functions:

```bash
# Set secrets for Edge Functions
supabase secrets set GEMINI_API_KEY=your_gemini_api_key_here
supabase secrets set BRAVE_API_KEY=your_brave_api_key_here  # Already configured
supabase secrets set EXA_API_KEY=your_exa_api_key_here      # Already configured
supabase secrets set ANTHROPIC_API_KEY=your_key_here        # Already configured

# Verify secrets are set
supabase secrets list
```

**Where to get API keys**:
- Gemini API: https://aistudio.google.com/app/apikey (free tier: 60 req/min)
- Brave Search: https://brave.com/search/api/ (free tier: 1 req/sec)
- Exa: https://exa.ai/ (check tier limits)

---

## Install Dependencies

### Frontend (Evaluation Tool)

No new frontend dependencies - all processing happens in Edge Functions.

### Edge Functions

These dependencies will be installed in each Edge Function's `deno.json`:

```json
{
  "imports": {
    "@google/generative-ai": "npm:@google/generative-ai@^0.2.0",
    "@mozilla/readability": "npm:@mozilla/readability@^0.5.0",
    "jsdom": "npm:jsdom@^23.0.0",
    "cheerio": "npm:cheerio@^1.0.0",
    "@supabase/supabase-js": "npm:@supabase/supabase-js@^2.0.0"
  }
}
```

---

## Architecture Overview

### Five-Stage Pipeline

```
┌─────────────────────────────────────────────────────────────┐
│ STAGE 1: Broad Search (Existing Edge Functions)            │
│ - brave-search: 20-50 results × 6 categories               │
│ - exa-search: 20-50 results × 6 categories                 │
│ - Output: 240-300 SearchResults                            │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ STAGE 2: AI Relevance Filtering (NEW)                      │
│ - filter-research-results Edge Function                    │
│ - Gemini Flash analyzes all 240-300 results                │
│ - Output: 30-50 FilteredResults (90% relevance)            │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ STAGE 3: Full Content Fetching (NEW)                       │
│ - fetch-article-content Edge Function                      │
│ - Mozilla Readability extracts clean text                  │
│ - Output: ArticleContent[] with full text                  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ STAGE 4: AI Content Analysis (NEW)                         │
│ - analyze-category-content Edge Function                   │
│ - 6 parallel Gemini calls (one per category)               │
│ - Output: CategoryInsight[] with synthesized findings      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ STAGE 5: Report Synthesis (Existing)                       │
│ - generate-report-content Edge Function                    │
│ - Claude API integrates insights with user answers         │
│ - Output: Final report (no-bs or corporate voice)          │
└─────────────────────────────────────────────────────────────┘
```

---

## New Edge Functions to Create

### 1. filter-research-results

**Purpose**: Use Gemini Flash to filter 240-300 search results down to 30-50 relevant articles about target vendor.

**Location**: `supabase/functions/filter-research-results/index.ts`

**Example Request**:
```typescript
const response = await fetch(
  'https://leicgzljnodyrdbbcgoq.supabase.co/functions/v1/filter-research-results',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      vendorName: 'Jasper',
      searchResults: searchResults,  // 240-300 results from Stage 1
      userAnswers: evaluationAnswers // For context
    })
  }
);

const { filteredResults, metadata } = await response.json();
// filteredResults: FilteredResult[] (30-50 items)
// metadata: { totalInput, totalOutput, filterRate, processingTimeMs }
```

**Gemini Prompt Strategy**:
```
You are analyzing search results for vendor evaluation research.

Vendor: {vendorName}
Context: User is evaluating this vendor using these answers:
{userAnswers}

Task: For each search result, determine if it's about the TARGET VENDOR or an unrelated project.

Example:
- "Jasper AI writing tool" → isAboutTargetVendor: true
- "Jasper Reports (Java library)" → isAboutTargetVendor: false
- "Apache Jasper JSP engine" → isAboutTargetVendor: false

Return relevanceScore (0-1) and brief reasoning for each result.
```

---

### 2. fetch-article-content

**Purpose**: Fetch full HTML and extract clean article text using Mozilla Readability.

**Location**: `supabase/functions/fetch-article-content/index.ts`

**Example Request**:
```typescript
const response = await fetch(
  'https://leicgzljnodyrdbbcgoq.supabase.co/functions/v1/fetch-article-content',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      urls: filteredResults.map(r => r.url),  // 30-50 URLs
      batchSize: 10,  // Process 10 at a time
      timeout: 30000  // 30 second timeout per URL
    })
  }
);

const { articles, metadata } = await response.json();
// articles: ArticleContent[] with full textContent
// metadata: { successCount, failedCount, processingTimeMs }
```

**Implementation Notes**:
- Use `@mozilla/readability` for primary extraction
- Fallback to `cheerio` if Readability fails
- Call `window.close()` after each jsdom parse to free memory
- Use `Promise.allSettled()` to continue on failures
- Skip paywalls and 404s gracefully

---

### 3. analyze-category-content

**Purpose**: Use Gemini Flash to analyze full article content for one evaluation category.

**Location**: `supabase/functions/analyze-category-content/index.ts`

**Example Request**:
```typescript
const response = await fetch(
  'https://leicgzljnodyrdbbcgoq.supabase.co/functions/v1/analyze-category-content',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      vendorName: 'Jasper',
      categoryKey: 'see',  // One of: see, change, use, adapt, leave, learn
      articles: articlesWithFullText,  // ArticleContent[] from Stage 3
      userAnswers: categoryAnswers,    // Answers for this category
      categoryQuestions: categoryQuestions  // Question text for context
    })
  }
);

const { categoryInsight } = await response.json();
// categoryInsight: CategoryInsight with findings, keyPoints, sources
```

**Gemini Prompt Strategy**:
```
Category: {categoryName} ({categoryKey})
Vendor: {vendorName}
User's Answers: {categoryAnswers}

Articles to Analyze:
{articles with full textContent}

Task: Synthesize findings from all articles relevant to this category.

1. Write multi-paragraph synthesis (200-400 words)
2. Extract 3-5 key bullet points
3. Cite sources with relevant quotes
4. Identify contradictions with user's answers (if any)
5. Note additional considerations discovered in research
6. Provide confidence level (high/medium/low)

Focus on insights the user couldn't get from titles/snippets alone.
```

---

## Testing Each Stage

### Stage 1: Verify Existing Search APIs

```bash
# Test Brave Search (should return 20-50 results)
curl -X POST https://leicgzljnodyrdbbcgoq.supabase.co/functions/v1/brave-search \
  -H "Content-Type: application/json" \
  -d '{"query": "Jasper AI writing tool", "category": "see", "resultCount": 20}'

# Test Exa Search (should return 20-50 results)
curl -X POST https://leicgzljnodyrdbbcgoq.supabase.co/functions/v1/exa-search \
  -H "Content-Type: application/json" \
  -d '{"query": "Jasper AI writing tool", "category": "see", "resultCount": 20}'
```

### Stage 2: Test Gemini Filtering

```bash
# Test filter-research-results
curl -X POST https://leicgzljnodyrdbbcgoq.supabase.co/functions/v1/filter-research-results \
  -H "Content-Type: application/json" \
  -d @test-data/search-results.json
```

### Stage 3: Test Content Fetching

```bash
# Test fetch-article-content
curl -X POST https://leicgzljnodyrdbbcgoq.supabase.co/functions/v1/fetch-article-content \
  -H "Content-Type: application/json" \
  -d '{"urls": ["https://example.com/article1", "https://example.com/article2"]}'
```

### Stage 4: Test Category Analysis

```bash
# Test analyze-category-content
curl -X POST https://leicgzljnodyrdbbcgoq.supabase.co/functions/v1/analyze-category-content \
  -H "Content-Type: application/json" \
  -d @test-data/category-analysis.json
```

---

## Frontend Integration

Update `apps/evaluation-tool/src/services/researchService.ts`:

```typescript
import { supabase } from '@/lib/supabase';

export async function generateExtendedReport(
  vendorName: string,
  evaluationData: EvaluationData
): Promise<Report> {

  // STAGE 1: Broad search (existing function, increased result count)
  const searchResults = await broadSearch(vendorName, evaluationData);
  // Returns 240-300 SearchResults

  // STAGE 2: AI relevance filtering (NEW)
  const { data: filterData } = await supabase.functions.invoke(
    'filter-research-results',
    {
      body: {
        vendorName,
        searchResults,
        userAnswers: evaluationData.answers
      }
    }
  );
  const filteredResults = filterData.filteredResults;  // 30-50 relevant results

  // STAGE 3: Full content fetching (NEW)
  const { data: contentData } = await supabase.functions.invoke(
    'fetch-article-content',
    {
      body: {
        urls: filteredResults.map(r => r.url),
        batchSize: 10,
        timeout: 30000
      }
    }
  );
  const articles = contentData.articles;  // ArticleContent[] with full text

  // STAGE 4: AI content analysis (NEW)
  const categoryInsights = await Promise.all(
    categories.map(async (category) => {
      const { data } = await supabase.functions.invoke(
        'analyze-category-content',
        {
          body: {
            vendorName,
            categoryKey: category.key,
            articles: articles.filter(a => a.category === category.key),
            userAnswers: evaluationData.answers,
            categoryQuestions: category.questions
          }
        }
      );
      return data.categoryInsight;
    })
  );

  // STAGE 5: Report synthesis (existing function)
  const { data: reportData } = await supabase.functions.invoke(
    'generate-report-content',
    {
      body: {
        vendorName,
        evaluationData,
        categoryInsights,  // NEW: Include Gemini insights
        voiceMode: 'no-bs'
      }
    }
  );

  return reportData.report;
}
```

---

## Caching Strategy

Update cache version to invalidate old cache with wrong property names:

```typescript
// OLD (v4): vendoreval:research:v4:{vendorName}:{categoryKey}
// NEW (v5): vendoreval:research:v5:{vendorName}:{categoryKey}

const CACHE_VERSION = 'v5';
const CACHE_TTL = 7 * 24 * 60 * 60 * 1000;  // 7 days

function getCacheKey(vendorName: string, categoryKey: string): string {
  return `vendoreval:research:${CACHE_VERSION}:${vendorName}:${categoryKey}`;
}
```

---

## Performance Expectations

### Latency Targets

- Stage 1 (Search): 2-5 seconds (12 parallel API calls)
- Stage 2 (Filter): 5-10 seconds (single Gemini call, large context)
- Stage 3 (Fetch): 10-20 seconds (30-50 articles, batched)
- Stage 4 (Analyze): 15-30 seconds (6 parallel Gemini calls)
- Stage 5 (Synthesize): 10-20 seconds (Claude API)

**Total: 42-85 seconds (well under 3-minute spec requirement)**

### Cost Estimates

- Brave Search: Free tier (1 req/sec)
- Exa Search: Check tier pricing
- Gemini Flash: ~$0.075/$0.30 per million tokens (input/output)
  - Stage 2 filter: ~100K input tokens = $0.0075
  - Stage 4 analysis: 6 × 50K input = $0.0225
  - **Total per report: ~$0.10-0.20**

---

## Error Handling

### Progressive Degradation

```typescript
try {
  // Attempt Extended Report with full research
  return await generateExtendedReport(vendorName, evaluationData);
} catch (error) {
  console.error('Research failed:', error);

  // Fallback 1: Extended Report with partial research
  if (someResultsAvailable) {
    return await generatePartialReport(vendorName, evaluationData, partialResults);
  }

  // Fallback 2: Quick Report (answers only, no research)
  return await generateQuickReport(vendorName, evaluationData);
}
```

### User Feedback

Show progress during generation:

```typescript
// Stage 1
setProgress('Searching 12 sources across 6 categories...');

// Stage 2
setProgress('Filtering 243 results for relevance...');

// Stage 3
setProgress('Fetching full content from 42 articles...');

// Stage 4
setProgress('Analyzing content across 6 categories...');

// Stage 5
setProgress('Generating final report...');
```

---

## Deployment Checklist

Before deploying to production:

1. ✅ Set all API keys in Supabase secrets
2. ✅ Deploy new Edge Functions to Supabase
3. ✅ Update frontend `researchService.ts` with 5-stage pipeline
4. ✅ Bump cache version to v5
5. ✅ Test full pipeline with real vendor (e.g., Jasper)
6. ✅ Verify 90% relevance improvement for common names
7. ✅ Confirm 30-50 articles in final report
8. ✅ Check total generation time < 3 minutes
9. ✅ Test error handling (network failures, rate limits)
10. ✅ Verify mobile experience (progress indicators)

---

## Troubleshooting

### Issue: Gemini API rate limit exceeded

**Solution**: Add exponential backoff retry logic:

```typescript
async function callGeminiWithRetry(prompt: string, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await gemini.generateContent(prompt);
    } catch (error) {
      if (error.status === 429 && i < maxRetries - 1) {
        const delay = Math.pow(2, i) * 1000;  // 1s, 2s, 4s
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }
}
```

### Issue: jsdom memory leak in Edge Function

**Solution**: Always call `window.close()` after parsing:

```typescript
import { JSDOM } from 'jsdom';
import { Readability } from '@mozilla/readability';

const dom = new JSDOM(htmlContent, { url });
try {
  const reader = new Readability(dom.window.document);
  const article = reader.parse();
  return article;
} finally {
  dom.window.close();  // Critical: free memory
}
```

### Issue: Readability returns empty content

**Solution**: Fallback to Cheerio for structured sites:

```typescript
import * as cheerio from 'cheerio';

if (!article || article.textContent.length < 100) {
  console.log('Readability failed, trying Cheerio fallback');
  const $ = cheerio.load(htmlContent);
  const text = $('article, .post-content, .entry-content, main').text().trim();
  return { textContent: text, extractionMethod: 'cheerio' };
}
```

### Issue: Paywalled content blocks fetching

**Solution**: Skip gracefully and note in report:

```typescript
if (response.status === 403 || response.status === 402) {
  return {
    url,
    fetchStatus: 'skipped',
    fetchError: 'Paywall detected',
    textContent: ''
  };
}
```

---

## Next Steps

After completing Phase 1 planning:

1. Run `/speckit.tasks` to generate task breakdown
2. Begin implementation with User Story 1 (P1 - Relevant Research Results)
3. Follow TDD approach: write tests first, then implementation
4. Test each stage independently before integration

---

**Last Updated**: 2025-10-26
**Feature**: 005-ai-research-pipeline
**Status**: Planning Phase (Phase 1)

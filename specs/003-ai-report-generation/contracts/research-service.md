# Contract: Research Service

**Feature**: 003-ai-report-generation
**Created**: 2025-10-26
**File**: `apps/evaluation-tool/src/services/researchService.ts`

## Purpose

Perform external web research on vendor software to augment user-provided evaluation answers with objective findings from public sources.

## Interface

```typescript
interface ResearchService {
  /**
   * Research a vendor across multiple categories
   * @param vendorName - Vendor to research
   * @param categories - Category keys to research ('see', 'change', etc.)
   * @returns Promise resolving to research findings array
   */
  researchVendor(
    vendorName: string,
    categories: CategoryKey[]
  ): Promise<ResearchFinding[]>;

  /**
   * Research a single category for a vendor
   * @param vendorName - Vendor to research
   * @param categoryKey - Category to research
   * @param searchTerms - Specific search terms for this category
   * @returns Promise resolving to research finding or null if no results
   */
  searchCategory(
    vendorName: string,
    categoryKey: CategoryKey,
    searchTerms: string[]
  ): Promise<ResearchFinding | null>;

  /**
   * Clear research cache for a vendor
   * @param vendorName - Vendor to clear cache for
   * @param categoryKey - Optional: clear specific category only
   */
  clearCache(vendorName: string, categoryKey?: CategoryKey): void;

  /**
   * Get cache statistics
   * @returns Cache metrics
   */
  getCacheStats(): CacheStats;
}

interface CacheStats {
  totalEntries: number;
  totalSizeBytes: number;
  oldestEntryAge: number;  // milliseconds
  hitRate: number;         // 0-1 (percentage as decimal)
}

type CategoryKey = 'see' | 'change' | 'use' | 'adapt' | 'leave' | 'learn';
```

## Behavior Specification

### 1. `researchVendor(vendorName, categories)`

**Preconditions**:
- `vendorName` is non-empty string
- `categories` is array of 1-6 valid CategoryKey values

**Process Flow**:

```typescript
async function researchVendor(
  vendorName: string,
  categories: CategoryKey[]
): Promise<ResearchFinding[]> {
  const findings: ResearchFinding[] = [];

  for (const categoryKey of categories) {
    // 1. Check cache first
    const cached = loadFromCache(vendorName, categoryKey);
    if (cached && !isExpired(cached)) {
      findings.push(cached);
      continue;
    }

    // 2. Determine search terms for this category
    const searchTerms = getSearchTermsForCategory(categoryKey);

    // 3. Perform research
    try {
      const finding = await searchCategory(vendorName, categoryKey, searchTerms);
      if (finding) {
        findings.push(finding);
        saveToCache(vendorName, categoryKey, finding);
      }
    } catch (error) {
      console.warn(`Research failed for ${categoryKey}:`, error);
      // Continue with other categories - don't fail entire operation
    }
  }

  return findings;
}
```

**Search Terms by Category**:

| Category | Search Terms |
|----------|--------------|
| See | `"{vendor} transparency"`, `"{vendor} system prompts visible"`, `"{vendor} model disclosure"` |
| Change | `"{vendor} customization"`, `"{vendor} vendor lock-in"`, `"{vendor} proprietary"` |
| Use | `"{vendor} ease of use"`, `"{vendor} user complexity"`, `"{vendor} learning curve"` |
| Adapt | `"{vendor} model updates"`, `"{vendor} autonomy controls"`, `"{vendor} integration"` |
| Leave | `"{vendor} data export"`, `"{vendor} migration path"`, `"{vendor} data portability"` |
| Learn | `"{vendor} documentation"`, `"{vendor} skill transferability"`, `"{vendor} training"` |

**Performance**:
- Per category: < 3 seconds (Brave Search API)
- Total for 6 categories: < 18 seconds
- Parallelization: Search categories concurrently

**Error Handling**:

| Error Condition | Behavior |
|-----------------|----------|
| Brave API rate limit | Fall back to Ref MCP search |
| Brave API timeout (> 5s) | Skip category, log warning |
| No relevant results found | Return empty array (not an error) |
| Cache read error | Proceed with fresh search, log warning |

**Postconditions**:
- Returns array of 0-6 ResearchFinding objects
- All findings have confidence score ('high', 'medium', or 'low')
- All findings cached in LocalStorage (7-day TTL)
- hitRate metric updated

---

### 2. `searchCategory(vendorName, categoryKey, searchTerms)`

**Preconditions**:
- `vendorName` is non-empty string
- `categoryKey` is valid CategoryKey
- `searchTerms` is non-empty array of strings

**Process Flow**:

```typescript
async function searchCategory(
  vendorName: string,
  categoryKey: CategoryKey,
  searchTerms: string[]
): Promise<ResearchFinding | null> {
  // 1. Construct search queries
  const queries = searchTerms.map(term => `${term} ${vendorName}`);

  // 2. Perform searches via Brave API (parallel)
  const searchResults = await Promise.all(
    queries.map(query => braveSearch(query))
  );

  // 3. Filter and rank results
  const relevantResults = searchResults
    .flat()
    .filter(result => isRelevant(result, vendorName))
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, 3);  // Top 3 most relevant

  if (relevantResults.length === 0) {
    return null;  // No relevant results found
  }

  // 4. Extract sources
  const sources: Source[] = relevantResults.map(result => ({
    url: result.url,
    title: result.title,
    snippet: result.snippet.slice(0, 200),
    publishedDate: result.age ? formatDate(result.age) : undefined
  }));

  // 5. Generate finding summary
  const finding = await generateFindingSummary(
    categoryKey,
    sources,
    vendorName
  );

  // 6. Calculate confidence
  const confidence = calculateConfidence(sources);

  // 7. Construct ResearchFinding
  return {
    categoryKey,
    topic: getCategoryTopic(categoryKey),
    finding,
    sources,
    confidence,
    researchedAt: Date.now(),
    cacheExpiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000  // 7 days
  };
}
```

**Brave Search API Call**:

```typescript
async function braveSearch(query: string): Promise<BraveSearchResult[]> {
  const response = await fetch('https://api.search.brave.com/res/v1/web/search', {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'X-Subscription-Token': braveApiKey  // From Supabase environment
    },
    params: {
      q: query,
      count: 10,            // Top 10 results
      freshness: '1y',      // Prefer recent results
      safesearch: 'moderate'
    },
    signal: AbortSignal.timeout(5000)  // 5 second timeout
  });

  if (!response.ok) {
    throw new BraveAPIError(response.status, response.statusText);
  }

  return response.json();
}
```

**Relevance Filtering**:

```typescript
function isRelevant(result: BraveSearchResult, vendorName: string): boolean {
  // Must mention vendor name in title or description
  const mentionsVendor =
    result.title.toLowerCase().includes(vendorName.toLowerCase()) ||
    result.description.toLowerCase().includes(vendorName.toLowerCase());

  if (!mentionsVendor) return false;

  // Filter out irrelevant domains
  const blacklist = ['indeed.com', 'glassdoor.com', 'linkedin.com', 'twitter.com'];
  if (blacklist.some(domain => result.url.includes(domain))) {
    return false;
  }

  // Prefer official documentation and established sources
  const preferredDomains = [
    `.${vendorName.toLowerCase().replace(/\s+/g, '')}.com`,  // Official site
    'github.com',
    'docs.',
    'blog.',
    'medium.com'
  ];

  const relevanceBonus = preferredDomains.some(domain => result.url.includes(domain)) ? 0.3 : 0;

  result.relevanceScore = (result.page_age_rank || 0.5) + relevanceBonus;

  return true;
}
```

**Confidence Calculation**:

```typescript
function calculateConfidence(sources: Source[]): Confidence {
  // High confidence: 2+ sources, recent (< 6 months), consistent
  if (sources.length >= 2 && allSourcesConsistent(sources) && allSourcesRecent(sources, 6)) {
    return 'high';
  }

  // Medium confidence: 1 source, or 2+ older sources
  if (sources.length >= 1 && someSourcesRecent(sources, 12)) {
    return 'medium';
  }

  // Low confidence: old or inconsistent sources
  return 'low';
}

function allSourcesRecent(sources: Source[], months: number): boolean {
  const cutoff = Date.now() - (months * 30 * 24 * 60 * 60 * 1000);
  return sources.every(s => s.publishedDate && new Date(s.publishedDate).getTime() > cutoff);
}

function allSourcesConsistent(sources: Source[]): boolean {
  // Check if snippets contain conflicting information
  // Simple heuristic: no sources contain "but" or "however" when discussing same topic
  // More sophisticated: use embedding similarity (future enhancement)
  return true;  // Simplified for MVP
}
```

---

### 3. `clearCache(vendorName, categoryKey?)`

**Behavior**:
- If `categoryKey` provided: Clear single cache entry
- If `categoryKey` omitted: Clear all cache entries for vendor
- Updates cache stats (hitRate, totalEntries)

**Example**:
```typescript
// Clear all cache for vendor
researchService.clearCache('OpenAI GPT-4');

// Clear specific category cache
researchService.clearCache('OpenAI GPT-4', 'see');
```

---

### 4. `getCacheStats()`

**Behavior**:
- Scan all research cache entries in LocalStorage
- Calculate total size, count, hit rate
- Return metrics

**Example**:
```typescript
const stats = researchService.getCacheStats();
console.log(`Cache: ${stats.totalEntries} entries, ${stats.hitRate * 100}% hit rate`);
```

---

## Cache Management

### Cache Key Pattern

```
vendoreval:research:{vendorName}:{categoryKey}
```

**Example Keys**:
```
vendoreval:research:OpenAI GPT-4:see
vendoreval:research:Anthropic Claude:change
```

### Cache Entry Structure

```typescript
interface CachedResearchFinding extends ResearchFinding {
  cacheMetadata: {
    hits: number;              // Number of times retrieved from cache
    lastAccessed: number;      // Unix timestamp
  };
}
```

### Expiration Strategy

**TTL**: 7 days (Safari-compatible)

**Expiration Check**:
```typescript
function isExpired(finding: ResearchFinding): boolean {
  return Date.now() > finding.cacheExpiresAt;
}
```

**Automatic Cleanup**:
- Purge expired entries on service initialization
- Purge expired entries when cache size exceeds 2MB

---

## Error Types

```typescript
class ResearchError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'ResearchError';
  }
}

class BraveAPIError extends ResearchError {
  constructor(public statusCode: number, message: string) {
    super(`Brave API error (${statusCode}): ${message}`, 'BRAVE_API_ERROR');
  }
}

class CacheError extends ResearchError {
  constructor(message: string) {
    super(message, 'CACHE_ERROR');
  }
}
```

---

## Configuration

```typescript
interface ResearchServiceConfig {
  braveApiKey: string;           // From Supabase environment
  braveApiUrl: string;           // 'https://api.search.brave.com/res/v1/web/search'
  timeout: number;               // 5000ms per search
  maxResultsPerQuery: number;    // 10
  cacheKeyPrefix: string;        // 'vendoreval:research'
  cacheTTL: number;              // 7 days in milliseconds
  parallelSearches: boolean;     // true (search categories concurrently)
  fallbackToRefMCP: boolean;     // true (if Brave fails, try Ref)
}
```

---

## Fallback Strategy: Ref MCP

**When to use**:
- Brave API rate limit exceeded
- Brave API error (5xx status)
- Brave API timeout

**Implementation**:
```typescript
async function fallbackToRefMCP(query: string): Promise<RefMCPResult[]> {
  // Use Ref MCP server for documentation search
  const results = await mcp.tools.ref_search_documentation({
    query: `${query} documentation`
  });

  return results.map(result => ({
    url: result.url,
    title: result.title,
    snippet: result.snippet,
    source: 'ref-mcp'
  }));
}
```

**Advantages of Ref MCP**:
- Already available in environment
- Good for technical documentation
- No cost

**Limitations**:
- Limited to documentation sources (not general web)
- Smaller index than Brave

---

## Testing Requirements

### Unit Tests

1. **Search Term Generation**:
   - Correct terms for each category
   - Vendor name interpolation

2. **Relevance Filtering**:
   - Vendor name must be mentioned
   - Blacklisted domains excluded
   - Preferred domains scored higher

3. **Confidence Calculation**:
   - High: 2+ recent consistent sources
   - Medium: 1 recent source
   - Low: old or inconsistent sources

4. **Cache Management**:
   - Cache hit/miss logic
   - Expiration detection
   - Cache cleanup

### Integration Tests

1. **Brave API Integration**:
   - Successful search with results
   - Search with no results
   - API error handling
   - API timeout handling
   - Rate limit handling

2. **Cache Integration**:
   - First search (cache miss) → cache save
   - Second search (cache hit) → no API call
   - Expired cache → fresh search

3. **Fallback to Ref MCP**:
   - Brave fails → Ref MCP used
   - Ref MCP results processed correctly

---

## Performance Benchmarks

| Operation | Target | Typical | Max Acceptable |
|-----------|--------|---------|----------------|
| Single category research | <3s | 2s | 5s |
| All 6 categories (no cache) | <18s | 12s | 20s |
| All 6 categories (50% cache) | <9s | 6s | 12s |
| Cache lookup | <5ms | 2ms | 10ms |

---

## Cost Analysis

### Brave Search API Pricing

**Free Tier**: 2,000 searches/month

**Paid Tier**: $3 per 1,000 searches

**Per Report Cost** (6 categories):
- Without cache: 6 searches × $0.003 = $0.018
- With 50% cache hit rate: 3 searches × $0.003 = $0.009

**Monthly Costs**:
- 100 reports/month: $0.90 - $1.80
- 1,000 reports/month: $9 - $18
- 10,000 reports/month: $90 - $180

---

## Privacy Considerations

### Data Sent to Brave API

✅ **Sent**:
- Vendor name (e.g., "OpenAI GPT-4")
- Category search terms (e.g., "transparency", "customization")

❌ **NOT Sent**:
- User evaluation answers
- User notes
- User identifiers
- Evaluation IDs

### Cache Privacy

- Cache stored in browser LocalStorage (per-user)
- No cross-user cache sharing
- Cache contains only public information (web search results)
- No sensitive data in cache

---

## Example Usage

```typescript
import { researchService } from '@/services/researchService';

// Research all categories for a vendor
const findings = await researchService.researchVendor('OpenAI GPT-4', [
  'see', 'change', 'use', 'adapt', 'leave', 'learn'
]);

console.log(`Found research for ${findings.length} categories`);

findings.forEach(finding => {
  console.log(`${finding.categoryKey}: ${finding.confidence} confidence`);
  console.log(`Finding: ${finding.finding}`);
  console.log(`Sources: ${finding.sources.length}`);
});

// Check cache stats
const stats = researchService.getCacheStats();
console.log(`Cache hit rate: ${(stats.hitRate * 100).toFixed(1)}%`);
```

---

**Related Contracts**:
- [report-service.md](./report-service.md) - Report generation orchestration
- [data-model.md](../data-model.md) - ResearchFinding data structure

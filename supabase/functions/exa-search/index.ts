// Exa (Metaphor) Search Edge Function
// Feature: 004-analytical-report-format (Phase 4 - Extended Report with Research)
// Updated: 005-ai-research-pipeline (Phase 2 - Added resultCount parameter for broader search)
// Purpose: Search for vendor information using Exa API (semantic/neural search)

import { corsHeaders } from '../_shared/cors.ts';

const EXA_API_URL = 'https://api.exa.ai/search';

// High-quality domains to prioritize
const PRIORITY_DOMAINS = [
  'github.com',
  'reddit.com',
  'news.ycombinator.com',
  'stackoverflow.com',
  'medium.com',
];

// Category-specific search query templates
const CATEGORY_QUERY_TEMPLATES: Record<string, string[]> = {
  see: ['transparency', 'observability', 'monitoring', 'visibility', 'data access'],
  change: ['customization', 'configuration', 'flexibility', 'lock-in', 'vendor lock-in'],
  use: ['ease of use', 'complexity', 'learning curve', 'user experience', 'usability'],
  adapt: ['integration', 'API', 'compatibility', 'extensibility', 'ecosystem'],
  leave: ['portability', 'data export', 'migration', 'exit strategy', 'data ownership'],
  learn: ['documentation', 'learning resources', 'community', 'support', 'tutorials'],
};

interface ExaSearchRequest {
  vendorName: string;
  categoryKey: string;
  resultCount?: number;  // Optional: 5-50, defaults to 5 for backward compatibility
}

interface ExaResult {
  id: string;
  url: string;
  title: string;
  publishedDate?: string;
  author?: string;
  score?: number;
}

interface ExaSearchResponse {
  results: ExaResult[];
}

interface ResearchFinding {
  categoryKey: string;
  topic: string;
  finding: string;
  sources: {
    title: string;
    url: string;
    snippet?: string;
    publishedDate?: string;
    sourceType: 'exa';
  }[];
  confidence: 'high' | 'medium' | 'low';
  researchedAt: number;
  cacheExpiresAt: number;
  sourceType: 'exa';
  sourceAge: string;
  ageMonths: number;
  isFoundational: boolean;
  domainAuthority: 'high' | 'medium' | 'low';
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get API key from environment
    const apiKey = Deno.env.get('EXA_API_KEY');
    if (!apiKey) {
      throw new Error('EXA_API_KEY not configured');
    }

    // Parse request
    const { vendorName, categoryKey, resultCount = 5 }: ExaSearchRequest = await req.json();

    if (!vendorName || !categoryKey) {
      return new Response(
        JSON.stringify({ error: 'Missing vendorName or categoryKey' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate and clamp resultCount (5-50)
    const requestedCount = Math.max(5, Math.min(50, resultCount));

    // Build search query with AI context to disambiguate
    const queryTerms = CATEGORY_QUERY_TEMPLATES[categoryKey] || [];
    const primaryTerms = queryTerms.slice(0, 3).join(' ');
    // Add AI context and quote vendor name for exact match
    // e.g., "jasper" AI instead of just jasper to avoid unrelated results
    const searchQuery = `"${vendorName}" AI ${primaryTerms}`;

    console.log(`[Exa Search] Query: ${searchQuery} (category: ${categoryKey})`);

    // Calculate date 6 months ago for filtering
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const startDate = sixMonthsAgo.toISOString().split('T')[0];

    // Call Exa API with retry logic
    let searchResults: ExaResult[] = [];
    let attempt = 0;
    const maxAttempts = 2;

    while (attempt < maxAttempts) {
      try {
        const response = await fetch(EXA_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            query: searchQuery,
            numResults: requestedCount,
            type: 'neural', // Semantic search
            useAutoprompt: true, // Let Exa optimize the query
            startPublishedDate: startDate, // Last 6 months
            includeDomains: PRIORITY_DOMAINS, // Focus on high-quality sources
          }),
        });

        if (response.status === 429 || response.status === 503) {
          // Rate limit or service unavailable - retry with exponential backoff
          attempt++;
          if (attempt < maxAttempts) {
            const backoffMs = 1000 * Math.pow(2, attempt);
            console.log(`[Exa Search] Retrying after ${backoffMs}ms (attempt ${attempt}/${maxAttempts})`);
            await new Promise(resolve => setTimeout(resolve, backoffMs));
            continue;
          }
          throw new Error(`Exa API error: ${response.status} ${response.statusText}`);
        }

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Exa API error: ${response.status} ${response.statusText} - ${errorText}`);
        }

        const data: ExaSearchResponse = await response.json();
        searchResults = data.results || [];
        break; // Success
      } catch (error) {
        attempt++;
        if (attempt >= maxAttempts) {
          throw error;
        }
      }
    }

    // Score and filter results by quality
    const scoredResults = searchResults.map(result => {
      let qualityScore = result.score || 0;

      // Domain authority boost
      const url = result.url.toLowerCase();
      if (PRIORITY_DOMAINS.some(domain => url.includes(domain))) {
        qualityScore += 0.3;
      }

      // Documentation boost
      if (url.includes('docs.') || url.includes('/docs/')) {
        qualityScore += 0.2;
      }

      // Calculate age in months
      const ageInMonths = result.publishedDate
        ? calculateAgeMonths(result.publishedDate)
        : 999;

      // Recency boost
      if (ageInMonths <= 6) {
        qualityScore += 0.2;
      } else if (ageInMonths <= 12) {
        qualityScore += 0.1;
      }

      return { ...result, qualityScore, ageInMonths };
    });

    // Filter and sort by quality
    const topResults = scoredResults
      .filter(r => r.qualityScore > 0)
      .sort((a, b) => b.qualityScore - a.qualityScore)
      .slice(0, requestedCount);

    // Format as research finding
    const finding: ResearchFinding = {
      categoryKey: categoryKey,
      topic: CATEGORY_QUERY_TEMPLATES[categoryKey]?.[0] || categoryKey,
      finding: topResults.map(r => r.title).join(' '), // Exa doesn't provide descriptions, use titles
      sources: topResults.map(r => ({
        title: r.title,
        url: r.url,
        snippet: undefined, // Exa doesn't provide snippets in basic search
        publishedDate: r.publishedDate || 'Unknown date',
        sourceType: 'exa' as const,
      })),
      confidence: topResults.length >= 3 ? 'high' : topResults.length >= 2 ? 'medium' : 'low',
      researchedAt: Date.now(),
      cacheExpiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000), // 7 days
      sourceType: 'exa' as const,
      sourceAge: topResults[0]?.publishedDate || 'Unknown',
      ageMonths: topResults[0]?.ageInMonths || 999,
      isFoundational: (topResults[0]?.ageInMonths || 0) > 12,
      domainAuthority: 'medium' as const,
    };

    console.log(`[Exa Search] Found ${topResults.length} quality results (confidence: ${finding.confidence})`);

    return new Response(
      JSON.stringify(finding),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[Exa Search] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Helper: Calculate age in months from published date
function calculateAgeMonths(publishedDate: string): number {
  try {
    const date = new Date(publishedDate);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    return Math.floor(diffMs / (1000 * 60 * 60 * 24 * 30));
  } catch {
    return 999; // Unknown age
  }
}

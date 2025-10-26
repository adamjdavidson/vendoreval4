// Exa (Metaphor) Search Edge Function
// Feature: 004-analytical-report-format (Phase 4 - Extended Report with Research)
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
  findingText: string;
  sources: {
    title: string;
    url: string;
    publishedDate: string;
    sourceType: 'exa';
  }[];
  confidence: 'high' | 'medium' | 'low';
  category: string;
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
    const { vendorName, categoryKey }: ExaSearchRequest = await req.json();

    if (!vendorName || !categoryKey) {
      return new Response(
        JSON.stringify({ error: 'Missing vendorName or categoryKey' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build search query
    const queryTerms = CATEGORY_QUERY_TEMPLATES[categoryKey] || [];
    const primaryTerms = queryTerms.slice(0, 3).join(' ');
    const searchQuery = `${vendorName} ${primaryTerms}`;

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
            numResults: 10,
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
      .slice(0, 5);

    // Format as research finding
    const finding: ResearchFinding = {
      findingText: topResults.map(r => r.title).join(' '), // Exa doesn't provide descriptions, use titles
      sources: topResults.map(r => ({
        title: r.title,
        url: r.url,
        publishedDate: r.publishedDate || 'Unknown date',
        sourceType: 'exa' as const,
      })),
      confidence: topResults.length >= 3 ? 'high' : topResults.length >= 2 ? 'medium' : 'low',
      category: categoryKey,
    };

    console.log(`[Exa Search] Found ${topResults.length} quality results (confidence: ${finding.confidence})`);

    return new Response(
      JSON.stringify(finding),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[Exa Search] Error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
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

// Brave Search Edge Function
// Feature: 004-analytical-report-format (Phase 4 - Extended Report with Research)
// Purpose: Search for vendor information using Brave Search API

import { corsHeaders } from '../_shared/cors.ts';

const BRAVE_API_URL = 'https://api.search.brave.com/res/v1/web/search';

// Category-specific search query templates
const CATEGORY_QUERY_TEMPLATES: Record<string, string[]> = {
  see: ['transparency', 'observability', 'monitoring', 'visibility', 'data access'],
  change: ['customization', 'configuration', 'flexibility', 'lock-in', 'vendor lock-in'],
  use: ['ease of use', 'complexity', 'learning curve', 'user experience', 'usability'],
  adapt: ['integration', 'API', 'compatibility', 'extensibility', 'ecosystem'],
  leave: ['portability', 'data export', 'migration', 'exit strategy', 'data ownership'],
  learn: ['documentation', 'learning resources', 'community', 'support', 'tutorials'],
};

interface BraveSearchRequest {
  vendorName: string;
  categoryKey: string;
}

interface BraveWebResult {
  title: string;
  url: string;
  description: string;
  age?: string;
  page_age?: string;
}

interface BraveSearchResponse {
  web?: {
    results: BraveWebResult[];
  };
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
    sourceType: 'brave';
  }[];
  confidence: 'high' | 'medium' | 'low';
  researchedAt: number;
  cacheExpiresAt: number;
  sourceType: 'brave';
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
    const apiKey = Deno.env.get('BRAVE_API_KEY');
    if (!apiKey) {
      throw new Error('BRAVE_API_KEY not configured');
    }

    // Parse request
    const { vendorName, categoryKey }: BraveSearchRequest = await req.json();

    if (!vendorName || !categoryKey) {
      return new Response(
        JSON.stringify({ error: 'Missing vendorName or categoryKey' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build search query
    const queryTerms = CATEGORY_QUERY_TEMPLATES[categoryKey] || [];
    const primaryTerms = queryTerms.slice(0, 3).join(' OR ');
    const searchQuery = `${vendorName} ${primaryTerms}`;

    console.log(`[Brave Search] Query: ${searchQuery} (category: ${categoryKey})`);

    // Call Brave Search API with retry logic
    let searchResults: BraveWebResult[] = [];
    let attempt = 0;
    const maxAttempts = 2;

    while (attempt < maxAttempts) {
      try {
        const url = new URL(BRAVE_API_URL);
        url.searchParams.set('q', searchQuery);
        url.searchParams.set('count', '10');
        url.searchParams.set('freshness', 'pm'); // Last month
        url.searchParams.set('text_decorations', 'false');

        const response = await fetch(url.toString(), {
          headers: {
            'Accept': 'application/json',
            'X-Subscription-Token': apiKey,
          },
        });

        if (response.status === 429 || response.status === 503) {
          // Rate limit or service unavailable - retry with exponential backoff
          attempt++;
          if (attempt < maxAttempts) {
            const backoffMs = 1000 * Math.pow(2, attempt);
            console.log(`[Brave Search] Retrying after ${backoffMs}ms (attempt ${attempt}/${maxAttempts})`);
            await new Promise(resolve => setTimeout(resolve, backoffMs));
            continue;
          }
          throw new Error(`Brave API error: ${response.status} ${response.statusText}`);
        }

        if (!response.ok) {
          throw new Error(`Brave API error: ${response.status} ${response.statusText}`);
        }

        const data: BraveSearchResponse = await response.json();
        searchResults = data.web?.results || [];
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
      let qualityScore = 0;

      // Domain authority indicators
      const url = result.url.toLowerCase();
      if (url.includes('github.com') || url.includes('reddit.com') || url.includes('news.ycombinator.com')) {
        qualityScore += 3; // High-value discussion forums
      }
      if (url.includes('docs.') || url.includes('/docs/')) {
        qualityScore += 2; // Official documentation
      }

      // Recency scoring
      const ageInMonths = parseAge(result.age || result.page_age);
      if (ageInMonths <= 6) {
        qualityScore += 2; // Recent
      } else if (ageInMonths <= 12) {
        qualityScore += 1; // Moderately recent
      } else if (ageInMonths > 12) {
        qualityScore -= 1; // Older content
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
      categoryKey: categoryKey,
      topic: CATEGORY_QUERY_TEMPLATES[categoryKey]?.[0] || categoryKey,
      finding: topResults.map(r => r.description).join(' '),
      sources: topResults.map(r => ({
        title: r.title,
        url: r.url,
        snippet: r.description,
        publishedDate: formatAge(r.age || r.page_age || ''),
        sourceType: 'brave' as const,
      })),
      confidence: topResults.length >= 3 ? 'high' : topResults.length >= 2 ? 'medium' : 'low',
      researchedAt: Date.now(),
      cacheExpiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000), // 7 days
      sourceType: 'brave' as const,
      sourceAge: topResults[0] ? formatAge(topResults[0].age || topResults[0].page_age || '') : 'Unknown',
      ageMonths: topResults[0]?.ageInMonths || 999,
      isFoundational: (topResults[0]?.ageInMonths || 0) > 12,
      domainAuthority: 'medium' as const,
    };

    console.log(`[Brave Search] Found ${topResults.length} quality results (confidence: ${finding.confidence})`);
    console.log(`[Brave Search] Returning finding with properties:`, Object.keys(finding));
    console.log(`[Brave Search] categoryKey=${finding.categoryKey}, has 'finding' property=${'finding' in finding}, has 'findingText' property=${'findingText' in finding}`);

    // EXPLICITLY construct response to ensure correct properties
    const response = {
      categoryKey: finding.categoryKey,
      topic: finding.topic,
      finding: finding.finding, // NOT findingText!
      sources: finding.sources,
      confidence: finding.confidence,
      researchedAt: finding.researchedAt,
      cacheExpiresAt: finding.cacheExpiresAt,
      sourceType: finding.sourceType,
      sourceAge: finding.sourceAge,
      ageMonths: finding.ageMonths,
      isFoundational: finding.isFoundational,
      domainAuthority: finding.domainAuthority,
    };

    return new Response(
      JSON.stringify(response),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[Brave Search] Error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Helper: Parse age string to months
function parseAge(ageStr: string): number {
  if (!ageStr) return 999; // Unknown age

  // Try ISO date format (YYYY-MM-DD or YYYY-MM)
  if (/^\d{4}-\d{2}/.test(ageStr)) {
    const date = new Date(ageStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    return Math.floor(diffMs / (1000 * 60 * 60 * 24 * 30));
  }

  // Try relative format ("2 days ago", "3 months ago")
  const match = ageStr.match(/(\d+)\s+(day|week|month|year)s?\s+ago/i);
  if (match) {
    const value = parseInt(match[1]);
    const unit = match[2].toLowerCase();
    switch (unit) {
      case 'day': return Math.floor(value / 30);
      case 'week': return Math.floor(value / 4);
      case 'month': return value;
      case 'year': return value * 12;
    }
  }

  return 999; // Unknown format
}

// Helper: Format age string to readable date
function formatAge(ageStr: string): string {
  if (!ageStr) return 'Unknown date';

  // If already ISO format, return as-is
  if (/^\d{4}-\d{2}/.test(ageStr)) {
    return ageStr;
  }

  // If relative format, convert to approximate ISO date
  const ageMonths = parseAge(ageStr);
  if (ageMonths < 999) {
    const date = new Date();
    date.setMonth(date.getMonth() - ageMonths);
    return date.toISOString().split('T')[0];
  }

  return ageStr; // Return as-is if can't parse
}

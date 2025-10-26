// Supabase Edge Function: Research vendor using Brave Search API and Exa
// Feature: 003-ai-report-generation

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ResearchRequest {
  vendorName: string;
  categoryKey: string;
  searchTerms: string[];
  compareServices?: boolean; // If true, returns both Exa and Brave results for comparison
}

interface Source {
  url: string;
  title: string;
  snippet: string;
  publishedDate?: string;
}

interface ResearchResult {
  service: 'exa' | 'brave';
  categoryKey: string;
  topic: string;
  finding: string;
  sources: Source[];
  confidence: 'high' | 'medium' | 'low';
  researchedAt: number;
  cacheExpiresAt: number;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { vendorName, categoryKey, searchTerms, compareServices } = await req.json() as ResearchRequest;

    // Validate required fields
    if (!vendorName || !categoryKey || !searchTerms) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: vendorName, categoryKey, searchTerms' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const query = buildSearchQuery(vendorName, searchTerms);

    // If compareServices=true, run both and return comparison
    if (compareServices) {
      const [braveResult, exaResult] = await Promise.allSettled([
        searchWithBrave(query, categoryKey),
        searchWithExa(query, categoryKey),
      ]);

      return new Response(
        JSON.stringify({
          comparison: true,
          brave: braveResult.status === 'fulfilled' ? braveResult.value : { error: braveResult.reason?.message },
          exa: exaResult.status === 'fulfilled' ? exaResult.value : { error: exaResult.reason?.message },
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Production mode: Try Exa first, fallback to Brave
    try {
      const exaResult = await searchWithExa(query, categoryKey);
      if (exaResult) {
        return new Response(
          JSON.stringify(exaResult),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    } catch (error) {
      console.warn('Exa search failed, falling back to Brave:', error);
    }

    // Fallback to Brave
    const braveResult = await searchWithBrave(query, categoryKey);
    return new Response(
      JSON.stringify(braveResult),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Research error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

/**
 * Search using Brave Search API (with Pro features)
 */
async function searchWithBrave(query: string, categoryKey: string): Promise<ResearchResult> {
  const BRAVE_API_KEY = Deno.env.get('BRAVE_API_KEY');
  if (!BRAVE_API_KEY) {
    throw new Error('BRAVE_API_KEY not configured');
  }

  const searchParams = new URLSearchParams({
    q: query,
    count: '5',
    search_lang: 'en',
    // Brave Pro features
    extra_snippets: 'true',
    discussions: 'true',
    text_decorations: 'false',
  });

  const response = await fetch(
    `https://api.search.brave.com/res/v1/web/search?${searchParams}`,
    {
      headers: {
        'Accept': 'application/json',
        'X-Subscription-Token': BRAVE_API_KEY,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Brave API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  const sources: Source[] = [];
  const snippets: string[] = [];

  // Web results
  if (data.web?.results) {
    data.web.results.slice(0, 3).forEach((result: any) => {
      sources.push({
        url: result.url,
        title: result.title,
        snippet: result.description || result.extra_snippets?.[0] || '',
        publishedDate: result.age || undefined,
      });
      snippets.push(result.description || '');
    });
  }

  // Discussions (Reddit, forums) - Brave Pro
  if (data.discussions?.results) {
    data.discussions.results.slice(0, 2).forEach((result: any) => {
      sources.push({
        url: result.url,
        title: result.title,
        snippet: result.description || '',
      });
      snippets.push(result.description || '');
    });
  }

  // FAQ - Brave Pro
  if (data.faq?.results) {
    data.faq.results.slice(0, 1).forEach((result: any) => {
      snippets.push(`Q: ${result.question} A: ${result.answer}`);
    });
  }

  if (sources.length === 0) {
    throw new Error('No results found');
  }

  const confidence = calculateConfidence(sources, snippets);
  const finding = synthesizeFinding(snippets);

  return {
    service: 'brave',
    categoryKey,
    topic: getCategoryTopic(categoryKey),
    finding,
    sources,
    confidence,
    researchedAt: Date.now(),
    cacheExpiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  };
}

/**
 * Search using Exa (semantic search)
 * TODO: Implement Exa integration
 */
async function searchWithExa(query: string, categoryKey: string): Promise<ResearchResult | null> {
  // Placeholder for Exa implementation
  console.log('Exa search not yet implemented');
  return null;
}

/**
 * Build search query
 */
function buildSearchQuery(vendorName: string, searchTerms: string[]): string {
  const primaryTerms = searchTerms.slice(0, 3).join(' OR ');
  return `${vendorName} ${primaryTerms}`;
}

/**
 * Calculate confidence based on source count and quality
 */
function calculateConfidence(sources: Source[], snippets: string[]): 'high' | 'medium' | 'low' {
  if (sources.length >= 3) return 'high';
  if (sources.length === 2) return 'medium';
  if (sources.length === 1 && snippets.some(s => s.length > 200)) return 'medium';
  return 'low';
}

/**
 * Synthesize finding from snippets
 */
function synthesizeFinding(snippets: string[]): string {
  const combined = snippets.filter(s => s && s.length > 0).join(' ').trim();

  if (combined.length <= 500) return combined;

  const truncated = combined.substring(0, 500);
  const lastPeriod = truncated.lastIndexOf('.');
  return lastPeriod > 0 ? truncated.substring(0, lastPeriod + 1) : truncated + '...';
}

/**
 * Get category topic name
 */
function getCategoryTopic(categoryKey: string): string {
  const topics: Record<string, string> = {
    see: 'Transparency & Observability',
    change: 'Customization & Lock-in',
    use: 'Ease of Use',
    adapt: 'Change Management',
    leave: 'Data Portability & Exit',
    learn: 'Documentation & Skills',
  };
  return topics[categoryKey] || categoryKey;
}

/**
 * Filter Research Results Edge Function
 * Feature: 005-ai-research-pipeline
 * Stage 2: AI Relevance Filtering
 *
 * Uses Gemini Flash 2.0 to filter search results for relevance to target vendor.
 * Achieves 90% relevance for common vendor names (MVP goal).
 *
 * Input: Array of SearchResult from Stage 1
 * Output: Array of FilteredResult with relevance scores and reasoning
 */

import { GoogleGenerativeAI } from 'npm:@google/generative-ai@0.21.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  publishedDate?: string;
  sourceType: 'brave' | 'exa';
  score?: number;
}

interface FilteredResult extends SearchResult {
  relevanceScore: number;
  relevanceReasoning: string;
  isAboutTargetVendor: boolean;
  geminiFilteredAt: number;
}

interface FilterRequest {
  vendorName: string;
  categoryKey: string;
  searchResults: SearchResult[];
}

interface FilterResponse {
  filteredResults: FilteredResult[];
  metadata: {
    originalCount: number;
    filteredCount: number;
    averageRelevanceScore: number;
    processingTimeMs: number;
  };
}

/**
 * Constructs the AI filtering prompt
 * Optimized for Gemini Flash 2.0 to achieve 90% relevance
 */
function buildFilteringPrompt(vendorName: string, categoryKey: string, results: SearchResult[]): string {
  const categoryDescriptions: Record<string, string> = {
    see: 'Transparency - Can you see what the AI is doing?',
    change: 'Control - Can you change or correct the AI?',
    use: 'Utility - Is the AI actually useful in practice?',
    adapt: 'Adaptation - Does the AI improve over time?',
    leave: 'Exit - Can you stop using the AI if needed?',
    learn: 'Learning - Can you learn from the AI?'
  };

  const categoryDesc = categoryDescriptions[categoryKey] || categoryKey;

  return `You are an expert research analyst evaluating search results for relevance.

TARGET VENDOR: ${vendorName}
CATEGORY: ${categoryDesc}

Your task: For each search result below, determine if it discusses the target vendor specifically (not a different vendor with a similar name).

Return ONLY a valid JSON array with this structure:
[
  {
    "index": 0,
    "isAboutTargetVendor": true,
    "relevanceScore": 0.95,
    "reasoning": "Article specifically discusses ${vendorName}'s transparency features..."
  }
]

Rules:
1. relevanceScore: 0.0-1.0 (how relevant to the category)
2. isAboutTargetVendor: true only if it's clearly about ${vendorName}
3. If unsure about vendor identity, set isAboutTargetVendor: false
4. Be strict: different vendors with similar names should be marked false
5. Empty/generic content gets low scores

Search Results:
${results.map((r, idx) => `
[${idx}] ${r.title}
URL: ${r.url}
Snippet: ${r.snippet}
Source: ${r.sourceType}
Date: ${r.publishedDate || 'Unknown'}
`).join('\n---\n')}

Return only the JSON array, no other text.`;
}

/**
 * Validates vendor name to catch common ambiguous cases
 */
function validateVendorName(vendorName: string): { valid: boolean; warning?: string } {
  const normalized = vendorName.toLowerCase().trim();

  // Too short
  if (normalized.length < 2) {
    return { valid: false, warning: 'Vendor name too short (minimum 2 characters)' };
  }

  // Common generic terms
  const genericTerms = ['ai', 'the', 'software', 'tool', 'app', 'platform', 'system'];
  if (genericTerms.includes(normalized)) {
    return { valid: false, warning: `"${vendorName}" is too generic - please be more specific` };
  }

  // Warning for very common words (but don't block)
  const commonWords = ['google', 'microsoft', 'apple', 'amazon', 'meta', 'ibm', 'oracle'];
  if (commonWords.includes(normalized)) {
    return { valid: true, warning: `"${vendorName}" is a large company with many products - results may be broad` };
  }

  return { valid: true };
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const startTime = Date.now();

    // Parse request
    const { vendorName, categoryKey, searchResults }: FilterRequest = await req.json();

    // Validate inputs
    if (!vendorName || typeof vendorName !== 'string') {
      return new Response(
        JSON.stringify({ error: 'vendorName is required and must be a string' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!categoryKey || typeof categoryKey !== 'string') {
      return new Response(
        JSON.stringify({ error: 'categoryKey is required and must be a string' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!Array.isArray(searchResults) || searchResults.length === 0) {
      return new Response(
        JSON.stringify({ error: 'searchResults must be a non-empty array' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate vendor name
    const validation = validateVendorName(vendorName);
    if (!validation.valid) {
      return new Response(
        JSON.stringify({ error: validation.warning }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get Gemini API key
    const apiKey = Deno.env.get('GEMINI_API_KEY');
    if (!apiKey) {
      console.error('[Filter] GEMINI_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'AI service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-exp',
      generationConfig: {
        temperature: 0.1, // Low temperature for consistent evaluation
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192,
      }
    });

    // Build prompt and call Gemini
    const prompt = buildFilteringPrompt(vendorName, categoryKey, searchResults);
    console.log('[Filter] Calling Gemini Flash 2.0 for', searchResults.length, 'results');

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Parse JSON response
    let filterEvaluations: Array<{
      index: number;
      isAboutTargetVendor: boolean;
      relevanceScore: number;
      reasoning: string;
    }>;

    try {
      // Extract JSON from response (handle markdown code blocks)
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error('No JSON array found in response');
      }
      filterEvaluations = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error('[Filter] Failed to parse Gemini response:', text);
      const errorMessage = parseError instanceof Error ? parseError.message : 'Failed to parse AI response';
      return new Response(
        JSON.stringify({ error: 'AI response format error', details: errorMessage }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Combine search results with filter evaluations
    const now = Date.now();
    const filteredResults: FilteredResult[] = searchResults
      .map((result, idx) => {
        const evaluation = filterEvaluations.find(e => e.index === idx);
        if (!evaluation) {
          console.warn('[Filter] Missing evaluation for index', idx);
          return null;
        }

        return {
          ...result,
          relevanceScore: evaluation.relevanceScore,
          relevanceReasoning: evaluation.reasoning,
          isAboutTargetVendor: evaluation.isAboutTargetVendor,
          geminiFilteredAt: now,
        };
      })
      .filter((r): r is FilteredResult => r !== null)
      .filter(r => r.isAboutTargetVendor && r.relevanceScore > 0.5); // Keep only relevant results

    // Calculate metadata
    const processingTimeMs = Date.now() - startTime;
    const averageRelevanceScore = filteredResults.length > 0
      ? filteredResults.reduce((sum, r) => sum + r.relevanceScore, 0) / filteredResults.length
      : 0;

    const responseData: FilterResponse = {
      filteredResults,
      metadata: {
        originalCount: searchResults.length,
        filteredCount: filteredResults.length,
        averageRelevanceScore: Math.round(averageRelevanceScore * 100) / 100,
        processingTimeMs,
      },
    };

    console.log('[Filter] Filtered', searchResults.length, '→', filteredResults.length, 'results in', processingTimeMs, 'ms');
    if (validation.warning) {
      console.warn('[Filter] Warning:', validation.warning);
    }

    return new Response(
      JSON.stringify(responseData),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[Filter] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

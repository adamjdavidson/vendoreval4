/**
 * Filter Service - Stage 2: AI Relevance Filtering
 * Feature: 005-ai-research-pipeline
 *
 * Calls the filter-research-results Edge Function to filter search results
 * for relevance using Gemini Flash 2.0.
 */

import type { SearchResult, FilteredResult } from '../types/research';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_PROJECT_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

interface FilterResponse {
  filteredResults: FilteredResult[];
  metadata: {
    originalCount: number;
    filteredCount: number;
    averageRelevanceScore: number;
    processingTimeMs: number;
  };
}

interface FilterError {
  error: string;
  details?: string;
}

/**
 * Filters search results for relevance to target vendor
 *
 * @param vendorName - Target vendor name
 * @param categoryKey - Category being evaluated
 * @param searchResults - Results from Stage 1 search
 * @returns Filtered results with relevance scores
 * @throws Error if filtering fails
 */
export async function filterSearchResults(
  vendorName: string,
  categoryKey: string,
  searchResults: SearchResult[]
): Promise<FilterResponse> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('Supabase configuration missing');
  }

  if (!searchResults || searchResults.length === 0) {
    return {
      filteredResults: [],
      metadata: {
        originalCount: 0,
        filteredCount: 0,
        averageRelevanceScore: 0,
        processingTimeMs: 0,
      },
    };
  }

  const url = `${SUPABASE_URL}/functions/v1/filter-research-results`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        vendorName,
        categoryKey,
        searchResults,
      }),
    });

    if (!response.ok) {
      const errorData: FilterError = await response.json();
      throw new Error(errorData.error || `Filter service failed: ${response.status}`);
    }

    const data: FilterResponse = await response.json();
    return data;

  } catch (error) {
    console.error('[FilterService] Error filtering results:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to filter search results');
  }
}

/**
 * Filters results for multiple categories in parallel
 *
 * @param vendorName - Target vendor name
 * @param categories - Array of category keys
 * @param searchResultsByCategory - Map of category key to search results
 * @returns Map of category key to filtered results
 */
export async function filterMultipleCategories(
  vendorName: string,
  categories: string[],
  searchResultsByCategory: Record<string, SearchResult[]>
): Promise<Record<string, FilterResponse>> {
  const filterPromises = categories.map(async (categoryKey) => {
    const searchResults = searchResultsByCategory[categoryKey] || [];
    try {
      const filtered = await filterSearchResults(vendorName, categoryKey, searchResults);
      return { categoryKey, filtered };
    } catch (error) {
      console.error(`[FilterService] Failed to filter category ${categoryKey}:`, error);
      return {
        categoryKey,
        filtered: {
          filteredResults: [],
          metadata: {
            originalCount: searchResults.length,
            filteredCount: 0,
            averageRelevanceScore: 0,
            processingTimeMs: 0,
          },
        },
      };
    }
  });

  const results = await Promise.all(filterPromises);

  return results.reduce((acc, { categoryKey, filtered }) => {
    acc[categoryKey] = filtered;
    return acc;
  }, {} as Record<string, FilterResponse>);
}

/**
 * Get filter statistics summary
 */
export function getFilterStats(filterResponse: FilterResponse): {
  keepRate: number;
  avgScore: number;
  processingTime: string;
} {
  const { metadata } = filterResponse;
  const keepRate = metadata.originalCount > 0
    ? (metadata.filteredCount / metadata.originalCount) * 100
    : 0;

  return {
    keepRate: Math.round(keepRate),
    avgScore: Math.round(metadata.averageRelevanceScore * 100),
    processingTime: `${(metadata.processingTimeMs / 1000).toFixed(1)}s`,
  };
}

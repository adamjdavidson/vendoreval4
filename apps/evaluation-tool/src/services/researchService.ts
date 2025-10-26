// Research Service: External research using Exa MCP and Brave Search via Edge Function
// Feature: 003-ai-report-generation

import { supabase } from '../lib/supabase';
import { cacheManager } from '../utils/cacheManager';
import type { ResearchFinding, CategoryKey, Source } from '@shared/types/report';

// Category-specific search terms
const CATEGORY_SEARCH_TERMS: Record<CategoryKey, string[]> = {
  see: ['transparency', 'system prompts visibility', 'model routing', 'observability', 'debugging'],
  change: ['customization', 'vendor lock-in', 'data portability', 'migration', 'proprietary formats'],
  use: ['ease of use', 'learning curve', 'complexity', 'user experience', 'integration'],
  adapt: ['model updates', 'breaking changes', 'version control', 'rollback', 'stability'],
  leave: ['data export', 'migration path', 'exit strategy', 'vendor switching', 'data ownership'],
  learn: ['documentation', 'skill transferability', 'standards', 'ecosystem', 'community'],
};

class ResearchService {
  /**
   * Research a vendor across all categories
   */
  async researchVendor(
    vendorName: string,
    categories: CategoryKey[],
    compareServices: boolean = true // Set to true to test both services
  ): Promise<ResearchFinding[]> {
    const findings: ResearchFinding[] = [];

    for (const categoryKey of categories) {
      const finding = await this.researchCategory(vendorName, categoryKey, compareServices);
      if (finding) {
        findings.push(finding);
      }
    }

    return findings;
  }

  /**
   * Research a specific category for a vendor
   */
  async researchCategory(
    vendorName: string,
    categoryKey: CategoryKey,
    compareServices: boolean = false
  ): Promise<ResearchFinding | null> {
    // Check cache first
    const cached = cacheManager.get(vendorName, categoryKey);
    if (cached && !cacheManager.isExpired(cached)) {
      console.log(`[Research] Cache hit: ${vendorName} - ${categoryKey}`);
      return cached;
    }

    // Get search terms for this category
    const searchTerms = CATEGORY_SEARCH_TERMS[categoryKey];
    const query = this.buildSearchQuery(vendorName, categoryKey, searchTerms);

    let finding: ResearchFinding | null = null;

    if (compareServices) {
      // TEST MODE: Try both services and compare
      console.log(`[Research] Testing both Exa and Brave for: ${query}`);

      const [exaResult, braveResult] = await Promise.allSettled([
        this.searchWithExa(vendorName, categoryKey, query),
        this.searchWithBrave(vendorName, categoryKey, query),
      ]);

      // Log comparison results
      console.log('[Research] Exa result:', exaResult);
      console.log('[Research] Brave result:', braveResult);

      // Use whichever succeeded with highest confidence
      const exaFinding = exaResult.status === 'fulfilled' ? exaResult.value : null;
      const braveFinding = braveResult.status === 'fulfilled' ? braveResult.value : null;

      finding = this.selectBestFinding(exaFinding, braveFinding);
    } else {
      // PRODUCTION MODE: Use tiered fallback strategy
      try {
        finding = await this.searchWithExa(vendorName, categoryKey, query);
      } catch (error) {
        console.warn('[Research] Exa search failed, trying Brave:', error);
        try {
          finding = await this.searchWithBrave(vendorName, categoryKey, query);
        } catch (braveError) {
          console.error('[Research] Both Exa and Brave failed:', braveError);
          return null;
        }
      }
    }

    // Cache the result
    if (finding) {
      cacheManager.save(vendorName, categoryKey, finding);
    }

    return finding;
  }

  /**
   * Search using Exa MCP (semantic search, quality-focused)
   */
  private async searchWithExa(
    vendorName: string,
    categoryKey: CategoryKey,
    // @ts-expect-error - Unused parameter, will be used in Phase 4
    query: string
  ): Promise<ResearchFinding | null> {
    // Call Edge Function for Exa search
    const { data, error } = await supabase.functions.invoke('research-vendor', {
      body: {
        vendorName,
        categoryKey,
        searchTerms: CATEGORY_SEARCH_TERMS[categoryKey],
        compareServices: false, // Just use Exa
      },
    });

    if (error) {
      console.error('[Research] Exa search via Edge Function failed:', error);
      throw error;
    }

    return data as ResearchFinding;
  }

  /**
   * Search using Brave Search API (broad coverage, discussions)
   */
  private async searchWithBrave(
    vendorName: string,
    categoryKey: CategoryKey,
    // @ts-expect-error - Unused parameter, will be used in Phase 4
    query: string
  ): Promise<ResearchFinding | null> {
    // Call Edge Function for Brave search (API key stored securely server-side)
    const { data, error } = await supabase.functions.invoke('research-vendor', {
      body: {
        vendorName,
        categoryKey,
        searchTerms: CATEGORY_SEARCH_TERMS[categoryKey],
        compareServices: false, // Just use Brave
      },
    });

    if (error) {
      console.error('[Research] Brave search via Edge Function failed:', error);
      throw error;
    }

    return data as ResearchFinding;
  }

  /**
   * Select the best finding from multiple sources
   */
  private selectBestFinding(
    exaFinding: ResearchFinding | null,
    braveFinding: ResearchFinding | null
  ): ResearchFinding | null {
    if (!exaFinding && !braveFinding) return null;
    if (!exaFinding) return braveFinding;
    if (!braveFinding) return exaFinding;

    // Prefer high confidence over medium/low
    if (exaFinding.confidence === 'high' && braveFinding.confidence !== 'high') {
      return exaFinding;
    }
    if (braveFinding.confidence === 'high' && exaFinding.confidence !== 'high') {
      return braveFinding;
    }

    // Prefer more sources
    if (exaFinding.sources.length > braveFinding.sources.length) {
      return exaFinding;
    }

    // Default to Brave (has discussions feature)
    return braveFinding;
  }

  /**
   * Build search query for vendor and category
   */
  private buildSearchQuery(
    vendorName: string,
    // @ts-expect-error - Unused parameter, will be used in Phase 4
    categoryKey: CategoryKey,
    searchTerms: string[]
  ): string {
    const primaryTerms = searchTerms.slice(0, 3).join(' OR ');
    return `${vendorName} ${primaryTerms}`;
  }

  /**
   * Calculate confidence level based on sources
   */
  // @ts-expect-error - Unused method, will be used in Phase 4
  private calculateConfidence(sources: Source[], snippets: string[]): 'high' | 'medium' | 'low' {
    // High: Multiple consistent sources
    if (sources.length >= 3) return 'high';

    // Medium: 2 sources or 1 with substantial content
    if (sources.length === 2) return 'medium';
    if (sources.length === 1 && snippets.some(s => s.length > 200)) return 'medium';

    // Low: Single source with limited content
    return 'low';
  }

  /**
   * Synthesize finding from snippets
   */
  // @ts-expect-error - Unused method, will be used in Phase 4
  private synthesizeFinding(snippets: string[], _categoryKey: CategoryKey): string {
    // Join snippets and trim to 500 characters
    const combined = snippets
      .filter(s => s && s.length > 0)
      .join(' ')
      .trim();

    if (combined.length <= 500) return combined;

    // Truncate at last sentence boundary within 500 chars
    const truncated = combined.substring(0, 500);
    const lastPeriod = truncated.lastIndexOf('.');
    return lastPeriod > 0 ? truncated.substring(0, lastPeriod + 1) : truncated + '...';
  }

  /**
   * Get human-readable topic for category
   */
  // @ts-expect-error - Unused method, will be used in Phase 4
  private getCategoryTopic(categoryKey: CategoryKey): string {
    const topics: Record<CategoryKey, string> = {
      see: 'Transparency & Observability',
      change: 'Customization & Lock-in',
      use: 'Ease of Use',
      adapt: 'Change Management',
      leave: 'Data Portability & Exit',
      learn: 'Documentation & Skills',
    };
    return topics[categoryKey];
  }

  /**
   * Format Brave age string to readable date
   */
  // @ts-expect-error - Unused method, will be used in Phase 4
  private formatAge(age: string): string {
    // Brave returns age like "2025-10", "2 days ago", etc.
    return age;
  }

  /**
   * Clear cache for a vendor
   */
  clearCache(vendorName: string, categoryKey?: CategoryKey): void {
    cacheManager.delete(vendorName, categoryKey);
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return cacheManager.getStats();
  }
}

export const researchService = new ResearchService();

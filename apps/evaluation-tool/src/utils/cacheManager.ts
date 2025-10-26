// Cache management utilities for research findings
// Feature: 003-ai-report-generation

import type { ResearchFinding, CategoryKey, CacheStats } from '@shared/types/report';

const CACHE_PREFIX = 'vendoreval:research:';
const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

interface CachedResearchFinding extends ResearchFinding {
  cacheMetadata: {
    hits: number;
    lastAccessed: number;
  };
}

export class CacheManager {
  /**
   * Generate cache key for vendor and category
   */
  private getCacheKey(vendorName: string, categoryKey: CategoryKey): string {
    return `${CACHE_PREFIX}${vendorName}:${categoryKey}`;
  }

  /**
   * Save research finding to cache
   */
  save(vendorName: string, categoryKey: CategoryKey, finding: ResearchFinding): void {
    const key = this.getCacheKey(vendorName, categoryKey);
    const cachedFinding: CachedResearchFinding = {
      ...finding,
      cacheMetadata: {
        hits: 0,
        lastAccessed: Date.now(),
      },
    };

    try {
      localStorage.setItem(key, JSON.stringify(cachedFinding));
    } catch (error) {
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        // Try to clear old cache entries
        this.cleanup();
        // Retry
        try {
          localStorage.setItem(key, JSON.stringify(cachedFinding));
        } catch {
          console.warn('Unable to cache research finding - storage quota exceeded');
        }
      }
    }
  }

  /**
   * Get research finding from cache
   */
  get(vendorName: string, categoryKey: CategoryKey): ResearchFinding | null {
    const key = this.getCacheKey(vendorName, categoryKey);
    const data = localStorage.getItem(key);

    if (!data) return null;

    try {
      const cached = JSON.parse(data) as CachedResearchFinding;

      // Check if expired
      if (Date.now() > cached.cacheExpiresAt) {
        this.delete(vendorName, categoryKey);
        return null;
      }

      // Update hit count and last accessed
      cached.cacheMetadata.hits++;
      cached.cacheMetadata.lastAccessed = Date.now();
      localStorage.setItem(key, JSON.stringify(cached));

      return cached;
    } catch {
      console.error(`Failed to parse cached research for ${key}`);
      return null;
    }
  }

  /**
   * Check if finding is expired
   */
  isExpired(finding: ResearchFinding): boolean {
    return Date.now() > finding.cacheExpiresAt;
  }

  /**
   * Delete specific cache entry
   */
  delete(vendorName: string, categoryKey?: CategoryKey): void {
    if (categoryKey) {
      // Delete specific category
      const key = this.getCacheKey(vendorName, categoryKey);
      localStorage.removeItem(key);
    } else {
      // Delete all categories for vendor
      const keysToDelete: string[] = [];
      const prefix = `${CACHE_PREFIX}${vendorName}:`;

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(prefix)) {
          keysToDelete.push(key);
        }
      }

      keysToDelete.forEach(key => localStorage.removeItem(key));
    }
  }

  /**
   * Clear all research cache
   */
  clear(): void {
    const keysToDelete: string[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(CACHE_PREFIX)) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => localStorage.removeItem(key));
  }

  /**
   * Clean up expired cache entries
   */
  cleanup(): number {
    const keysToDelete: string[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(CACHE_PREFIX)) {
        const data = localStorage.getItem(key);
        if (data) {
          try {
            const cached = JSON.parse(data) as CachedResearchFinding;
            if (Date.now() > cached.cacheExpiresAt) {
              keysToDelete.push(key);
            }
          } catch {
            // Invalid cache entry, delete it
            keysToDelete.push(key);
          }
        }
      }
    }

    keysToDelete.forEach(key => localStorage.removeItem(key));
    return keysToDelete.length;
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    const entries: CachedResearchFinding[] = [];
    let totalHits = 0;
    let totalRequests = 0;

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(CACHE_PREFIX)) {
        const data = localStorage.getItem(key);
        if (data) {
          try {
            const cached = JSON.parse(data) as CachedResearchFinding;
            entries.push(cached);
            totalHits += cached.cacheMetadata.hits;
            totalRequests += cached.cacheMetadata.hits + 1; // +1 for initial request
          } catch {
            // Skip invalid entries
          }
        }
      }
    }

    if (entries.length === 0) {
      return {
        totalEntries: 0,
        totalSizeBytes: 0,
        oldestEntryAge: 0,
        hitRate: 0,
      };
    }

    const totalSizeBytes = entries.reduce((sum, entry) => {
      return sum + new Blob([JSON.stringify(entry)]).size;
    }, 0);

    const oldestEntry = entries.reduce((oldest, entry) => {
      return entry.researchedAt < oldest.researchedAt ? entry : oldest;
    });

    const oldestEntryAge = Date.now() - oldestEntry.researchedAt;
    const hitRate = totalRequests > 0 ? totalHits / totalRequests : 0;

    return {
      totalEntries: entries.length,
      totalSizeBytes,
      oldestEntryAge,
      hitRate,
    };
  }
}

export const cacheManager = new CacheManager();

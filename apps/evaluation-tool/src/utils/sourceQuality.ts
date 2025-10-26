/**
 * Source Quality Assessment Utility
 * Feature: 004-analytical-report-format
 *
 * Implements multi-factor scoring for research findings based on:
 * - Domain authority (official, tech-news, community, github, general)
 * - Recency (prefer <6 months, indicate age if >6 months, reject >12 months unless foundational)
 * - Source type (value Reddit/HN highly as user experience evidence)
 */

import type { DomainAuthority } from '../../../../shared/types/report';

export interface SourceQualityScore {
  score: number; // 0-100
  includeInReport: boolean;
  ageWarning?: string;
}

export interface SearchResult {
  title: string;
  url: string;
  description: string;
  publishedDate?: string; // ISO date
  domain: string;
}

// Domain classification lists
export const OFFICIAL_DOMAINS: string[] = [
  // Vendor domains will be added dynamically based on vendor name
  // e.g., 'openai.com', 'docs.openai.com', 'api.openai.com'
];

export const TECH_NEWS: string[] = [
  'techcrunch.com',
  'theverge.com',
  'arstechnica.com',
  'wired.com',
  'venturebeat.com',
  'axios.com',
  'bloomberg.com',
  'reuters.com',
  'wsj.com',
  'ft.com',
  'theinformation.com',
];

export const COMMUNITY: string[] = [
  'reddit.com',
  'news.ycombinator.com',
  'stackoverflow.com',
  'stackexchange.com',
  'medium.com',
  'dev.to',
  'hashnode.com',
];

export const GITHUB_DOMAINS: string[] = [
  'github.com',
  'gitlab.com',
  'bitbucket.org',
];

/**
 * Calculate age in months from ISO date string
 */
export function calculateAgeMonths(publishedDate?: string): number {
  if (!publishedDate) return 999; // Unknown age = very old

  const now = new Date();
  const published = new Date(publishedDate);
  const diffMs = now.getTime() - published.getTime();
  const diffMonths = Math.floor(diffMs / (30 * 24 * 60 * 60 * 1000));

  return Math.max(0, diffMonths);
}

/**
 * Format age as human-readable string
 */
export function formatSourceAge(ageMonths: number): string {
  if (ageMonths === 0) return 'Published this month';
  if (ageMonths === 1) return '1 month ago';
  if (ageMonths < 12) return `${ageMonths} months ago`;
  if (ageMonths === 12) return '1 year ago';

  const years = Math.floor(ageMonths / 12);
  const months = ageMonths % 12;

  if (months === 0) {
    return years === 1 ? '1 year ago' : `${years} years ago`;
  }

  return `${years} year${years > 1 ? 's' : ''}, ${months} month${months > 1 ? 's' : ''} ago`;
}

/**
 * Classify domain authority type
 */
export function classifyDomain(
  domain: string,
  vendorName: string
): DomainAuthority {
  const lowerDomain = domain.toLowerCase();
  const lowerVendor = vendorName.toLowerCase().replace(/\s+/g, '');

  // Check if official vendor domain
  if (
    lowerDomain.includes(lowerVendor) ||
    lowerDomain.startsWith('docs.') ||
    lowerDomain.startsWith('api.') ||
    lowerDomain.startsWith('developer.')
  ) {
    return 'official';
  }

  // Check specific lists
  if (TECH_NEWS.some(tn => lowerDomain.includes(tn))) return 'tech-news';
  if (COMMUNITY.some(c => lowerDomain.includes(c))) return 'community';
  if (GITHUB_DOMAINS.some(gh => lowerDomain.includes(gh))) return 'github';

  return 'general';
}

/**
 * Determine if content is foundational architecture/design decision
 */
export function isFoundational(result: SearchResult): boolean {
  const titleLower = result.title.toLowerCase();
  const descLower = result.description.toLowerCase();

  // Heuristics for foundational content
  const foundationalKeywords = [
    'architecture',
    'design decision',
    'founding',
    'announcing',
    'introducing',
    'whitepaper',
    'technical overview',
    'system design',
    'core principles',
  ];

  return foundationalKeywords.some(
    keyword =>
      titleLower.includes(keyword) || descLower.includes(keyword)
  );
}

/**
 * Assess source quality with multi-factor scoring
 *
 * Scoring algorithm:
 * - Baseline: 50 points
 * - Domain authority: +30 (official/community), +25 (tech-news), +20 (github)
 * - Recency: +20 (<6 months), +10 (6-12 months), -10 (>12 months foundational)
 * - Source type: +10 (community feedback)
 *
 * Threshold: 60 points to include in report
 */
export function assessSourceQuality(
  result: SearchResult,
  vendorName: string
): SourceQualityScore {
  let score = 50; // baseline

  // Domain authority scoring
  const domainAuthority = classifyDomain(result.domain, vendorName);
  switch (domainAuthority) {
    case 'official':
      score += 30;
      break;
    case 'community':
      score += 30; // Valued highly as user experience evidence
      break;
    case 'tech-news':
      score += 25;
      break;
    case 'github':
      score += 20;
      break;
    case 'general':
      // No bonus
      break;
  }

  // Recency scoring
  const ageMonths = calculateAgeMonths(result.publishedDate);

  if (ageMonths < 6) {
    score += 20; // Strongly preferred
  } else if (ageMonths < 12) {
    score += 10; // Acceptable with age indicator
  } else if (ageMonths >= 12) {
    // >12 months: only if foundational
    if (isFoundational(result)) {
      score -= 10; // Penalty but still considered
      return {
        score,
        includeInReport: score >= 60,
        ageWarning: `Source is ${formatSourceAge(ageMonths)} (foundational content)`,
      };
    } else {
      // Reject non-foundational old content
      return {
        score: 0,
        includeInReport: false,
        ageWarning: `Source is ${formatSourceAge(ageMonths)} and not foundational`,
      };
    }
  }

  // Source type weighting
  if (domainAuthority === 'community') {
    score += 10; // Reddit/HN valued highly
  }

  // Age warning for 6+ months
  const ageWarning = ageMonths >= 6
    ? `Source is ${formatSourceAge(ageMonths)}`
    : undefined;

  return {
    score,
    includeInReport: score >= 60,
    ageWarning,
  };
}

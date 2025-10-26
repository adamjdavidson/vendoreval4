# Data Model: Analytical Report Format

**Feature**: 004-analytical-report-format
**Date**: 2025-10-26
**Purpose**: Define TypeScript interfaces and data structures for the new report format

## Overview

This feature extends existing report data model (`shared/types/report.ts`) to support:
- Cons/Pros/Extended synthesis sections
- Report mode selection (Quick vs Extended)
- Research findings with source quality indicators
- Progress tracking for long-running operations
- User notes integration

## Core Entities

### GeneratedReport (Updated)

**Location**: `shared/types/report.ts`

**Changes**: Add new fields for synthesis sections and metadata

```typescript
export interface GeneratedReport {
  // ==========================================
  // EXISTING FIELDS (unchanged)
  // ==========================================
  id: string;                          // Unique report ID
  evaluationId: string;                // Reference to evaluation
  vendorName: string;                  // Vendor being evaluated
  evaluationDate: string;              // ISO date string
  generatedAt: number;                 // Timestamp (milliseconds)
  voiceMode: VoiceMode;                // 'no-bs' | 'corporate'
  isPartial: boolean;                  // True if <20 questions answered

  // ==========================================
  // NEW FIELDS (add these)
  // ==========================================
  completionStatus: string;            // "20/20 questions answered (100%)"
  reportMode: 'quick' | 'extended';    // Quick=no research, Extended=with research

  // Synthesized analysis sections
  headline: string;                    // 1-2 sentence summary
  cons: string;                        // Markdown: negatives + why concerning
  pros: string;                        // Markdown: positives + why they matter
  extended: string;                    // Markdown: balanced analysis, no recommendation

  // ==========================================
  // EXISTING FIELDS (repurposed)
  // ==========================================
  categoryAnalyses: CategoryAnalysis[];  // Now "Supporting Detail" not primary
  researchFindings: ResearchFinding[];   // Now includes Brave + Exa results
  metadata: ReportMetadata;
}
```

**Validation Rules**:
- `headline`: 50-200 characters
- `cons`, `pros`, `extended`: Markdown format, 200-2000 characters each
- `completionStatus`: Format "N/M questions answered (P%)"
- `reportMode`: Must match whether researchFindings is empty

**Example**:
```typescript
const report: GeneratedReport = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  evaluationId: 'eval-123',
  vendorName: 'Glean',
  evaluationDate: '2025-10-26',
  generatedAt: Date.now(),
  voiceMode: 'no-bs',
  isPartial: false,
  completionStatus: '20/20 questions answered (100%)',
  reportMode: 'extended',
  headline: 'Glean shows strong transparency and integration but raises portability concerns.',
  cons: '**Data Lock-in Risk**: Limited export options...',
  pros: '**Transparent Operations**: Full visibility...',
  extended: 'The decision hinges on your exit strategy...',
  categoryAnalyses: [/* existing structure */],
  researchFindings: [/* updated structure */],
  metadata: {/* existing */}
};
```

---

### ResearchFinding (Updated)

**Location**: `shared/types/report.ts`

**Changes**: Add source quality indicators and recency tracking

```typescript
export interface ResearchFinding {
  // ==========================================
  // EXISTING FIELDS
  // ==========================================
  category: string;                    // 'See' | 'Change' | 'Use' | 'Adapt' | 'Leave' | 'Learn'
  finding: string;                     // Research content
  source: string;                      // Source name
  confidence: 'high' | 'medium' | 'low'; // Confidence level

  // ==========================================
  // NEW FIELDS
  // ==========================================
  sourceType: 'brave' | 'exa';         // Which API provided this
  sourceAge: string;                   // Human-readable: "2 months ago", "8 months ago"
  ageMonths: number;                   // For filtering: 2, 8, 14, etc.
  isFoundational: boolean;             // True if >12 months but foundational
  url: string;                         // Full URL
  title: string;                       // Article/page title
  publishedDate?: string;              // ISO date if available
  domainAuthority: 'official' | 'tech-news' | 'community' | 'github' | 'general';
}
```

**Domain Authority Types**:
- `official`: vendor.com, docs.vendor.com, api.vendor.com
- `tech-news`: TechCrunch, The Verge, Ars Technica, Wired
- `community`: Reddit, Hacker News, Stack Overflow (valued highly)
- `github`: GitHub repositories
- `general`: Other domains that passed quality threshold

**Example**:
```typescript
const finding: ResearchFinding = {
  category: 'See',
  finding: 'Glean provides full prompt visibility in their enterprise tier...',
  source: 'Reddit',
  confidence: 'high',
  sourceType: 'brave',
  sourceAge: '2 months ago',
  ageMonths: 2,
  isFoundational: false,
  url: 'https://reddit.com/r/artificial/comments/...',
  title: 'Glean transparency discussion',
  publishedDate: '2025-08-26',
  domainAuthority: 'community'
};
```

---

### ReportGenerationRequest (Updated)

**Location**: `shared/types/report.ts`

**Changes**: Add report mode, notes, and research flag

```typescript
export interface ReportGenerationRequest {
  // ==========================================
  // EXISTING FIELDS
  // ==========================================
  evaluationId: string;
  vendorName: string;
  answers: Record<string, 'yes' | 'limited' | 'no' | 'not-enough-info'>;
  questions: Question[];
  categories: Category[];
  voiceMode: VoiceMode;

  // ==========================================
  // NEW FIELDS
  // ==========================================
  reportMode: 'quick' | 'extended';    // User selection
  notes: Record<string, string>;       // question.key → note text
  includeResearch: boolean;            // Derived: reportMode === 'extended'
}
```

**Validation**:
- `reportMode`: Required
- `notes`: Optional, max 5000 chars per note
- `includeResearch`: Must equal (reportMode === 'extended')

---

### ReportProgressUpdate (New)

**Location**: `shared/types/report.ts`

**Purpose**: Track progress during Extended Report generation

```typescript
export interface ReportProgressUpdate {
  phase: 'research' | 'synthesis' | 'complete';
  currentCategory?: string;             // "See", "Change", etc.
  currentAPI?: 'brave' | 'exa';         // Which API is querying
  progress: number;                     // 0-100
  estimatedTimeRemaining: number;       // Seconds
  canCancel: boolean;                   // Always true until complete
  message: string;                      // "Researching See category via Brave..."
}
```

**Progress Calculation**:
```typescript
// Research phase: 0-60%
// 6 categories × 2 APIs = 12 steps
// Each step = 5% progress
progress = (completedSteps / 12) * 60;

// Synthesis phase: 60-100%
progress = 60 + (synthesisProgress * 40);
```

**Example**:
```typescript
const update: ReportProgressUpdate = {
  phase: 'research',
  currentCategory: 'See',
  currentAPI: 'brave',
  progress: 5,
  estimatedTimeRemaining: 270,  // ~4.5 minutes
  canCancel: true,
  message: 'Researching See category via Brave Search...'
};
```

---

## Data Relationships

```
Evaluation (existing)
    ↓ 1:N
EvaluationAnswer (existing)
    ↓ includes notes field
GeneratedReport (updated)
    ├─ reportMode: 'quick' | 'extended'
    ├─ headline, cons, pros, extended (new)
    ├─ categoryAnalyses[] (existing, now supporting detail)
    └─ researchFindings[] (updated with quality indicators)
```

## State Transitions

### Report Generation States

```
IDLE
  ↓ user clicks "Generate Report"
SELECTING_MODE (Quick vs Extended)
  ↓ user selects mode
GENERATING
  ├─ if Quick: SYNTHESIZING (60-100%)
  └─ if Extended: RESEARCHING (0-60%) → SYNTHESIZING (60-100%)
    ↓
COMPLETE
  ↓ display report
VIEWING
```

### Research Finding States

```
QUERYING → RECEIVED → SCORED → FILTERED → INCLUDED_IN_REPORT
                          ↓
                       REJECTED (score < threshold or age > 12 months non-foundational)
```

## Storage Considerations

**LocalStorage** (existing pattern, no changes):
- Key: `vendoreval-report-${reportId}`
- Value: JSON-serialized GeneratedReport
- Size estimate: Quick ~50KB, Extended ~150KB (with research)
- Quota management: Warn at 80%, cleanup >90 days old

**Cache Strategy** (new for research):
- Key: `vendoreval-research-${vendorName}-${category}`
- Value: ResearchFinding[]
- TTL: 7 days
- Purpose: Avoid re-querying same vendor/category

## Migration

**No migration needed** - New fields added, existing fields unchanged. Old reports remain valid.

**Backward Compatibility**:
```typescript
// Old reports without new fields
if (!report.reportMode) {
  report.reportMode = 'quick';  // Default
  report.headline = report.categoryAnalyses[0]?.analysis.substring(0, 150) || '';
  report.cons = '(Generated before analytical format)';
  report.pros = '(Generated before analytical format)';
  report.extended = '(Generated before analytical format)';
}
```

## Testing Data

**Mock Extended Report**:
```typescript
export const MOCK_EXTENDED_REPORT: GeneratedReport = {
  id: 'mock-001',
  evaluationId: 'eval-test',
  vendorName: 'Glean',
  evaluationDate: '2025-10-26',
  generatedAt: Date.now(),
  voiceMode: 'no-bs',
  isPartial: false,
  completionStatus: '20/20 questions answered (100%)',
  reportMode: 'extended',
  headline: 'Glean excels at transparency and integration but creates portability risks.',
  cons: '**Lock-in Risk**: Limited data export options mean switching costs are high...',
  pros: '**Transparent Operations**: Full prompt visibility and model disclosure...',
  extended: 'The choice depends on your exit strategy tolerance...',
  categoryAnalyses: [/* 6 categories */],
  researchFindings: [/* 12 findings from Brave + Exa */],
  metadata: { version: '2.0', generatedBy: 'analytical-format' }
};
```

## Next Steps

1. ✅ Data model documented
2. ⏳ Update `shared/types/report.ts` with new interfaces
3. ⏳ Create migration helper for backward compatibility
4. ⏳ Add TypeScript validation utilities
5. ⏳ Generate contracts/ for API specifications
6. ⏳ Create quickstart.md for testing

**Ready for contracts and quickstart documentation.**

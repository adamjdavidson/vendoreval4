# Quickstart: AI-Powered Report Generation

**Feature**: 003-ai-report-generation
**Created**: 2025-10-26
**For**: Developers implementing report generation feature

## Overview

This guide helps you get started with the AI-powered vendor evaluation report generation system. Follow these steps to understand the architecture, set up your environment, and begin development.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     React Client                            │
│  ┌──────────────────┐      ┌──────────────────┐            │
│  │ ReportGenerator  │─────►│  reportService   │            │
│  │   Component      │      │  (orchestration) │            │
│  └──────────────────┘      └─────────┬────────┘            │
│                                       │                      │
│                         ┌─────────────┴─────────────┐       │
│                         ▼                           ▼       │
│              ┌────────────────────┐     ┌────────────────┐  │
│              │ researchService    │     │ pdfExportSvc   │  │
│              │ (Brave Search API) │     │    (jsPDF)     │  │
│              └─────────┬──────────┘     └────────────────┘  │
│                        │                                     │
└────────────────────────┼─────────────────────────────────────┘
                         │
                         ▼
            ┌────────────────────────┐
            │ LocalStorage Cache     │
            │  (7-day TTL)           │
            └────────────────────────┘
                         │
                         ▼
            ┌────────────────────────────────┐
            │  Supabase Edge Function        │
            │  generate-report-content       │
            │  (Claude API integration)      │
            └────────────────────────────────┘
```

## Prerequisites

1. **Existing Setup**:
   - React 19 evaluation tool (`apps/evaluation-tool`)
   - Supabase project configured
   - LocalStorage for evaluation data
   - jsPDF for PDF export

2. **API Keys Required**:
   - Anthropic Claude API key (for report generation)
   - Brave Search API key (for external research)

3. **Development Tools**:
   - Node.js 20+
   - TypeScript 5+
   - Vitest (testing)
   - Playwright (E2E testing)

## Quick Setup (5 minutes)

### Step 1: Install Dependencies

No new client dependencies required! All needed libraries are already in `package.json`:
- `@supabase/supabase-js` - Already installed
- `jspdf` - Already installed
- `react`, `react-dom` - Already installed

### Step 2: Configure Environment Variables

**Supabase Edge Function Environment**:

```bash
# Navigate to Supabase dashboard
# Settings → Edge Functions → Environment Variables

# Add these secrets:
ANTHROPIC_API_KEY=sk-ant-xxxxx
BRAVE_API_KEY=BSAxxxxx
```

**Local Development** (`.env.local`):

```bash
# Already configured - no changes needed
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Step 3: Create Type Definitions

Create `shared/types/report.ts`:

```typescript
export interface GeneratedReport {
  id: string;
  evaluationId: string;
  vendorName: string;
  generatedAt: number;
  voiceMode: 'no-bs' | 'corporate';
  isPartial: boolean;
  completedCategories: CategoryKey[];
  headline: string;
  categoryAnalyses: CategoryAnalysis[];
  researchFindings: ResearchFinding[];
  metadata: ReportMetadata;
}

export interface CategoryAnalysis {
  categoryKey: CategoryKey;
  categoryName: string;
  grade: Grade;
  yesCount: number;
  noCount: number;
  unknownCount: number;
  totalQuestions: number;
  userAnswerSummary: string;
  analysisText: string;
  keyInsights: string[];
}

export interface ResearchFinding {
  categoryKey: CategoryKey;
  topic: string;
  finding: string;
  sources: Source[];
  confidence: 'high' | 'medium' | 'low';
  researchedAt: number;
  cacheExpiresAt: number;
}

export interface Source {
  url: string;
  title: string;
  snippet: string;
  publishedDate?: string;
}

export type CategoryKey = 'see' | 'change' | 'use' | 'adapt' | 'leave' | 'learn';
export type Grade = 'A' | 'B' | 'C' | 'D' | 'F';

// ... (See data-model.md for complete definitions)
```

### Step 4: Deploy Supabase Edge Function

Create `supabase/functions/generate-report-content/index.ts`:

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import Anthropic from 'https://esm.sh/@anthropic-ai/sdk@0.9.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { vendorName, categoryAnalyses, researchFindings, voiceMode } = await req.json();

    const anthropic = new Anthropic({
      apiKey: Deno.env.get('ANTHROPIC_API_KEY'),
    });

    // Construct prompt (see prompts/ directory for templates)
    const prompt = buildReportPrompt(vendorName, categoryAnalyses, researchFindings, voiceMode);

    const message = await anthropic.messages.create({
      model: 'claude-3-7-sonnet-20250219',
      max_tokens: 4000,
      system: getSystemPrompt(voiceMode),
      messages: [{ role: 'user', content: prompt }],
    });

    const content = message.content[0].text;
    const parsedReport = JSON.parse(content);

    return new Response(
      JSON.stringify({
        headline: parsedReport.headline,
        categoryAnalyses: parsedReport.categoryAnalyses,
        tokensUsed: message.usage.input_tokens + message.usage.output_tokens,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
```

**Deploy**:
```bash
cd supabase
supabase functions deploy generate-report-content
```

## Development Workflow

### Phase 1: Build Report Service

**File**: `apps/evaluation-tool/src/services/reportService.ts`

```typescript
import { supabase } from '@/lib/supabase';
import { calculateAllGrades } from '@/utils/grading';
import { researchService } from './researchService';
import type { GeneratedReport, ReportGenerationRequest } from '@shared/types/report';

class ReportService {
  async generateReport(request: ReportGenerationRequest): Promise<GeneratedReport> {
    // 1. Calculate grades
    const categoryGrades = calculateAllGrades(
      request.categories,
      request.questions,
      request.answers
    );

    // 2. Perform research (if enabled)
    let researchFindings = [];
    if (request.includeResearch) {
      researchFindings = await researchService.researchVendor(
        request.vendorName,
        categoryGrades.map(g => g.category.key)
      );
    }

    // 3. Call Edge Function for AI generation
    const { data, error } = await supabase.functions.invoke('generate-report-content', {
      body: {
        vendorName: request.vendorName,
        categoryAnalyses: categoryGrades,
        researchFindings,
        voiceMode: request.voiceMode,
      },
    });

    if (error) throw new Error(`Report generation failed: ${error.message}`);

    // 4. Construct final report
    const report: GeneratedReport = {
      id: crypto.randomUUID(),
      evaluationId: request.evaluationId,
      vendorName: request.vendorName,
      generatedAt: Date.now(),
      voiceMode: request.voiceMode,
      isPartial: categoryGrades.some(g => g.grade === null),
      completedCategories: categoryGrades.filter(g => g.grade !== null).map(g => g.category.key),
      headline: data.headline,
      categoryAnalyses: mergeCategoryData(categoryGrades, data.categoryAnalyses),
      researchFindings,
      metadata: {
        generationDurationMs: Date.now() - startTime,
        claudeTokensUsed: data.tokensUsed,
        researchQueriesPerformed: researchFindings.length,
        researchCacheHits: 0, // TODO: Track cache hits
        errors: [],
        warnings: [],
      },
    };

    // 5. Save to LocalStorage
    localStorage.setItem(`vendoreval:reports:${report.id}`, JSON.stringify(report));

    return report;
  }
}

export const reportService = new ReportService();
```

### Phase 2: Build Research Service

**File**: `apps/evaluation-tool/src/services/researchService.ts`

```typescript
class ResearchService {
  async researchVendor(vendorName: string, categories: CategoryKey[]): Promise<ResearchFinding[]> {
    const findings: ResearchFinding[] = [];

    for (const categoryKey of categories) {
      // Check cache first
      const cached = this.loadFromCache(vendorName, categoryKey);
      if (cached && !this.isExpired(cached)) {
        findings.push(cached);
        continue;
      }

      // Perform search
      const searchTerms = this.getSearchTermsForCategory(categoryKey);
      const finding = await this.searchCategory(vendorName, categoryKey, searchTerms);

      if (finding) {
        findings.push(finding);
        this.saveToCache(vendorName, categoryKey, finding);
      }
    }

    return findings;
  }

  private async searchCategory(
    vendorName: string,
    categoryKey: CategoryKey,
    searchTerms: string[]
  ): Promise<ResearchFinding | null> {
    // Call Brave Search API (via Supabase Edge Function)
    // Filter and rank results
    // Extract sources
    // Generate finding summary
    // Return ResearchFinding object
  }
}

export const researchService = new ResearchService();
```

### Phase 3: Build UI Components

**Component**: `apps/evaluation-tool/src/components/report/ReportGenerator.tsx`

```typescript
import { useState } from 'react';
import { reportService } from '@/services/reportService';

export function ReportGenerator({ evaluation }) {
  const [generating, setGenerating] = useState(false);
  const [report, setReport] = useState<GeneratedReport | null>(null);
  const [voiceMode, setVoiceMode] = useState<'no-bs' | 'corporate'>('no-bs');

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const generatedReport = await reportService.generateReport({
        vendorName: evaluation.vendorName,
        answers: evaluation.answers,
        questions: frameworkQuestions,
        categories: frameworkCategories,
        voiceMode,
        includeResearch: true,
      });
      setReport(generatedReport);
    } catch (error) {
      console.error('Report generation failed:', error);
      alert('Unable to generate report. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div>
      <h2>Generate Report</h2>

      <div>
        <label>
          Voice Mode:
          <select value={voiceMode} onChange={(e) => setVoiceMode(e.target.value as 'no-bs' | 'corporate')}>
            <option value="no-bs">No BS</option>
            <option value="corporate">Corporate</option>
          </select>
        </label>
      </div>

      <button onClick={handleGenerate} disabled={generating}>
        {generating ? 'Generating Report...' : 'Generate Report'}
      </button>

      {report && <ReportPreview report={report} />}
    </div>
  );
}
```

## Testing

### Unit Tests

```bash
# Test report service
npm test -- reportService.test.ts

# Test research service
npm test -- researchService.test.ts

# Test grading integration
npm test -- reportGenerator.test.ts
```

### Integration Tests

```bash
# Test end-to-end report generation
npm test -- report-generation.test.ts
```

### E2E Tests

```bash
# Test full user flow with Playwright
npm run test:e2e -- generate-report.spec.ts
```

## Common Tasks

### Add New Search Term for Category

Edit `apps/evaluation-tool/src/services/researchService.ts`:

```typescript
private getSearchTermsForCategory(categoryKey: CategoryKey): string[] {
  const terms: Record<CategoryKey, string[]> = {
    see: [
      'transparency',
      'system prompts visible',
      'model disclosure',
      // Add new term here
    ],
    // ...
  };
  return terms[categoryKey];
}
```

### Customize Report Headline Format

Edit `supabase/functions/generate-report-content/prompts/no-bs.ts`:

```typescript
export const NO_BS_SYSTEM_PROMPT = `
You are an expert evaluator providing direct, candid analysis.

Generate a headline that:
- Summarizes the overall assessment
- Highlights red flags (categories with D or F grades)
- States bottom-line recommendation clearly
- Uses conversational, direct language

Format: "{Vendor} has {problem summary}. {Recommendation}."
`;
```

### Clear Research Cache

```typescript
import { researchService } from '@/services/researchService';

// Clear all cache for vendor
researchService.clearCache('OpenAI GPT-4');

// Clear specific category
researchService.clearCache('OpenAI GPT-4', 'see');
```

### Export Report to PDF

```typescript
import { pdfExportService } from '@/services/pdfExportService';

const pdfBlob = await pdfExportService.exportReport(report);

// Download PDF
const url = URL.createObjectURL(pdfBlob);
const a = document.createElement('a');
a.href = url;
a.download = `${report.vendorName}-evaluation-${Date.now()}.pdf`;
a.click();
```

## Debugging

### Enable Debug Logging

```typescript
// Add to reportService.ts
const DEBUG = true;

if (DEBUG) {
  console.log('[ReportService] Generating report for:', vendorName);
  console.log('[ReportService] Category grades:', categoryGrades);
  console.log('[ReportService] Research findings:', researchFindings);
}
```

### Check API Keys

```bash
# Verify Supabase environment variables
supabase functions list
supabase secrets list
```

### Inspect LocalStorage

```javascript
// In browser console
// List all reports
Object.keys(localStorage)
  .filter(key => key.startsWith('vendoreval:reports:'))
  .forEach(key => console.log(key, JSON.parse(localStorage.getItem(key))));

// Check research cache
Object.keys(localStorage)
  .filter(key => key.startsWith('vendoreval:research:'))
  .forEach(key => console.log(key, JSON.parse(localStorage.getItem(key))));
```

## Performance Optimization

### Lazy Load Report Generation

```typescript
// In ReportGenerator component
const ReportPreview = lazy(() => import('./ReportPreview'));
```

### Cache AI Prompts

Use Claude's prompt caching feature (already implemented in Edge Function):

```typescript
// Framework principles cached (reused across reports)
const cachedPromptPrefix = {
  type: 'cache_control',
  cache: 'ephemeral',
};
```

### Parallel Research Queries

```typescript
// In researchService.ts
const findings = await Promise.all(
  categories.map(category => this.searchCategory(vendorName, category, searchTerms))
);
```

## Troubleshooting

### "Report generation timed out"

**Cause**: Claude API taking > 30 seconds

**Solution**: Reduce prompt length or split into multiple requests

### "Research unavailable for category"

**Cause**: Brave API rate limit or no relevant results

**Solution**: Cache research longer (14 days) or use Ref MCP fallback

### "Storage quota exceeded"

**Cause**: Too many reports in LocalStorage

**Solution**: Implement automatic cleanup (delete reports > 90 days old)

### "Invalid API key"

**Cause**: Environment variable not set in Supabase

**Solution**: Check `supabase secrets list` and re-set if needed

## Next Steps

1. **Implement Report Service** - Start with `reportService.ts`
2. **Implement Research Service** - Build `researchService.ts`
3. **Create UI Components** - Build `ReportGenerator.tsx` and `ReportPreview.tsx`
4. **Write Tests** - Unit, integration, and E2E tests
5. **Deploy Edge Function** - `supabase functions deploy generate-report-content`
6. **Test End-to-End** - Generate reports for real vendors

## Resources

- [spec.md](./spec.md) - Feature specification
- [plan.md](./plan.md) - Implementation plan
- [data-model.md](./data-model.md) - Data structures
- [contracts/report-service.md](./contracts/report-service.md) - Report service contract
- [contracts/research-service.md](./contracts/research-service.md) - Research service contract
- [research.md](./research.md) - Technology decisions

## Getting Help

**Questions**: Check the spec and contracts first
**Bugs**: File an issue with reproduction steps
**Ideas**: Propose in spec updates with rationale

---

**Ready to build?** Start with Phase 1 (Report Service) and work through the phases systematically. All design artifacts are complete - you have everything you need to implement!

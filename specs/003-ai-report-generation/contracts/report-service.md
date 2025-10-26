# Contract: Report Generation Service

**Feature**: 003-ai-report-generation
**Created**: 2025-10-26
**File**: `apps/evaluation-tool/src/services/reportService.ts`

## Purpose

Orchestrate AI-powered report generation from user evaluation answers, combining Claude API analysis with optional external research.

## Interface

```typescript
interface ReportService {
  /**
   * Generate a complete evaluation report
   * @param request - Report generation parameters
   * @returns Promise resolving to generated report
   * @throws ReportGenerationError if generation fails
   */
  generateReport(request: ReportGenerationRequest): Promise<GeneratedReport>;

  /**
   * Retrieve a previously generated report by ID
   * @param id - Report UUID
   * @returns Report object or null if not found
   */
  getReportById(id: string): GeneratedReport | null;

  /**
   * Delete a report from storage
   * @param id - Report UUID
   * @returns True if deleted, false if not found
   */
  deleteReport(id: string): boolean;

  /**
   * List all generated reports (newest first)
   * @param limit - Maximum number of reports to return (default: 20)
   * @returns Array of reports sorted by generatedAt descending
   */
  listReports(limit?: number): GeneratedReport[];

  /**
   * Get storage usage statistics
   * @returns Storage metrics
   */
  getStorageStats(): StorageStats;
}

interface StorageStats {
  totalReports: number;
  totalSizeBytes: number;
  availableBytes: number;
  percentUsed: number;
}
```

## Behavior Specification

### 1. `generateReport(request)`

**Preconditions**:
- `request.vendorName` is non-empty and max 200 characters
- `request.answers` contains 1-20 valid Answer objects
- `request.questions` contains all 20 framework questions
- `request.categories` contains all 6 framework categories
- `request.voiceMode` is either 'no-bs' or 'corporate'

**Process Flow**:

```typescript
async function generateReport(request: ReportGenerationRequest): Promise<GeneratedReport> {
  // 1. Validate input
  validateRequest(request);

  // 2. Calculate category grades using existing grading logic
  const categoryGrades = calculateAllGrades(
    request.categories,
    request.questions,
    request.answers
  );

  // 3. Perform external research (if enabled and not cached)
  let researchFindings: ResearchFinding[] = [];
  if (request.includeResearch) {
    researchFindings = await researchService.researchVendor(
      request.vendorName,
      categoryGrades.map(g => g.category.key)
    );
  }

  // 4. Call Claude API via Supabase Edge Function
  const aiContent = await callReportGenerationEdgeFunction({
    vendorName: request.vendorName,
    categoryGrades,
    researchFindings,
    voiceMode: request.voiceMode
  });

  // 5. Construct GeneratedReport object
  const report: GeneratedReport = {
    id: crypto.randomUUID(),
    evaluationId: request.evaluationId,
    vendorName: request.vendorName,
    generatedAt: Date.now(),
    voiceMode: request.voiceMode,
    isPartial: categoryGrades.some(g => g.grade === null),
    completedCategories: categoryGrades
      .filter(g => g.grade !== null)
      .map(g => g.category.key),
    headline: aiContent.headline,
    categoryAnalyses: mergeGradesWithAIAnalysis(categoryGrades, aiContent),
    researchFindings,
    metadata: {
      generationDurationMs: Date.now() - startTime,
      claudeTokensUsed: aiContent.tokensUsed,
      researchQueriesPerformed: researchFindings.length,
      researchCacheHits: countCacheHits(researchFindings),
      errors: [],
      warnings: aiContent.warnings
    }
  };

  // 6. Persist to LocalStorage
  saveReportToStorage(report);

  // 7. Update report index
  updateReportIndex(report.id);

  return report;
}
```

**Error Handling**:

| Error Condition | Behavior | User-Facing Message |
|-----------------|----------|---------------------|
| Invalid vendor name | Throw `ValidationError` | "Vendor name is required" |
| Empty answers array | Throw `ValidationError` | "At least one question must be answered" |
| Claude API timeout (>30s) | Throw `APITimeoutError` | "Report generation timed out. Please try again." |
| Claude API error | Throw `APIError` | "Unable to generate report. Please try again later." |
| Research API failure | Continue without research, add warning | "Research unavailable for some categories" |
| LocalStorage quota exceeded | Throw `StorageError` | "Storage full. Delete old reports to continue." |

**Performance Guarantees**:
- Total execution time: < 30 seconds (SC-001)
- UI remains responsive during generation (non-blocking)
- Progress updates emitted via callback (optional parameter)

**Postconditions**:
- Report saved to LocalStorage
- Report ID added to report index
- Research findings cached (if applicable)
- Returns valid GeneratedReport object

---

### 2. `getReportById(id)`

**Preconditions**:
- `id` is a valid UUID string

**Behavior**:
- Retrieve report from LocalStorage key `vendoreval:reports:{id}`
- Deserialize JSON to GeneratedReport object
- Return null if key doesn't exist
- Return null if deserialization fails (corrupted data)

**Performance**:
- < 10ms retrieval time

**Example**:
```typescript
const report = reportService.getReportById('550e8400-e29b-41d4-a716-446655440000');
if (report) {
  console.log(`Report for ${report.vendorName} generated at ${new Date(report.generatedAt)}`);
}
```

---

### 3. `deleteReport(id)`

**Preconditions**:
- `id` is a valid UUID string

**Behavior**:
- Remove report from LocalStorage
- Remove ID from report index
- Return true if deletion succeeded
- Return false if report didn't exist

**Side Effects**:
- Does NOT delete associated research cache (may be used by other reports)
- Does NOT delete original evaluation

**Example**:
```typescript
const deleted = reportService.deleteReport('550e8400-...');
if (deleted) {
  console.log('Report deleted successfully');
}
```

---

### 4. `listReports(limit)`

**Preconditions**:
- `limit` is optional positive integer (default: 20)

**Behavior**:
- Load report index from LocalStorage
- Retrieve full report objects for each ID
- Sort by `generatedAt` descending (newest first)
- Return up to `limit` reports
- Skip reports that fail to load (corrupted data)

**Performance**:
- < 100ms for 20 reports
- Lazy loading: doesn't load reports beyond limit

**Example**:
```typescript
const recentReports = reportService.listReports(10);
recentReports.forEach(report => {
  console.log(`${report.vendorName} - ${report.voiceMode} - ${new Date(report.generatedAt)}`);
});
```

---

### 5. `getStorageStats()`

**Behavior**:
- Calculate total size of all reports in LocalStorage
- Estimate available space (5MB - used)
- Return storage metrics

**Example**:
```typescript
const stats = reportService.getStorageStats();
console.log(`Using ${stats.percentUsed}% of storage (${stats.totalReports} reports)`);

if (stats.percentUsed > 80) {
  console.warn('Storage nearly full - consider deleting old reports');
}
```

---

## Dependencies

### Internal Dependencies

```typescript
import { calculateAllGrades } from '@/utils/grading';
import { researchService } from '@/services/researchService';
import { supabaseClient } from '@/lib/supabase';
import type { Answer, Question, Category } from '@shared/types';
import type { GeneratedReport, ReportGenerationRequest } from '@shared/types/report';
```

### External Services

1. **Supabase Edge Function**: `generate-report-content`
   - Endpoint: `/functions/v1/generate-report-content`
   - Method: POST
   - Timeout: 30 seconds
   - Auth: Authenticated via supabaseClient

2. **Research Service**: `researchService.researchVendor()`
   - Internal service
   - See [research-service.md](./research-service.md)

3. **LocalStorage**:
   - Key prefix: `vendoreval:`
   - Quota: 5MB (typical browser limit)

---

## Error Types

```typescript
class ReportGenerationError extends Error {
  constructor(message: string, public code: string, public details?: any) {
    super(message);
    this.name = 'ReportGenerationError';
  }
}

class ValidationError extends ReportGenerationError {
  constructor(field: string, message: string) {
    super(`Validation failed for ${field}: ${message}`, 'VALIDATION_ERROR');
  }
}

class APITimeoutError extends ReportGenerationError {
  constructor(service: string) {
    super(`${service} timed out after 30 seconds`, 'API_TIMEOUT');
  }
}

class APIError extends ReportGenerationError {
  constructor(service: string, statusCode: number, message: string) {
    super(`${service} error: ${message}`, 'API_ERROR', { statusCode });
  }
}

class StorageError extends ReportGenerationError {
  constructor(message: string) {
    super(message, 'STORAGE_ERROR');
  }
}
```

---

## Configuration

```typescript
interface ReportServiceConfig {
  edgeFunctionUrl: string;            // Supabase function URL
  timeout: number;                    // 30000ms
  maxReportsInIndex: number;          // 100
  storageKeyPrefix: string;           // 'vendoreval'
  enableProgressCallbacks: boolean;   // false (optional feature)
}
```

---

## Testing Requirements

### Unit Tests

1. **Input Validation**:
   - Invalid vendor name (empty, too long)
   - Invalid answers array (empty, wrong format)
   - Invalid voice mode

2. **Report Generation**:
   - Successful generation with research
   - Successful generation without research
   - Partial evaluation handling
   - Error handling (API timeout, API error)

3. **CRUD Operations**:
   - Get report by ID (exists, not exists)
   - Delete report (exists, not exists)
   - List reports (empty, multiple, pagination)

4. **Storage Management**:
   - Storage stats calculation
   - Quota exceeded handling
   - Index management (add, remove, purge old)

### Integration Tests

1. **End-to-End Report Generation**:
   - Complete evaluation → generate report → verify PDF export
   - Partial evaluation → verify disclaimer in report

2. **Cache Integration**:
   - Research cache hit/miss scenarios
   - Cache expiration handling

3. **Error Recovery**:
   - Claude API failure → graceful fallback
   - Research API failure → proceed without research
   - Storage quota exceeded → clear old reports

---

## Performance Benchmarks

| Operation | Target | Typical | Max Acceptable |
|-----------|--------|---------|----------------|
| generateReport() | <25s | 15-20s | 30s |
| getReportById() | <10ms | 5ms | 20ms |
| deleteReport() | <10ms | 3ms | 20ms |
| listReports(20) | <100ms | 50ms | 200ms |
| getStorageStats() | <50ms | 20ms | 100ms |

---

## Security Considerations

### Input Sanitization

**Vendor Name**:
```typescript
function sanitizeVendorName(name: string): string {
  return name
    .trim()
    .replace(/[<>'"]/g, '')  // Remove HTML/JS injection characters
    .slice(0, 200);          // Enforce max length
}
```

**Notes Field** (from answers):
- NOT sent to external APIs (privacy)
- Sanitized before rendering in PDF
- Max length: 5000 characters

### API Key Protection

- Claude API key stored in Supabase environment variables (never in client)
- Brave API key stored in Supabase environment variables (never in client)
- Edge Function validates authentication before calling external APIs

### Data Privacy (Article V Compliance)

✅ User answers stay in browser:
- Only aggregated counts sent to Claude API (yesCount, noCount, unknownCount)
- Full answer text never leaves browser

✅ Only vendor name sent for research:
- No user identifiers
- No evaluation details beyond vendor name

---

## Example Usage

```typescript
import { reportService } from '@/services/reportService';

// Generate report
try {
  const report = await reportService.generateReport({
    vendorName: 'OpenAI GPT-4',
    answers: evaluationAnswers,
    questions: frameworkQuestions,
    categories: frameworkCategories,
    voiceMode: 'no-bs',
    includeResearch: true
  });

  console.log(`Report generated: ${report.headline}`);
  console.log(`Research findings: ${report.researchFindings.length}`);

} catch (error) {
  if (error instanceof ValidationError) {
    showError('Please complete the evaluation before generating a report');
  } else if (error instanceof APITimeoutError) {
    showError('Report generation timed out. Please try again.');
  } else {
    showError('Unable to generate report. Please try again later.');
  }
}

// List reports
const reports = reportService.listReports(10);
console.log(`Found ${reports.length} reports`);

// Check storage
const stats = reportService.getStorageStats();
if (stats.percentUsed > 80) {
  showWarning('Storage nearly full. Consider deleting old reports.');
}
```

---

**Related Contracts**:
- [research-service.md](./research-service.md) - External research integration
- [data-model.md](../data-model.md) - Complete data structures

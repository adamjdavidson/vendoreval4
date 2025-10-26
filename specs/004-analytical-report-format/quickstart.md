# Quickstart: Analytical Report Format Testing

**Feature**: 004-analytical-report-format
**Purpose**: Developer guide for testing the new executive-ready report format
**Audience**: Developers implementing and testing this feature

## Prerequisites

1. **Environment Setup**
   ```bash
   cd apps/evaluation-tool
   npm install
   ```

2. **API Keys** (for Extended Report testing)
   ```bash
   # Supabase secrets (production)
   supabase secrets set BRAVE_API_KEY="your-brave-api-key"
   supabase secrets set EXA_API_KEY="your-exa-api-key"
   supabase secrets set ANTHROPIC_API_KEY="your-claude-api-key"

   # Local testing (.env.local)
   echo "VITE_SUPABASE_URL=http://localhost:54321" >> apps/evaluation-tool/.env.local
   echo "VITE_SUPABASE_ANON_KEY=your-anon-key" >> apps/evaluation-tool/.env.local
   ```

3. **Start Development Servers**
   ```bash
   # Terminal 1: Supabase (Edge Functions)
   supabase start

   # Terminal 2: Frontend
   cd apps/evaluation-tool && npm run dev
   ```

## Testing Quick Report (No Research)

**Scenario**: Generate report from answers only, < 60 seconds

### Steps

1. **Complete an Evaluation**
   - Navigate to http://localhost:5173
   - Click "Start New Evaluation"
   - Enter vendor name: "Glean"
   - Answer all 20 questions (mix of Yes/Limited/No/Don't Know)
   - Add notes to 2-3 questions

2. **Generate Quick Report**
   - Click "Generate Report" button
   - Select "Quick Report (No Research)"
   - Observe progress indicator (should complete in ~10-30s)

3. **Verify Report Structure**
   ```
   ✅ Header: Company name, date, completion status
   ✅ Headline: 1-2 sentence summary
   ✅ Cons: Synthesized negatives with business impact
   ✅ Pros: Synthesized positives with business value
   ✅ Extended: Balanced analysis, mentions user notes
   ✅ Category Analyses: Labeled as "Supporting Detail"
   ✅ No Research Findings section (Quick Report)
   ```

4. **Test Voice Modes**
   - Generate same report in "Corporate" mode
   - Verify tone differences while meaning preserved
   - No BS: "This vendor hides their prompts"
   - Corporate: "Prompt visibility is limited in current offering"

### Expected Behavior

- **Performance**: < 60 seconds total
- **Synthesis**: Cons/Pros reflect answers across all 6 categories
- **User Notes**: Referenced in Extended section
- **No API Calls**: No Brave or Exa queries

### Manual Validation

```typescript
// Check report structure
const report = JSON.parse(localStorage.getItem('vendoreval-report-...'));

assert(report.reportMode === 'quick');
assert(report.headline.length >= 50 && report.headline.length <= 200);
assert(report.cons.length >= 200);
assert(report.pros.length >= 200);
assert(report.extended.includes('trade-off') || report.extended.includes('balance'));
assert(report.researchFindings.length === 0);
```

---

## Testing Extended Report (With Research)

**Scenario**: Generate report with external research, < 5 minutes

### Steps

1. **Complete an Evaluation** (same as Quick Report)

2. **Generate Extended Report**
   - Click "Generate Report" button
   - Select "Extended Report (With Research)"
   - **Observe real-time progress**:
     - "Researching See category via Brave..." (5%)
     - "Researching See category via Exa..." (10%)
     - "Researching Change category via Brave..." (15%)
     - ... (continues through all 6 categories)
     - "Synthesizing findings..." (80%)
     - "Complete!" (100%)
   - Monitor estimated time remaining

3. **Verify Progress UI**
   ```
   ✅ Current phase displayed (Research / Synthesis)
   ✅ Current category shown
   ✅ Progress bar 0-100%
   ✅ Time estimate updates
   ✅ Cancel button available until complete
   ```

4. **Verify Report with Research**
   ```
   ✅ All Quick Report sections present
   ✅ Research Findings section exists
   ✅ At least 3 research findings per category (if vendor is well-known)
   ✅ Each finding has: title, URL, source age, domain authority
   ✅ Recency indicators: "<6 months" in green, "8 months ago" in yellow, ">12 months (foundational)" if applicable
   ✅ Cons/Pros reference research findings with citations
   ✅ Extended section mentions research contradictions if any
   ```

### Expected Behavior

- **Performance**: 2-5 minutes (depends on API speed)
- **API Calls**: 6 Brave + 6 Exa = 12 total queries
- **Research Quality**:
  - Reddit/HN comments included (valued highly)
  - Official docs included
  - Spam filtered out (quality score < 60)
  - Sources >12 months only if foundational
- **Progress Updates**: Real-time, every 5-10 seconds

### Manual Validation

```typescript
const report = JSON.parse(localStorage.getItem('vendoreval-report-...'));

assert(report.reportMode === 'extended');
assert(report.researchFindings.length >= 3);
report.researchFindings.forEach(finding => {
  assert(finding.sourceType === 'brave' || finding.sourceType === 'exa');
  assert(finding.domainAuthority !== undefined);
  assert(finding.ageMonths !== undefined);
  if (finding.ageMonths >= 12) {
    assert(finding.isFoundational === true);
  }
});
```

---

## Testing Error Scenarios

### Test 1: API Timeout

**Setup**: Mock slow API response

```typescript
// In brave-search Edge Function, add artificial delay
await new Promise(resolve => setTimeout(resolve, 30000)); // 30s timeout
```

**Expected Behavior**:
- Progress shows "Retrying..."
- After retry fails, continues with "Research unavailable for this category"
- Report generated with partial research
- Warning in report: "Some research unavailable due to API timeout"

### Test 2: API Rate Limit

**Setup**: Exceed Brave API rate limit

**Expected Behavior**:
- Error message: "Rate limit exceeded, retrying in 60 seconds..."
- After retry, continues or falls back to Exa only
- User sees which API failed in report notes

### Test 3: Cancel During Generation

**Setup**: Click cancel button during research phase

**Expected Behavior**:
- Edge Function receives abort signal
- Progress shows "Cancelling..."
- Falls back to Quick Report generation
- User sees Quick Report instead

---

## Testing Progress Tracking

### Manual Progress Verification

1. Open browser DevTools → Network tab
2. Filter for EventSource connections
3. Generate Extended Report
4. Verify SSE events:
   ```
   data: {"phase":"research","currentCategory":"See","progress":5,...}
   data: {"phase":"research","currentCategory":"See","progress":10,...}
   ...
   data: {"phase":"synthesis","progress":80,...}
   data: {"phase":"complete","progress":100,"report":{...}}
   ```

### Progress UI Testing

```typescript
// Component test
test('ReportProgress shows real-time updates', async () => {
  const mockUpdates = [
    { phase: 'research', currentCategory: 'See', progress: 5 },
    { phase: 'research', currentCategory: 'Change', progress: 15 },
    { phase: 'synthesis', progress: 80 },
    { phase: 'complete', progress: 100 }
  ];

  render(<ReportProgress onCancel={mockCancel} />);

  for (const update of mockUpdates) {
    act(() => {
      fireEvent(progressUpdateEvent, update);
    });

    expect(screen.getByText(new RegExp(update.currentCategory || 'Synthesizing'))).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', update.progress.toString());
  }
});
```

---

## Testing Synthesis Quality

### Manual Review Checklist

For each generated report, verify:

**Cons Section**:
- [ ] Pulls negatives from multiple categories (not just one)
- [ ] Explains **why** each negative is concerning (business impact)
- [ ] Uses framework-aligned classification:
  - Opacity (See) → vendor lock-in, hidden costs
  - Rigidity (Change) → can't adapt to workflows
  - Complexity (Use) → low adoption, training costs
  - Closed system (Adapt) → integration challenges
  - Lock-in (Leave) → exit costs, data loss risk
  - Proprietary knowledge (Learn) → team dependency

**Pros Section**:
- [ ] Pulls positives from multiple categories
- [ ] Explains **why** each positive matters (business value)
- [ ] Uses framework-aligned classification (transparency=positive, etc.)

**Extended Section**:
- [ ] Balances Cons and Pros
- [ ] References user notes where relevant
- [ ] Mentions research contradictions if any
- [ ] Does NOT say "I recommend" or "you should"
- [ ] Acknowledges organizational context ("depends on your...")

**Voice Consistency**:
- [ ] No BS: Direct, candid, names what vendors hide
- [ ] Corporate: Professional, formal, politically safe
- [ ] Meaning preserved across voices

---

## Performance Testing

### Quick Report Benchmark

```bash
# Run 10 times, measure average
for i in {1..10}; do
  time curl -X POST http://localhost:54321/functions/v1/generate-report-content \
    -H "Content-Type: application/json" \
    -d @test/fixtures/quick-report-request.json
done

# Target: <60 seconds average
```

### Extended Report Benchmark

```bash
# Single run (takes 2-5 min)
time curl -X POST http://localhost:54321/functions/v1/generate-report-content \
  -H "Content-Type: application/json" \
  -d @test/fixtures/extended-report-request.json

# Target: <5 minutes
```

### Bundle Size Check

```bash
cd apps/evaluation-tool
npm run build
du -sh dist/assets/*.js | awk '{sum+=$1} END {print sum " KB"}'

# Target: <500KB gzipped total
```

---

## Troubleshooting

### Issue: Extended Report Hangs

**Symptoms**: Progress stuck at specific category

**Debug**:
```bash
# Check Edge Function logs
supabase functions logs generate-report-content

# Check for API errors
tail -f .supabase/logs/edge-runtime.log
```

**Common Causes**:
- API key missing or invalid
- Network timeout
- Rate limit exceeded

### Issue: Progress Not Updating

**Symptoms**: Spinner shows but no progress details

**Debug**:
- Check browser console for SSE connection errors
- Verify CORS headers in Edge Function response
- Test with polling fallback

### Issue: Research Quality Poor

**Symptoms**: Spam or irrelevant results

**Debug**:
- Check quality score threshold (should be ≥60)
- Verify domain authority classification
- Review query patterns for category

---

## Next Steps

After testing:

1. ✅ Verify all scenarios pass
2. ✅ Run unit tests: `npm run test`
3. ✅ Run E2E tests: `npm run test:e2e`
4. ✅ Review synthesis quality with stakeholders
5. ⏳ Generate tasks.md with `/speckit.tasks`
6. ⏳ Begin implementation

**Questions?** Check [plan.md](plan.md) for architecture details or [data-model.md](data-model.md) for TypeScript interfaces.

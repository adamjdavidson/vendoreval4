# VendorEval3 Constitution

**Version**: 1.1.0 | **Ratified**: 2025-10-19 | **Last Amended**: 2025-10-19

## Preamble

This constitution establishes the technical and quality standards for VendorEval3, an AI vendor evaluation framework for Fortune 500 executives. These principles govern all development decisions and supersede ad-hoc preferences.

**Target Users**: Fortune 500+ executives with $500K+ budget authority making high-stakes AI procurement decisions.

**Core Value Proposition**: Enable confident, defensible vendor evaluations through transparent framework and dual voice modes (Direct & Suitable for Work).

---

## Article I: Code Quality Standards

### TypeScript Usage

- All application code MUST use TypeScript with strict mode enabled
- Type `any` is prohibited except in third-party library integrations with missing types
- All exported functions and components MUST have explicit type signatures
- Interfaces preferred over type aliases for object shapes

### Code Organization

- Component-based architecture: One component per file
- Maximum file length: 300 lines (excluding types and tests)
- Functions should be focused and testable - extract complex logic into utilities
- No circular dependencies between modules

### Linting and Formatting

- ESLint with recommended React and TypeScript rules
- Prettier for automatic code formatting
- All code MUST pass linting before commit
- Configuration files (.eslintrc, .prettierrc) version-controlled

### Examples

**Good**:

```typescript
interface EvaluationProps {
  vendorName: string;
  onComplete: (evaluation: Evaluation) => void;
}

export function EvaluationTool({ vendorName, onComplete }: EvaluationProps) {
  // Implementation
}
```

**Bad**:

```typescript
export function EvaluationTool(props: any) {  // ❌ any type
  // Implementation
}
```

---

## Article II: Testing Standards

### Test Requirements

- All new features MUST include tests before implementation (Test-Driven Development encouraged)
- Minimum 70% code coverage for business logic (scoring, evaluation state, report generation)
- UI components require at least happy-path rendering tests
- Critical user flows (complete evaluation, generate report) MUST have end-to-end tests

### Test Types

1. **Unit Tests**: Individual functions and utilities (scoring logic, data transformations)
2. **Component Tests**: React components in isolation (React Testing Library)
3. **Integration Tests**: Multi-component flows (answer question → update category → recalculate score)
4. **Manual Testing**: Browser compatibility and mobile responsiveness

### Testing Tools

- Vitest for unit and component tests
- React Testing Library for component testing
- Manual testing on Chrome, Firefox, Safari (desktop and mobile)

### Test Organization

- Tests colocated with source files: `Component.tsx` → `Component.test.tsx`
- Test names describe behavior: `test('calculates red status when critical questions are "no"')`
- Setup/teardown in beforeEach/afterEach to avoid test interdependence

---

## Article III: User Experience Standards

### Design Principles

- **Professional Polish**: UI must be appropriate for C-level executive presentations
- **Progressive Disclosure**: Complexity revealed gradually (landing → evaluation → detailed help)
- **Mobile-First**: Executives read on phones - all features work on 320px screens
- **Voice Mode Consistency**: Both Direct and Suitable for Work modes preserve meaning while adapting tone

### Accessibility (WCAG 2.1 AA Compliance)

- All text meets 4.5:1 contrast ratio (3:1 for large text)
- Keyboard navigation for all interactions (Tab, Enter, Escape)
- Screen reader compatible (semantic HTML, ARIA labels where needed)
- Visible focus indicators on all interactive elements
- Respects `prefers-reduced-motion` for animations

### Loading and Error States

- Loading indicators for operations > 200ms
- Error messages must be user-friendly with actionable next steps
- No technical jargon in user-facing errors ("Failed to save" not "LocalStorage quota exceeded")
- Confirmation dialogs for destructive actions (delete evaluation, clear all data)

### Error Message Examples

**Good Error Message**:
> "Unable to save your evaluation. Your browser storage may be full. Try exporting and deleting old evaluations."

**Bad Error Message**:
> "QuotaExceededError: LocalStorage limit reached"

---

## Article IV: Performance Requirements

### Load Time Targets

- Initial page load: < 3 seconds on 3G connection
- Route transitions: < 100ms
- Documentation search: < 500ms
- PDF generation: < 5 seconds for full evaluation

### Bundle Size Limits

- Total JavaScript: < 500KB gzipped
- Individual route chunks: < 150KB gzipped
- CSS: < 50KB gzipped
- Images/assets: < 200KB total

### Optimization Strategies

- Code splitting by route (React.lazy)
- Lazy load PDF library only when generating reports
- Debounce LocalStorage writes (save after 500ms idle)
- Memoize expensive calculations (category scoring)
- Tree-shake unused Tailwind classes

---

## Article V: Security and Privacy Standards

### Data Handling

- NO sensitive data leaves the browser (all storage is LocalStorage)
- NO analytics or tracking without explicit user consent
- NO embedded third-party scripts (no Google Analytics, no external fonts)
- Export formats (PDF/Markdown) contain NO tracking metadata or hidden content

### Input Validation

- Sanitize all user input before rendering (React escapes by default, but verify for dangerouslySetInnerHTML)
- Validate evaluation data structure before saving to LocalStorage
- Maximum note length: 5000 characters per question

### Dependency Security

- Run `npm audit` before adding new dependencies
- No dependencies with critical or high severity vulnerabilities
- Keep dependencies updated (security patches applied within 7 days)

### Input Sanitization Examples

**Sanitize User Input**:

```typescript
// ✅ React auto-escapes
<p>{userNote}</p>

// ❌ Dangerous - only if absolutely necessary with sanitization
<div dangerouslySetInnerHTML={{ __html: sanitize(userNote) }} />
```

---

## Article VI: Dependency Management

### Dependency Selection Criteria

- **Active Maintenance**: Updated within last 6 months
- **Community Trust**: > 10k weekly downloads OR recommended by React/Vite docs
- **License Compatibility**: MIT, Apache 2.0, or BSD only
- **Bundle Impact**: Consider bundle size - reject heavy libraries for simple needs
- **Security**: No known vulnerabilities, good security track record

### Core Dependencies (Approved)

- React 19, React-DOM, React-Router (framework)
- Tailwind CSS (styling)
- jsPDF (PDF generation)
- Lucide React (icons)
- Docusaurus 3 (documentation site)

### Adding New Dependencies

1. Evaluate against criteria above
2. Document rationale in pull request
3. Verify bundle size impact (`npm run build` and compare)
4. Check security (`npm audit`)

---

## Article VII: Error Handling and Logging

### Error Handling Patterns

All errors must be caught and handled gracefully:

```typescript
try {
  await saveEvaluation(data);
} catch (error) {
  console.error('Save failed:', error);
  showToast('Unable to save evaluation. Please try again.');
}
```

### Logging Standards

- **Development**: Console logs allowed for debugging
- **Production**: Remove all `console.log` statements (ESLint rule enforces this)
- **Error Logging**: `console.error` for unexpected failures (helps users report issues)
- **Never Log**: User evaluation data, notes, vendor names (privacy)

### Error Boundaries

- Wrap all routes in React ErrorBoundary
- Fallback UI shows friendly message with option to reload or return to home
- Preserve user data in LocalStorage even if app crashes

---

## Article VIII: Content Standards

### Dual Voice Mode Requirements

- **ALL content** (questions, explanations, documentation, reports) available in both modes
- **Direct Mode**: Candid, cuts through BS, names what vendors hide
- **Suitable for Work**: Professional, politically safe, formal tone
- **Translation Rule**: Preserve meaning and key insights when switching modes

### Content Quality

- All 20 questions precisely match documented framework (SEE/CHANGE/USE/ADAPT/LEAVE/LEARN)
- Explanations must be actionable (not just theory)
- Pre-analyzed vendors (Glean) must have verifiable evidence for each answer
- No marketing fluff or unsubstantiated vendor claims
- Jargon explained when first used

### Content Review Process

- Content changes require review by framework creator
- Voice mode translations reviewed for meaning preservation
- Example evaluations (Glean) verified against public information

---

## Article IX: Documentation Requirements

### Required Documentation

- **README.md**: How to install, run, test, and deploy
- **Component Documentation**: JSDoc comments for complex components (optional for simple UI components)
- **Inline Comments**: Required for non-obvious logic (complex scoring algorithms, LocalStorage schema)
- **Architecture Decisions**: Document major technical decisions in code comments or spec.md

### Documentation Standards

- Keep README updated when adding features
- Explain WHY in comments, not WHAT (code shows what)
- Document LocalStorage schema and data structure
- Link to relevant specs/plans in complex files

### Comment Examples

**Good Comment**:

```typescript
// Calculate red status if ANY critical question is "no"
// Critical questions reveal deal-breakers (hidden prompts, no data export)
const hasRedFlag = questions
  .filter(q => q.isCritical)
  .some(q => answers[q.id] === 'no');
```

**Bad Comment**:

```typescript
// Loop through questions
questions.forEach(q => { ... });
```

---

## Article X: Deployment Architecture

### Infrastructure Decisions

**DEPLOYMENT ARCHITECTURE: TWO SEPARATE VERCEL PROJECTS**

This is a **CONSTITUTIONAL PRINCIPLE**, not a preference. All deployment work MUST follow this architecture.

#### The Architecture

```
GitHub Repository: adamjdavidson/vendoreval4
    │
    ├─► Vercel Project 1: Documentation Site
    │   └─► Root Directory: apps/docs
    │       └─► Framework: Docusaurus
    │           └─► Deploys to: vendor.feedforward.ai
    │
    └─► Vercel Project 2: Evaluation Tool
        └─► Root Directory: apps/evaluation-tool
            └─► Framework: Vite + React
                └─► Deploys to: tool.vendor.feedforward.ai
```

#### Critical Requirements

1. **Same Repository, Two Projects**: Both Vercel projects connect to the SAME GitHub repository
2. **Different Root Directories**: Each project MUST have different Root Directory configured in Vercel Dashboard
   - Docs: `apps/docs`
   - Tool: `apps/evaluation-tool`
3. **Independent Builds**: Each project builds independently with its own framework detection
4. **No Monorepo Build Tools**: NO Turborepo, NO Nx, NO root-level build orchestration
5. **No Root Configuration**: NO root `vercel.json`, NO root `package.json` with build scripts

#### Why This Architecture

- **Simplicity**: Each app builds using standard framework tooling
- **Independence**: Apps can deploy separately without affecting each other
- **Official Support**: Vercel's documented approach for monorepos without build tools
- **Proven Pattern**: Used by thousands of monorepos on Vercel

#### What NOT To Do

❌ **NEVER** suggest a single Vercel project building both apps
❌ **NEVER** use root-level `vercel.json` with rewrites/routing
❌ **NEVER** create build orchestration scripts at repository root
❌ **NEVER** try to "optimize" by combining deployments

#### How To Verify

- Check `DEPLOYMENT_GUIDE.md` for current deployment instructions
- Check Vercel Dashboard: Each project should have Root Directory set
- Check repository root: Should have NO `vercel.json` or `package.json`

#### AI Assistant Protocol

**When asked about deployment:**

1. **FIRST**: Read `DEPLOYMENT_STATUS.md` and `DEPLOYMENT_GUIDE.md`
2. **VERIFY**: Current architecture matches this constitutional principle
3. **IF CONFUSED**: Ask user to clarify rather than assuming
4. **NEVER**: Pivot architecture without explicit user approval and constitutional amendment

**If suggesting changes:**

1. State: "This contradicts Article X of the constitution which defines two-project architecture"
2. Ask: "Should we amend the constitution to change the deployment architecture?"
3. Document: Why the change is needed and what trade-offs are involved

### Amendment Process for Deployment Architecture

Changing deployment architecture requires:

1. **Constitutional Amendment**: Update Article X with new architecture
2. **Version Bump**: Increment to next major version (e.g., 1.1.0 → 2.0.0)
3. **Documentation Update**: Update all references in DEPLOYMENT_STATUS.md, DEPLOYMENT_GUIDE.md, specs/
4. **Beads Tasks**: Create implementation tasks for migration
5. **Testing**: Verify new architecture works before deprecating old

---

## Article XI: Quality Gates

### Pre-Implementation Gates

- Constitution exists and is current
- Specification complete and approved
- Technical plan validated
- Task breakdown created

### Pre-Merge Gates

- All tests pass (unit, component, integration)
- ESLint and TypeScript checks pass
- Code reviewed by at least one other person (if team size > 1)
- Manual testing complete on target browsers

### Pre-Deployment Gates

- Full evaluation flow tested end-to-end
- PDF and Markdown export verified
- Mobile responsiveness tested on real devices
- Performance metrics meet targets (Lighthouse audit)

---

## Governance

### Amendment Process

1. Identify need for constitutional change
2. Document rationale and impact
3. Update version number (1.1.0 → 1.2.0 for additions, 1.1.0 → 2.0.0 for breaking changes)
4. Update amendment history below

### Exceptions

- Exceptions to constitutional principles require explicit documentation
- Document WHY the exception is necessary and what trade-off is being made
- Time-bound exceptions (e.g., "temporarily skip E2E tests for MVP, add in v1.1")

### Enforcement

- Constitution supersedes all ad-hoc preferences
- Technical decisions that violate constitution must be justified and documented
- Code reviews verify constitutional compliance

---

## Amendment History

### Version 1.1.0 - 2025-10-19

**Added**:

- Article II: Testing Standards (was missing automated testing guidance)
- Article V: Security and Privacy Standards (expanded beyond browser-only)
- Article VI: Dependency Management (evaluation criteria and approval process)
- Article VII: Error Handling and Logging (specific patterns for client-side app)
- Article VIII: Content Standards (dual voice mode requirements)
- Article IX: Documentation Requirements (practical for application development)
- Article X: Quality Gates (formalized pre-implementation/merge/deploy checks)

**Revised**:

- Article I: Code Quality Standards (made TypeScript usage explicit and mandatory)
- Article III: User Experience Standards (added loading states and error message examples)

**Removed**:

- Development Workflow section (moved to CLAUDE.md - process, not principles)
- Implementation Rules section (moved to CLAUDE.md - tool-specific instructions)
- Version Control section (moved to CONTRIBUTING.md - git workflow details)

**Rationale**: Strengthened technical rigor while removing process/workflow content that doesn't belong in constitutional principles. Constitution now defines WHAT and WHY, not HOW we manage tasks.

### Version 1.0.0 - 2025-10-19

- Initial constitution with core principles and enterprise requirements

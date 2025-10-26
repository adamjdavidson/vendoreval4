# Feature Specification: Analytical Report Format for Vendor Evaluations

**Feature Branch**: `004-analytical-report-format`
**Created**: 2025-10-26
**Status**: Draft
**Input**: User description: "Update the AI-Powered Vendor Evaluation Report feature to generate reports in a new format with Cons/Pros/Extended sections instead of category-by-category analysis"

## Core Principle: Framework-Focused Evaluation

**This is NOT a general research report.** This is an opinionated evaluation report focused exclusively on whether vendor software supports broader AI adoption best practices as measured by our 6 evaluation criteria:

1. **See**: Transparency (prompt visibility, model disclosure, retrieval logic)
2. **Change**: Customization (configuration, adaptation capabilities)
3. **Use**: Complexity (learning curve, user adoption challenges)
4. **Adapt**: Integration (API flexibility, interoperability)
5. **Leave**: Portability (data export, lock-in risks, exit strategy)
6. **Learn**: Transferability (skill reuse, documentation quality, ecosystem)

**All research, analysis, and synthesis must map directly to these 6 categories.** The report does NOT cover:
- General technical architecture (unless relevant to framework categories)
- Generic user experience feedback (unless addressing Use/Learn categories)
- Market positioning or competitive analysis
- Pricing or business model evaluation
- General feature lists or capabilities not related to adoption best practices

**Success means**: Every Cons, Pros, and Extended analysis statement can be traced back to specific findings within these 6 framework dimensions.

## User Scenarios & Testing

### User Story 1 - Generate Executive-Ready Report with Synthesized Analysis (Priority: P1)

An executive completes a vendor evaluation with 20 questions answered and wants a high-level analytical report that synthesizes findings into clear Cons, Pros, and Extended analysis sections rather than reading through individual category breakdowns.

**Why this priority**: This is the core transformation - converting raw category-based data into executive-friendly synthesis. Without this, the report remains too technical and low-level for decision-making.

**Independent Test**: Complete an evaluation with all 20 questions answered, generate a report, and verify it contains: (1) a headline summary, (2) a Cons section highlighting negatives and concerns, (3) a Pros section highlighting positives and their value, (4) an Extended section providing balanced analysis without firm recommendations.

**Acceptance Scenarios**:

1. **Given** a user has completed all 20 evaluation questions with mixed answers (some Yes, some No, some Limited, some Don't Know), **When** they generate a report, **Then** the Cons section synthesizes all negative indicators across all 6 categories into a coherent summary explaining why these issues are concerning
2. **Given** a user has completed all 20 questions, **When** the report is generated, **Then** the Pros section synthesizes all positive indicators across all 6 categories into a coherent summary explaining why these strengths matter
3. **Given** a user has completed all 20 questions, **When** the report is generated, **Then** the Extended section provides a balanced analysis of the Cons and Pros without offering a firm "recommend" or "don't recommend" conclusion
4. **Given** a user has added notes to specific questions, **When** the report is generated, **Then** the Extended section incorporates insights from user notes to provide additional context
5. **Given** a user has completed an evaluation, **When** they generate a report, **Then** the report header displays: company/tool name, evaluation date, and completion status (e.g., "20/20 questions answered")

---

### User Story 2 - Include External Research for Validation (Priority: P2)

After generating the synthesized analysis, the system augments the report with external research from Brave Search API and Exa API to validate or supplement user-provided answers with objective findings.

**Why this priority**: External research adds credibility and depth to the evaluation by providing independent validation of user assessments and surfacing information the user may have missed.

**Independent Test**: Generate a report for a well-known vendor (e.g., "OpenAI GPT-4"), verify the report includes research findings with proper source attribution, and confirm these findings are integrated into the Cons/Pros analysis where relevant.

**Acceptance Scenarios**:

1. **Given** a report is being generated for a vendor, **When** the system performs external research using Brave Search API, **Then** relevant findings about transparency, usability, and framework alignment are included in the report with source citations
2. **Given** a report is being generated, **When** the system performs external research using Exa API, **Then** technical documentation and user experience information is retrieved and integrated into the analysis
3. **Given** research findings support user answers, **When** the report is generated, **Then** the Cons/Pros sections reference external validation with proper attribution
4. **Given** research findings contradict user answers, **When** the report is generated, **Then** both perspectives are presented in the Extended section with clear attribution (user assessment vs. external research)
5. **Given** the system cannot find reliable information for a particular aspect, **When** the report is generated, **Then** the report proceeds without that research rather than including low-confidence speculation
6. **Given** external research is slow or unavailable, **When** the user requests a report, **Then** the user can choose between a "Quick Report" (answers only) or "Extended Report" (with research), with clear indication that Extended reports take longer

---

### User Story 3 - Reference Detailed Category Analyses (Priority: P3)

While the Cons/Pros/Extended sections provide executive summary, users can access detailed category-by-category analyses (See, Change, Use, Adapt, Leave, Learn) as supporting reference material.

**Why this priority**: Some users need deeper detail to understand the basis for synthesized conclusions. Category analyses provide audit trail and context but are secondary to the executive summary.

**Independent Test**: Generate a report, verify the Cons/Pros/Extended sections appear first, then verify that category analyses are available below as reference material with clear separation.

**Acceptance Scenarios**:

1. **Given** a report has been generated, **When** the user views the report, **Then** the structure is: (1) Header metadata, (2) Headline, (3) Cons, (4) Pros, (5) Extended, followed by (6) Category Analyses as supporting detail
2. **Given** a report includes category analyses, **When** the user reviews them, **Then** each category (See, Change, Use, Adapt, Leave, Learn) shows: grade, answer counts, and AI-generated analysis based on specific answers
3. **Given** a report includes both synthesized sections and category analyses, **When** the user reads the report, **Then** it's clear that Cons/Pros/Extended are the primary findings and category analyses are supporting reference

---

### Edge Cases

- What happens when a user has only partially completed the evaluation (e.g., 12/20 questions answered)? **Decision: Generate report with prominent disclaimer indicating incomplete evaluation. Synthesized sections should acknowledge gaps and limit confidence in conclusions.**
- How should the Extended section handle cases where Pros and Cons are evenly balanced? **Decision: Extended section should present the trade-offs clearly without forcing a recommendation, acknowledging the decision depends on organizational priorities.**
- What happens if external research (Brave/Exa) returns contradictory information about the same vendor aspect? **Decision: Present both findings in Extended section, note the contradiction, and suggest further investigation.**
- How should user notes be integrated if they contradict the answers selected? **Decision: Extended section should acknowledge the nuance - e.g., "User selected 'No' but noted 'partial transparency via changelog' - this suggests limited rather than absent transparency."**
- What happens when external research APIs are unavailable or time out? **Decision: Retry failed API once. If both APIs fail completely after retry, offer Quick Report instead. If one API succeeds and one fails (even after retry), continue with partial research and clearly indicate which source was unavailable in the report.**
- How recent should external research be to be considered relevant? **Decision: Strongly prefer sources <6 months old for fast-moving AI tools. Clearly indicate source age if >6 months. Use sources >12 months only if truly foundational (e.g., vendor's core architecture decisions) and explicitly note age in report.**

## Clarifications

### Session 2025-10-26

- Q: What criteria determine if a research source is reliable enough to include in the report? → A: Filter by domain authority (established tech news, vendor docs, GitHub) + prioritize recency heavily (prefer <6 months, clearly indicate age if >6 months, use sources >12 months only if truly foundational and explicitly note age) + manual confidence score if contradictory. User comments from Reddit and similar community sites should be valued highly as direct user experience evidence.

- Q: How many search queries should be executed per vendor evaluation? → A: One query per framework category (6 total: See, Change, Use, Adapt, Leave, Learn). Each query must specifically target what that category measures (e.g., See = transparency/prompt visibility, Leave = data portability/lock-in). NO general research queries - all research must map directly to the 6 framework dimensions.

- Q: How should the system communicate progress to users during the 5-minute Extended Report generation? → A: Real-time status updates showing current phase (e.g., "Researching See category...", "Synthesizing findings...") combined with estimated time remaining and ability to cancel and get Quick Report instead.

- Q: If one research API succeeds but the other fails (e.g., Brave returns results but Exa times out), should the Extended Report continue with partial research or abort? → A: Retry failed API once. If retry also fails, continue with partial research results from successful API and clearly indicate which sources were unavailable in the report.

- Q: How should the system determine whether a research finding or answer pattern is "negative" (goes in Cons) vs "positive" (goes in Pros)? → A: Framework-aligned classification based on defined best practices for each category. See: transparency = positive, opacity = negative. Change: customization = positive, rigidity = negative. Use: simplicity = positive, complexity = negative. Adapt: integration flexibility = positive, closed system = negative. Leave: easy export/portability = positive, lock-in = negative. Learn: transferable skills = positive, proprietary knowledge = negative.

## Requirements

### Functional Requirements

**Report Structure:**

- **FR-001**: System MUST generate reports with this structure: (1) Header (company name, date, completion status), (2) Headline, (3) Cons, (4) Pros, (5) Extended, (6) Category Analyses, (7) Research Findings
- **FR-002**: Header MUST display: vendor/tool name, evaluation date (ISO format), and completion status (e.g., "20/20 questions answered (100%)")
- **FR-003**: Headline MUST provide a 1-2 sentence summary of evaluation results across all categories

**Synthesized Analysis Sections:**

- **FR-004**: Cons section MUST synthesize negative findings from all 6 categories (See, Change, Use, Adapt, Leave, Learn) into a coherent narrative
- **FR-004a**: System MUST classify findings as positive or negative based on framework-aligned best practices: See (transparency=positive, opacity=negative), Change (customization=positive, rigidity=negative), Use (simplicity=positive, complexity=negative), Adapt (integration=positive, closed=negative), Leave (portability=positive, lock-in=negative), Learn (transferable=positive, proprietary=negative)
- **FR-005**: Cons section MUST explain why each negative finding is concerning from a business or technical perspective
- **FR-006**: Pros section MUST synthesize positive findings from all 6 categories into a coherent narrative
- **FR-007**: Pros section MUST explain why each positive finding matters and provides value
- **FR-008**: Extended section MUST provide balanced analysis considering both Cons and Pros without offering a firm recommendation
- **FR-009**: Extended section MUST incorporate relevant insights from user notes when available
- **FR-010**: Extended section MUST acknowledge trade-offs and areas where decision depends on organizational priorities

**User Notes Integration:**

- **FR-011**: System MUST collect user notes entered during evaluation for each question
- **FR-012**: System MUST pass user notes to report generation process
- **FR-013**: Extended section MUST reference user notes where they provide additional context or nuance to selected answers

**External Research:**

- **FR-014**: System MUST offer two report modes: "Quick Report" (answers only, fast) and "Extended Report" (with external research, slower)
- **FR-014a**: During Extended Report generation, system MUST display real-time progress updates showing current phase (e.g., "Researching See category...", "Researching Change category...", "Synthesizing findings..."), estimated time remaining, and option to cancel and generate Quick Report instead
- **FR-015**: Extended Report mode MUST execute 6 targeted queries (one per framework category: See, Change, Use, Adapt, Leave, Learn) using Brave Search API. Each query must search for information specific to what that category measures (e.g., See = transparency/prompt visibility, Leave = data portability/lock-in).
- **FR-016**: Extended Report mode MUST execute 6 targeted queries (one per framework category) using Exa API. Queries must focus on framework-relevant findings only, not general technical or user experience information.
- **FR-017**: System MUST include research findings with proper source attribution (URL, title, date)
- **FR-018**: When research findings support user answers, system MUST integrate them into Cons/Pros sections with citation
- **FR-019**: When research findings contradict user answers, system MUST present both perspectives in Extended section with clear attribution
- **FR-020**: System MUST omit research findings when confidence is low or sources are unreliable. Reliable sources include: established tech news sites, official vendor documentation, GitHub repositories, and user community sites (Reddit, Hacker News, etc.). Recency is critical: strongly prefer sources <6 months old, clearly indicate source age if >6 months, use sources >12 months only if truly foundational (e.g., core architecture decisions) and explicitly note age in citation. User comments from community sites are valued highly as direct experience evidence.

**Category Analyses (Supporting Detail):**

- **FR-021**: System MUST include detailed category analyses for all 6 categories as reference material below synthesized sections
- **FR-022**: Each category analysis MUST display: category name, grade, answer counts (Yes/Limited/No/Don't Know), and AI-generated analysis
- **FR-023**: Category analyses MUST be clearly marked as "Supporting Detail" or "Reference" to distinguish from primary Cons/Pros/Extended sections

**Partial Evaluations:**

- **FR-024**: System MUST allow report generation for partial evaluations (fewer than 20 questions answered)
- **FR-025**: Partial evaluation reports MUST display a prominent warning banner indicating evaluation is incomplete
- **FR-026**: Partial evaluation reports MUST indicate which categories are incomplete and how this affects confidence in conclusions

**Voice Modes:**

- **FR-027**: System MUST support both "No BS" (direct, candid) and "Corporate" (professional, formal) voice modes for all report sections
- **FR-028**: Voice mode selection MUST apply consistently to Headline, Cons, Pros, Extended, and Category Analyses

### Key Entities

- **Analytical Report**: Generated document with synthesized Cons/Pros/Extended sections, metadata header, and supporting category analyses
- **Synthesized Section**: Cons, Pros, or Extended analysis that combines insights from multiple categories into coherent narrative
- **User Notes**: Text notes entered by user during evaluation to provide context or nuance for specific question answers
- **Research Finding**: External information retrieved from Brave Search or Exa API with source attribution
- **Category Analysis**: Detailed analysis of one of 6 framework categories (See, Change, Use, Adapt, Leave, Learn) used as supporting reference

## Success Criteria

### Measurable Outcomes

- **SC-001**: Users can generate Quick Report (without research) in under 60 seconds
- **SC-002**: Users can generate Extended Report (with research) in under 5 minutes (multiple API calls for research and synthesis)
- **SC-003**: 90% of users find Cons/Pros/Extended format more useful than category-by-category format (measured via feedback survey)
- **SC-004**: Reports include at least 3 research findings with source citations in Extended Report mode
- **SC-005**: Extended section successfully incorporates user notes in 100% of cases where notes exist
- **SC-006**: Partial evaluation reports clearly indicate incomplete status and affected confidence levels
- **SC-007**: Reports maintain consistent voice (No BS or Corporate) across all sections with 95% accuracy (human review)
- **SC-008**: External research APIs (Brave/Exa) successfully return results in 90% of Extended Report requests
- **SC-009**: When research contradicts user answers, both perspectives are presented in 100% of cases
- **SC-010**: Reports are readable and actionable for executive decision-makers without technical background (verified via user testing)

## Assumptions

- Users have already completed evaluations using the existing 20-question framework (no changes to evaluation UI in this feature)
- The existing report generation infrastructure (Claude API integration, voice mode prompts) can be extended rather than rebuilt
- External research APIs (Brave Search, Exa) are available and have sufficient rate limits for production use
- User notes field already exists in the evaluation answers data model
- Report storage and retrieval mechanisms (LocalStorage, etc.) remain unchanged
- PDF export functionality will be updated in a separate follow-up task to reflect new format
- The existing "No BS" and "Corporate" voice modes are sufficient for synthesized sections (no new voices needed)

## Dependencies

- Requires existing evaluation tool with 20-question framework
- Requires existing Claude API integration for AI-generated analysis
- Requires Brave Search API access and API key
- Requires Exa API access and API key
- Depends on existing category grading logic (already implemented)
- Depends on existing report generation service architecture

## Out of Scope

- Changes to evaluation questionnaire UI or question content
- Changes to answer options (Yes/Limited/No/Don't Know remain as-is)
- PDF export format updates (will be addressed in separate task)
- Historical report migration (existing reports remain in old format)
- Multi-vendor comparison reports (comparing multiple evaluations)
- Automated recommendations or scoring (Extended section must remain balanced and non-prescriptive)
- Custom report templates or user-configurable report structures


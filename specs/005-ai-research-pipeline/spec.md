# Feature Specification: Multi-Stage AI Research Pipeline

**Feature Branch**: `005-ai-research-pipeline`
**Created**: 2025-10-26
**Status**: Draft
**Input**: User description: "Build a multi-stage AI-powered research system for vendor evaluations that uses Gemini's large context window to intelligently filter and analyze search results."

## User Scenarios & Testing

### User Story 1 - Relevant Research Results (Priority: P1)

When a user generates an extended report for a vendor evaluation, they receive research findings that are actually about the specific vendor being evaluated, not unrelated projects with similar names.

**Example**: When evaluating "Jasper" (the AI writing assistant company), research results are about Jasper.ai, not about Jasper Reports, Apache Jasper JSP compiler, or random GitHub projects.

**Why this priority**: This is the core value proposition. Without relevant results, the entire research feature is useless. Currently 80-90% of search results are irrelevant for vendors with common names.

**Independent Test**: Can be fully tested by generating a report for a vendor with a common name (e.g., "Jasper", "Atlas", "Compass") and verifying that research sources are about the correct company.

**Acceptance Scenarios**:

1. **Given** user has completed evaluation for "Jasper AI writing tool", **When** they generate extended report, **Then** all research sources reference Jasper.ai (the AI company), not Jasper Reports or other unrelated projects
2. **Given** user evaluates a vendor with unique name like "Anthropic", **When** extended report is generated, **Then** research results remain highly relevant (no degradation vs. current system)
3. **Given** user evaluates "Atlas" (MongoDB Atlas), **When** report includes research, **Then** results distinguish MongoDB Atlas from Atlas web framework, Atlas Comics, etc.

---

### User Story 2 - Comprehensive Research Coverage (Priority: P2)

Users receive research findings from a much broader set of sources (30-50 relevant articles instead of 5), providing more comprehensive insights about vendor behavior across all evaluation categories.

**Why this priority**: Current 5-result limit means we miss important information. More sources = higher confidence in findings and better coverage of edge cases.

**Independent Test**: Generate reports for same vendor with old system (5 results) vs. new system (30-50 results) and compare breadth of insights discovered.

**Acceptance Scenarios**:

1. **Given** user generates extended report, **When** research completes, **Then** system fetches 20-50 initial results per category (vs. current 5)
2. **Given** broad search returns 240-300 total results, **When** AI filters for relevance, **Then** 30-50 high-quality relevant articles remain for analysis
3. **Given** research findings are presented, **When** user reviews sources, **Then** sources cover diverse perspectives (official docs, user reviews, technical analysis, community discussions)

---

### User Story 3 - Deep Content Analysis (Priority: P2)

Research insights are based on full article content (not just titles and snippets), providing nuanced understanding of vendor transparency, lock-in risks, and other evaluation criteria.

**Why this priority**: Current system only uses titles/snippets which miss critical details buried in article content. Full-text analysis enables discovery of subtle but important information.

**Independent Test**: Compare insights generated from title-only vs. full-content analysis for same article set - full content should reveal issues not visible in titles.

**Acceptance Scenarios**:

1. **Given** relevant articles are identified, **When** system fetches content, **Then** full article text is retrieved (not just snippets)
2. **Given** full article content is available, **When** AI analyzes for category insights, **Then** analysis references specific details from article body (quotes, examples, technical specifics)
3. **Given** article discusses vendor lock-in in paragraph 8, **When** current system analyzes (title/snippet only), **Then** lock-in concern is **missed**; **When** new system analyzes (full content), **Then** lock-in concern is **identified and cited**

---

### User Story 4 - Category-Specific Insights (Priority: P3)

For each evaluation category (See, Change, Use, Adapt, Leave, Learn), users receive synthesized insights that connect external research to their specific answers, highlighting confirmations, contradictions, and additional context.

**Why this priority**: Raw research results are less valuable than synthesis that relates findings to user's evaluation context. This transforms research from "here's what we found" to "here's what this means for your specific concerns."

**Independent Test**: Review category analysis to verify it references both user's answers AND research findings, showing connections between them.

**Acceptance Scenarios**:

1. **Given** user answered "vendor doesn't expose system prompts" for transparency question, **When** research finds articles confirming this, **Then** category insight highlights "Your concern about prompt visibility is corroborated by [source]"
2. **Given** user answered "easy data export" for lock-in question, **When** research finds articles describing export limitations, **Then** category insight flags contradiction: "While you noted easy export, [source] reports users experiencing [specific export limitation]"
3. **Given** research uncovers new information not addressed in questions, **When** category analysis is generated, **Then** insights include "Additional consideration: [new finding from research]"

---

### Edge Cases

- What happens when vendor has no search results (extremely new/obscure company)?
  - System should gracefully handle zero results, indicate research unavailable, generate report based on user answers only
- How does system handle ambiguous vendor names with multiple legitimate companies?
  - If "Mercury" could mean Mercury Banking OR Mercury Testing Framework, system should use evaluation context (user's answers about features) to disambiguate
- What if AI filtering removes ALL results as irrelevant?
  - Fall back to broader search without strict filtering, warn user that research confidence is low
- How does system handle paywalled or access-restricted content?
  - Skip unavailable content, continue with accessible sources, note in report if significant sources were inaccessible
- What if Gemini API or web fetching fails mid-process?
  - Cache partial results, retry failed calls, degrade gracefully to Quick Report if research fails
- How to handle rate limits from search APIs or Gemini?
  - Implement exponential backoff, queue requests, provide user feedback about delays

## Requirements

### Functional Requirements

**Stage 1: Broad Search**

- **FR-001**: System MUST query Brave Search API and Exa API for each of 6 evaluation categories (See, Change, Use, Adapt, Leave, Learn)
- **FR-002**: System MUST request 20-50 results per search query (vs. current 5)
- **FR-003**: System MUST execute 12 search API calls in parallel (6 categories × 2 APIs)
- **FR-004**: System MUST include category-specific search terms in queries (e.g., "transparency" for See category, "lock-in" for Change category)
- **FR-005**: System MUST collect total of 240-300 initial search results

**Stage 2: AI Relevance Filtering**

- **FR-006**: System MUST use Gemini Flash API to filter search results for relevance
- **FR-007**: System MUST provide Gemini with context including: vendor name, user's evaluation answers (all 20 questions), and search results
- **FR-008**: System MUST process all 240-300 results in single Gemini API call (leveraging 1M token context window)
- **FR-009**: System MUST receive from Gemini a filtered list identifying which results are about the target vendor vs. unrelated projects
- **FR-010**: Filtered result list MUST include 30-50 relevant articles (if available), discarding irrelevant matches

**Stage 3: Full Content Fetching**

- **FR-011**: System MUST fetch full article content (HTML/text) for each filtered-relevant result
- **FR-012**: System MUST execute web fetching in parallel (20-30 concurrent requests with rate limiting)
- **FR-013**: System MUST extract readable text content from HTML (strip ads, navigation, boilerplate)
- **FR-014**: System MUST handle various content types (blog posts, documentation, forum discussions, news articles)
- **FR-015**: System MUST gracefully skip inaccessible content (paywalls, 404s, timeouts) and continue with available sources

**Stage 4: AI Content Analysis**

- **FR-016**: System MUST use Gemini Flash API to analyze content for each evaluation category
- **FR-017**: For each category, system MUST provide Gemini with: filtered articles with full content, category-specific questions, user's answers to those questions, evaluation criteria for category
- **FR-018**: System MUST execute 6 Gemini analysis calls in parallel (one per category)
- **FR-019**: Gemini analysis MUST return structured insights including: key findings about vendor's behavior in this category, source citations with URLs, relevance to user's specific answers, confidence level of findings
- **FR-020**: System MUST synthesize insights from multiple articles, identifying patterns and contradictions

**Stage 5: Report Synthesis**

- **FR-021**: System MUST continue using existing Claude-based generate-report-content Edge Function for final report
- **FR-022**: Report generation MUST integrate category insights from Gemini with overall evaluation structure
- **FR-023**: System MUST support both voice modes (no-bs and corporate) for final report
- **FR-024**: Final report MUST include research sources section with clickable citations

**Error Handling & Fallbacks**

- **FR-025**: System MUST provide progress feedback during multi-stage research (e.g., "Searching... Filtering... Analyzing...")
- **FR-026**: If research fails completely, system MUST fall back to Quick Report (analysis only, no research)
- **FR-027**: If partial research succeeds, system MUST generate report with available insights and note incomplete research
- **FR-028**: System MUST implement retries with exponential backoff for transient API failures
- **FR-029**: System MUST log detailed errors for debugging while showing user-friendly messages

**Caching & Performance**

- **FR-030**: System MUST invalidate old research cache (bump cache version to v5)
- **FR-031**: System MUST cache filtered and analyzed results for 7 days
- **FR-032**: System MUST support cancellation of long-running research operations
- **FR-033**: System MUST provide estimated time remaining during research process

### Key Entities

- **SearchResult**: Raw result from Brave or Exa API including title, URL, snippet, published date, source type (brave/exa)
- **FilteredResult**: Search result that passed AI relevance filter, including original SearchResult data plus relevance score and reasoning from Gemini
- **ArticleContent**: Full fetched content including URL, extracted text, fetch timestamp, fetch status (success/failed/skipped)
- **CategoryInsight**: Synthesized analysis for one evaluation category including findings (text summary), sources (array of citations), confidence (high/medium/low), contradictions (if user answers conflict with research), additional considerations (new info not in questions)
- **ResearchFinding**: Combined data structure passed to report generation including all CategoryInsights, metadata about research process (result counts, filter rate, fetch success rate)

## Success Criteria

### Measurable Outcomes

- **SC-001**: For vendors with common names (e.g., "Jasper", "Atlas", "Compass"), 90% of research sources reference the correct company (vs. current ~10-20%)
- **SC-002**: Research findings include 30-50 relevant articles per report (vs. current 5-6)
- **SC-003**: Category insights cite specific details from article content (not just titles), with average 3-5 substantive quotes per category
- **SC-004**: Extended report generation completes within 3 minutes for typical vendor evaluation
- **SC-005**: Research quality (measured by user rating "was this research helpful?") improves by 70% compared to current system
- **SC-006**: False positive rate (irrelevant articles included) drops below 10% (currently ~80% for common vendor names)
- **SC-007**: System successfully handles search API rate limits and transient failures with automatic retries, achieving 95% research completion rate

## Assumptions

- Gemini Flash API can handle 240-300 search results in single call within 1M token limit (estimated ~100K tokens for results + prompts)
- Web content fetching averages 2-5 seconds per article (20-30 articles = 40-150 seconds total, parallelized to ~10-20 seconds)
- User's evaluation answers provide sufficient context to disambiguate vendor identity
- Gemini 2.0 Flash cost remains reasonable for production use (~$0.10-0.20 per report estimated)
- Full article content extraction works reliably across diverse site structures
- Existing Gemini MCP tools are available and functional for API integration

# Feature Specification: Full-Stack VendorEval Platform

**Feature Branch**: `002-fullstack-platform`
**Created**: 2025-10-19
**Status**: Draft
**Input**: Transform VendorEval from client-side LocalStorage app to full-stack platform with authentication, admin CMS, dual-tone content system, and database persistence.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Discord Member Authentication (Priority: P1)

A member of the Feedforward Discord community wants to access the VendorEval tool to evaluate AI software vendors. They expect seamless authentication using their existing Discord account without creating a separate username/password.

**Why this priority**: Authentication is the foundation for all other features. Without it, users cannot access the platform, and we cannot differentiate between public visitors and authenticated community members.

**Independent Test**: Can be fully tested by attempting Discord login flow, verifying server membership check, and confirming access to the evaluation tool. Delivers immediate value by allowing Discord members to access their saved evaluations.

**Acceptance Scenarios**:

1. **Given** a user is a member of Discord server 1254761492608188517, **When** they click "Login with Discord", **Then** they are redirected to Discord OAuth, authorize the app, and are logged into VendorEval
2. **Given** a user is NOT a member of Discord server 1254761492608188517, **When** they complete Discord OAuth, **Then** they see error message: "This is a site for members of the Feedforward Community. If you believe you should have access, reach out to Jessica or Maddie or write hello@feedforward.ai"
3. **Given** a logged-in user visits for the 10th time, **When** the page loads, **Then** the system re-checks their Discord server membership in the background
4. **Given** a user who was a Discord member has left the server, **When** membership is re-checked on their 10th visit, **Then** they are logged out and shown the membership error message

---

### User Story 2 - Create and Save Evaluations (Priority: P1)

A user wants to evaluate a new AI vendor tool by answering the 20-question SCUAL framework questionnaire. They expect their answers to be saved automatically so they can return later, work across devices, and export their completed evaluation.

**Why this priority**: This is the core value proposition of the tool. Without the ability to create and save evaluations, the platform serves no purpose.

**Independent Test**: Can be fully tested by creating a new evaluation, answering questions, closing the browser, reopening, and verifying answers persist. Can export as Markdown and verify format.

**Acceptance Scenarios**:

1. **Given** an authenticated user, **When** they click "Start New Evaluation" and enter a vendor name, **Then** a new evaluation is created and saved to the database
2. **Given** a user is completing an evaluation, **When** they select an answer or add notes to any question, **Then** the change is immediately saved to the database
3. **Given** a user has saved evaluations, **When** they log in from a different device, **Then** they see all their evaluations from any device
4. **Given** a user has completed an evaluation, **When** they click "Export as Markdown", **Then** they receive a formatted Markdown file with all questions, answers, and notes

---

### User Story 3 - Dual-Tone Content Toggle (Priority: P2)

A user is preparing to present evaluation results to their executive team and needs to switch the interface language from direct/casual tone to professional corporate language. They expect a simple toggle that changes all text throughout the application.

**Why this priority**: This unique feature differentiates VendorEval from other evaluation tools and serves a real use case (presenting findings to different audiences). However, the tool remains functional without it.

**Independent Test**: Can be tested by toggling between "No BS" and "Corporate Friendly" modes and verifying all questions, categories, and page content changes appropriately.

**Acceptance Scenarios**:

1. **Given** a user viewing any page in "No BS" mode (default), **When** they toggle to "Corporate Friendly", **Then** all question text, category titles, and page content updates to professional language
2. **Given** a user has toggled to "Corporate Friendly", **When** they reload the page, **Then** the interface remembers their preference and stays in Corporate Friendly mode
3. **Given** a user is viewing a question in "No BS" mode that says "Can you see system prompts?", **When** they toggle to "Corporate Friendly", **Then** the question changes to professionally-worded equivalent while maintaining the same meaning

---

### User Story 4 - Admin Content Management (Priority: P2)

An admin wants to update the evaluation questions, add a new pre-analyzed vendor, or modify documentation pages to keep the platform current. They expect a user-friendly admin interface to manage all content without touching code.

**Why this priority**: Content needs to evolve, but this isn't required for initial platform function. Can be done via direct database updates if needed initially.

**Independent Test**: Can be tested by logging in as admin, editing a question, verifying changes appear immediately, and confirming non-admins cannot access admin panel.

**Acceptance Scenarios**:

1. **Given** a user with admin privileges, **When** they navigate to `/admin`, **Then** they see the admin dashboard with sections for Questions, Categories, Pages, Vendors, Users, Feedback, and Settings
2. **Given** an admin editing a question, **When** they update the "No BS" version, **Then** they can click "Auto-Generate Corporate Version" which uses Claude API to create professional wording
3. **Given** an admin creates a new pre-analyzed vendor, **When** they answer all 20 questions with evidence, **Then** that vendor appears in the public vendor library with official badge
4. **Given** a non-admin user, **When** they attempt to access `/admin`, **Then** they see "Access Denied" and are redirected to home page

---

### User Story 5 - Invite Code System (Priority: P3)

An admin wants to grant access to a prospective customer who is not a Discord member. They expect to generate a unique invite code, send it to the user, and have that user gain access via email magic link.

**Why this priority**: This expands the user base beyond Discord members, but Discord authentication handles most users initially.

**Independent Test**: Can be tested by admin creating invite code, providing it to test user, user entering code, receiving magic link email, clicking link, and gaining access.

**Acceptance Scenarios**:

1. **Given** an admin in the admin panel, **When** they create a new invite code with optional email, **Then** a unique code is generated with 7-day default expiration
2. **Given** a non-Discord user with an invite code, **When** they enter the code on the login page, **Then** they are prompted to enter their email for a magic link
3. **Given** a user has requested a magic link, **When** they click the link in their email, **Then** they are logged in and the invite code is marked as "used"
4. **Given** an invite code has expired, **When** a user attempts to use it, **Then** they see "Invite code expired. Please request a new one from your admin."

---

### User Story 6 - Feedback System (Priority: P3)

A user encounters a confusing question or wants to suggest an improvement. They expect a simple way to provide feedback that gets reviewed by the team.

**Why this priority**: Important for continuous improvement, but not required for core functionality.

**Independent Test**: Can be tested by submitting feedback, verifying it's stored in database, checking that a GitHub issue is created, and confirming admin can review it.

**Acceptance Scenarios**:

1. **Given** a user on any page, **When** they see the "Give us feedback" widget at the bottom, **Then** they can type a message and click "Send Feedback"
2. **Given** a user submits feedback, **When** the submission completes, **Then** the feedback is stored in the database AND a GitHub issue is created in vendoreval3 repo with label "user-feedback"
3. **Given** an admin reviewing feedback, **When** they view the feedback list, **Then** they see all submissions with status, date, and link to corresponding GitHub issue
4. **Given** an admin has resolved feedback, **When** they update the status to "Resolved", **Then** the feedback record is updated but the GitHub issue remains open (admin closes manually if needed)

---

### User Story 7 - View Official Vendor Analyses (Priority: P3)

A user researching AI tools wants to see official, pre-analyzed evaluations of popular vendors (like Glean) to inform their own evaluation or make quick comparisons.

**Why this priority**: Adds value by providing expert analysis, but users can still evaluate vendors independently without this feature.

**Independent Test**: Can be tested by navigating to vendor library, viewing a pre-analyzed vendor (e.g., Glean), and seeing completed evaluation with evidence for each answer.

**Acceptance Scenarios**:

1. **Given** a user on the landing page, **When** they view the "Pre-Analyzed Vendors" section, **Then** they see logos and names of officially evaluated vendors
2. **Given** a user viewing a pre-analyzed vendor, **When** they see each question, **Then** they see the official answer (Yes/No/Not Enough Info) and detailed evidence supporting that answer
3. **Given** a user viewing a pre-analyzed vendor in "Corporate Friendly" mode, **When** they toggle to "No BS", **Then** both the questions AND the evidence text changes to match the tone

---

### Edge Cases

- **Membership revoked mid-session**: What happens when a user's Discord membership is revoked while they're actively using the app? System checks membership only on initial login and every 10th visit, so they continue until next check.
- **Multiple invite codes**: What happens if an admin creates multiple invite codes for the same email? All codes remain valid until used or expired; first one used marks that specific code as used.
- **Admin deletes self**: What happens if the only admin removes their own admin access? The super admin (you) is protected and cannot be demoted. Other admins can demote themselves but a warning is shown.
- **User deletion with active evaluations**: When a user's account is deleted (e.g., lost Discord access permanently), their evaluations are anonymized (user_id set to null) but remain in the database for data analysis.
- **Concurrent edits in admin panel**: What happens if two admins edit the same question simultaneously? Last write wins; no conflict resolution needed for Phase I. This is acceptable for small admin team.
- **Tone toggle during evaluation**: If user toggles tone while completing an evaluation, does it affect their saved answers? No, answers are saved regardless of display tone. Tone only affects what the user sees, not what's stored.
- **Failed GitHub issue creation**: If feedback submission succeeds but GitHub API fails (rate limit, network error), feedback is still saved to database with github_issue_number = null. Admin can manually create issue from feedback panel.
- **Magic link expiration**: Magic links expire after 1 hour (Supabase default). If user clicks expired link, they see "Link expired. Please request a new one." They can re-enter their invite code to get a fresh link.

## Requirements *(mandatory)*

### Functional Requirements

#### Authentication & Access Control

- **FR-001**: System MUST authenticate users via Discord OAuth 2.0 provider
- **FR-002**: System MUST verify user is member of Discord server 1254761492608188517 immediately after successful OAuth
- **FR-003**: System MUST re-check Discord server membership on user's initial login and every 10th subsequent visit
- **FR-004**: System MUST revoke access and log out users who are no longer members of the required Discord server
- **FR-005**: System MUST allow admins to create invite codes with optional email address and expiration date
- **FR-006**: System MUST set invite code default expiration to 7 days from creation
- **FR-007**: System MUST allow non-Discord users to authenticate via magic link sent to their email when they provide a valid invite code
- **FR-008**: System MUST mark invite codes as "used" once successfully redeemed
- **FR-009**: System MUST identify one user as super admin who cannot be demoted
- **FR-010**: System MUST allow admins to grant admin access based on Discord role OR manual assignment
- **FR-011**: System MUST allow admins to grant/revoke admin access to other users (except super admin)

#### Evaluation Management

- **FR-012**: System MUST allow authenticated users to create new evaluations by providing a vendor name
- **FR-013**: System MUST persist all evaluation data (vendor name, answers, notes) to database, not browser localStorage
- **FR-014**: System MUST save evaluation changes immediately upon user input (auto-save)
- **FR-015**: System MUST allow users to export their evaluations as formatted Markdown files
- **FR-016**: System MUST display user's saved evaluations across all devices when they log in
- **FR-017**: System MUST associate evaluations with user accounts (user_id foreign key)
- **FR-018**: System MUST support 20 questions across 6 categories (SEE, CHANGE, USE, ADAPT, LEAVE, LEARN)
- **FR-019**: System MUST allow three answer options per question: Yes, No, Not Enough Info
- **FR-020**: System MUST allow users to add private notes to any question in their evaluation

#### Dual-Tone Content System

- **FR-021**: System MUST store two versions of all text content: "no_bs" and "corporate" in separate database columns
- **FR-022**: System MUST provide a binary toggle control labeled "No BS" / "Corporate Friendly"
- **FR-023**: System MUST display "No BS" content by default when user first visits
- **FR-024**: System MUST remember user's tone preference in browser localStorage
- **FR-025**: System MUST display dual-tone content for: questions, category titles/subtitles, documentation pages, vendor analyses
- **FR-026**: System MUST change all visible content when user toggles tone (no page reload required)

#### Admin CMS

- **FR-027**: System MUST provide admin-only panel accessible at `/admin` route
- **FR-028**: System MUST allow admins to create, read, update, and delete (CRUD) questions
- **FR-029**: System MUST allow admins to CRUD categories (title, subtitle, color, order)
- **FR-030**: System MUST allow admins to CRUD documentation pages with Markdown editor
- **FR-031**: System MUST allow admins to CRUD vendors (name, logo, website, description)
- **FR-032**: System MUST allow admins to create official vendor evaluations (answer all 20 questions with evidence)
- **FR-033**: System MUST provide editor with version toggle for "No BS" and "Corporate" versions of all content
- **FR-034**: System MUST allow admins to auto-generate "Corporate" version from "No BS" version using Claude API
- **FR-035**: System MUST allow admins to manually edit auto-generated corporate versions
- **FR-036**: System MUST display all registered users with email, Discord ID, and last login date
- **FR-037**: System MUST allow admins to create invite codes with optional email and custom expiration
- **FR-038**: System MUST allow admins to revoke unused invite codes
- **FR-039**: System MUST display all feedback submissions with date, user, page URL, and status
- **FR-040**: System MUST allow admins to update feedback status (open, in_progress, resolved, closed)
- **FR-041**: System MUST allow admins to edit site settings: site name, logo, primary color, contact email
- **FR-042**: System MUST prevent non-admin users from accessing admin panel (show "Access Denied")

#### Feedback System

- **FR-043**: System MUST display feedback widget on every page of the application
- **FR-044**: System MUST allow any authenticated user to submit feedback with message text
- **FR-045**: System MUST store feedback in database with user_id, page_url, message, timestamp
- **FR-046**: System MUST create a GitHub issue in vendoreval3 repository when feedback is submitted
- **FR-047**: System MUST label all GitHub issues created from feedback with "user-feedback" label
- **FR-048**: System MUST store GitHub issue number and URL in feedback database record
- **FR-049**: System MUST handle GitHub API failures gracefully (save feedback even if issue creation fails)

#### Data Management & Migration

- **FR-050**: System MUST migrate existing questions, categories, and Glean vendor data from code to database
- **FR-051**: System MUST preserve user evaluation data if user account is deleted (anonymize by setting user_id to null)
- **FR-052**: System MUST provide seed script to populate initial database content
- **FR-053**: System MUST auto-generate "Corporate" versions of all content from existing "No BS" baseline during migration

### Key Entities

- **User**: Represents an authenticated person who can create evaluations. Key attributes: email, Discord ID (if Discord auth), admin status, login count (for membership re-check), last membership check date.

- **Admin User**: Represents users with admin privileges. Key attributes: user reference, granted by (which admin), date granted, is_super_admin flag.

- **Invite Code**: Represents a generated invitation for non-Discord users. Key attributes: unique code, optional email, created by admin, used by user, used date, expiration date.

- **Category**: Represents one of six evaluation categories (SEE, CHANGE, USE, ADAPT, LEAVE, LEARN). Key attributes: key/slug, order index, color, title (no_bs and corporate), subtitle (no_bs and corporate).

- **Question**: Represents one of 20 evaluation questions. Key attributes: category reference, order index, is_critical flag, text (no_bs and corporate).

- **Vendor**: Represents an AI tool being evaluated. Key attributes: slug, name, logo URL, website, description (no_bs and corporate), last refreshed date (Phase II).

- **Vendor Evaluation**: Represents official pre-analyzed vendor assessment. Key attributes: vendor reference, question reference, answer (yes/no/not-enough-info), evidence (no_bs and corporate).

- **Evaluation**: Represents a user's assessment of a specific vendor. Key attributes: user reference, vendor name, answers JSON (array of {questionId, value, note}), created date, updated date.

- **Page**: Represents documentation/content pages. Key attributes: slug, title (no_bs and corporate), content (no_bs and corporate markdown), published status.

- **Feedback**: Represents user feedback submission. Key attributes: user reference, page URL, message, GitHub issue number, GitHub issue URL, status (open/in_progress/resolved/closed), created date.

- **Site Settings**: Represents global configuration (single row). Key attributes: site name, logo URL, primary color, contact email, updated by admin.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Authenticated Discord members can access the platform and create their first evaluation within 2 minutes of initial login
- **SC-002**: Users can answer all 20 questions in an evaluation and export as Markdown within 15 minutes
- **SC-003**: Tone toggle changes all visible content (questions, categories, pages) instantly (under 500ms perceived lag)
- **SC-004**: Admins can edit a question and see changes reflected in user-facing content immediately (under 5 seconds)
- **SC-005**: Platform maintains user session across page reloads and device switches (evaluations accessible from any device)
- **SC-006**: Feedback submissions result in GitHub issue creation within 30 seconds (95% of the time)
- **SC-007**: Discord server membership verification completes within 5 seconds during login
- **SC-008**: System supports at least 100 concurrent authenticated users without performance degradation
- **SC-009**: All existing content (questions, categories, Glean data) successfully migrates to database with zero data loss
- **SC-010**: Auto-generated corporate versions maintain semantic meaning of no-BS originals (verified by manual review of 20 samples)

## Assumptions

- Discord server 1254761492608188517 remains active and accessible via Discord API throughout Phase I
- Supabase free tier provides sufficient capacity (500MB database, 50K MAU, Edge Functions within limits)
- Vercel free tier provides sufficient bandwidth and deployment capacity for Phase I traffic
- GitHub API rate limits are sufficient for feedback submissions (not expecting >5000 feedback items per hour)
- Claude API (Anthropic) is available and responsive for corporate tone generation (<5 second response time)
- Single super admin is sufficient for Phase I (you); additional admin roles can be granted as needed
- LocalStorage for tone preference is acceptable (users won't expect this to sync across devices)
- Current content (~20 questions, 6 categories, 1 vendor analysis) is complete baseline for migration
- Phase I does not require real-time collaboration (no websockets or live updates needed)
- Phase I does not require community reviews/ratings (saved for Phase III)
- Performance testing with simulated load is acceptable; production traffic monitoring happens post-launch

## Dependencies

- **Supabase Project**: Must be created with PostgreSQL database, Discord OAuth provider configured, and Edge Functions enabled
- **Discord Developer Application**: Must be created with bot token and OAuth client credentials
- **Discord Bot Server Access**: Bot must be added to server 1254761492608188517 with member read permissions
- **GitHub Personal Access Token**: Required for creating issues via API (repo scope)
- **Anthropic API Key**: Required for Claude API access to generate corporate tone versions
- **Vercel Account**: Required for frontend deployment (evaluation-tool and docs apps)
- **Domain Name** (optional for Phase I): Can use Vercel-provided domains initially

## Scope Boundaries

### In Scope for Phase I

- Discord OAuth authentication with server membership verification
- Invite code + magic link authentication for non-Discord users
- Database-backed user evaluations (create, save, export)
- Dual-tone content system with toggle
- Admin CMS for all content management
- Feedback system with GitHub integration
- Migration of existing content to database
- Unit, integration, and E2E testing
- Deployment to Vercel + Supabase production

### Explicitly Out of Scope (Future Phases)

- **Phase II Features**:
  - Exa API integration for vendor research
  - AI-generated vendor reports and analysis
  - Auto-refresh of vendor data on schedule
  - Comprehensive vendor reports beyond 20 questions

- **Phase III Features**:
  - Community review system (users can publish evaluations)
  - Anonymous vs. named reviews
  - Upvoting/downvoting reviews
  - Vendor comparison views
  - Aggregated ratings and statistics

- **Not Planned**:
  - Mobile native apps (web-only for now)
  - Real-time collaboration (multiple users editing same evaluation)
  - Video/audio attachments to evaluations
  - Integration with CRM systems (Salesforce, HubSpot)
  - White-label/multi-tenant versions
  - API for third-party integrations

## Risks

- **Discord API Dependency**: If Discord API is down or rate-limited, users cannot authenticate. *Mitigation*: Cache membership checks for 24 hours; implement fallback invite code auth.
- **Supabase Free Tier Limits**: Exceeding 500MB database or 50K MAU requires upgrade to paid tier ($25/mo). *Mitigation*: Monitor usage closely; plan for upgrade budget.
- **GitHub API Rate Limits**: Feedback submissions could hit rate limits (5000 req/hour). *Mitigation*: Queue feedback submissions; retry failed attempts; users see feedback saved message even if GitHub issue pending.
- **Claude API Costs**: Auto-generating corporate versions for all content could exceed budget. *Mitigation*: Generate only on-demand (when admin clicks button); cache results; estimate costs before running batch generation.
- **Tone Quality Consistency**: AI-generated corporate tone might not always match desired style. *Mitigation*: Allow manual editing; provide clear prompts to Claude; review samples before mass adoption.
- **Data Migration Complexity**: Existing data structure might not map cleanly to new schema. *Mitigation*: Write comprehensive seed script with validation; test on staging environment; keep backups.
- **Admin Access Control**: Granting admin to Discord roles requires accurate role checking. *Mitigation*: Manual admin assignment as fallback; document exact role names required; test thoroughly.
- **User Onboarding Friction**: Requiring Discord membership might limit adoption. *Mitigation*: Invite code system provides alternative; prominently display contact info for access requests.


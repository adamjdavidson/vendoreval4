# AI Vendor Evaluation Tool - Project Overview

## Executive Summary

This project builds a comprehensive AI vendor evaluation system for Fortune 500 executives responsible for AI procurement. The system consists of:

1. **Documentation Site**: Educational framework explaining why AI procurement is different and how to think about vendor evaluation
2. **Evaluation Tool**: Interactive 20-question assessment tool for evaluating AI vendors
3. **Vendor Analyses**: Pre-completed evaluations of major AI vendors (starting with Glean)
4. **Report Generation**: Automated report creation in two voice modes (Direct & Suitable for Work)

## The Problem We're Solving

**Target User**: Executives at Fortune 500+ companies responsible for AI deployment and procurement
- Titles: VP/EVP Digital Transformation, Chief AI Officer, VP Technology Strategy
- Budget authority: $500K+
- Companies: Multi-billion dollar enterprises

**Core Problem**: These executives are asked to make high-stakes AI procurement decisions but:
- Lack confidence in their evaluation methodology
- Face political challenges (IT controls procurement, leadership wants wins, expertise often ignored)
- Traditional IT evaluation frameworks don't work for AI tools
- Hidden risks: capability lock-in, vendor cost incentives, commodity model dynamics
- Executives want to improve their own knowledge of AI 

**Job-to-be-Done**: "Help me make smart, defensible AI procurement decisions AND give me the language and frameworks to look smart internally, win political battles, and position myself as the sophisticated thinker in the room." And: "Help me think longer-term by evaluating AI-based SaaS for the near-term and future." 

## What Makes This Different

### Unique Value Propositions

1. **Strategic Framework, Not Just Checklists**
   - Focuses on capability building vs. lock-in, not just features
   - Addresses AI-specific risks (vendor incentives, model commoditization, capability trap)
   - Considers organizational maturity progression

2. **Built for Internal Politics**
   - Two voice modes translate sophisticated thinking into whatever wins the room
   - Pre-built arguments for common battles (CEO wants flashy tool, IT has wrong criteria)
   - Not just "what to decide" but "how to convince others"

3. **AI-Specific Evaluation Lens**
   - Only framework addressing vendor incentives to degrade quality
   - Reveals what vendors hide (prompts, model routing, lock-in mechanisms)
   - Six criteria (SEE/CHANGE/USE/ADAPT/LEAVE/LEARN) reveal hidden risks

4. **Integrated into $200K/year Community**
   - Not a standalone product - part of Feedforward membership
   - Members already trust the source (Ethan Mollick + Adam Davidson)
   - Free value-add to existing high-value relationship

## Core Concepts

### The Six Evaluation Criteria

1. **SEE** - Can you see how it works?
   - Prompts, models, context/retrieval, orchestration
   - Transparency reveals vendor trustworthiness

2. **CHANGE** - Can you control it?
   - Edit prompts, select models, control context
   - Control determines adaptability to your needs

3. **USE** - Is it actually useful?
   - Real output quality, appropriate for context, admits uncertainty
   - Anti-theater test: accurate vs. impressive

4. **ADAPT** - Can it evolve?
   - Uses current models, vendor update process, autonomy configuration, tool connectivity
   - Future-proofing against obsolescence

5. **LEAVE** - Can you exit?
   - Export everything, knowledge portability, migration path
   - Avoiding vendor hostage situations

6. **LEARN** - Does it build capability?
   - Standard language, encourages experimentation, generalizable skills
   - Capability building vs. dependency creation

### The Maturity Model (Context, Not Evaluation)

Four levels of organizational AI deployment:
- **Level 1**: Individual use (one person, one task)
- **Level 2**: Workflow augmentation (teams, processes)
- **Level 3**: Organizational transformation (company-wide change)
- **Level 4**: B2B integration (inter-firm AI collaboration)

**Important**: This is NOT part of the evaluation tool (too complex). It lives in documentation to provide context for why vendor choices matter long-term.

### Two Voice Modes

All content available in two modes:

1. **Direct**: Straight talk, cuts through BS, names what vendors hide
2. **Suitable for Work**: Professional, appropriate for formal contexts, politically safe

Users toggle between modes based on context (reading for themselves vs. sharing with leadership).

## User Flows

### Primary Flow: Manual Vendor Evaluation

1. User arrives at site, reads framework (optional)
2. Opens evaluation tool
3. Enters vendor name
4. Works through 6 categories (20 questions total)
   - Answers Yes/No/Not enough info
   - Clicks (?) for explanation of why question matters
   - Adds notes (✏️) for specific observations
5. Sees real-time category color shifting (green/yellow/red/grey)
6. Reviews overall assessment
7. Generates report (selects voice mode)
8. Exports as PDF or Markdown

### Secondary Flow: Learn from Pre-Analyzed Vendors

1. User browses vendor analyses section
2. Finds pre-completed evaluation (e.g., Glean)
3. Sees all 20 questions answered with evidence
4. Uses as reference for their own evaluation
5. Understands what "good" looks like

### Tertiary Flow: Educational Deep Dive

1. User explores documentation site
2. Reads framework sections
3. Toggles between Direct and Suitable for Work modes
4. Learns AI procurement principles
5. Uses knowledge in vendor meetings and internal discussions

## Success Metrics

### Phase 1: Validation (First 90 Days)

**Primary Success Criteria:**
- 5 members use framework in actual procurement decisions and make a DIFFERENT decision because of it
- 3 members report tool "justified meaningful percentage of my $200K membership fee"
- 2 members use language/concepts in internal meetings and report it helped

**Secondary Signals:**
- Members quote framework concepts unprompted in community
- Member asks to share framework with leadership team
- Member articulates specific risk avoided or insight gained

### Phase 2: Product-Market Fit (6-12 Months)

- 20+ members report using framework in procurement
- $50M+ in avoided/optimized spend (member self-reported)
- 10+ vendors evaluated through tool
- Framework concepts become shared vocabulary in community

## What's In Scope (Alpha)

### Must-Have for Week 1 Launch

1. **Documentation Site**
   - 6 main sections (Why Framework, The Framework, Maturity Model, Using Tool, Vendor Analyses, Resources)
   - Core pages written with voice toggle working
   - All 20 question explanations accessible
   - Responsive, fast, searchable

2. **Evaluation Tool**
   - 6 categories, 20 questions
   - Yes/No/Not enough info answers
   - Notes field per question
   - Help modal per question
   - Color-shifting categories
   - LocalStorage auto-save
   - JSON export/import

3. **One Pre-Analyzed Vendor (Glean)**
   - Complete evaluation with all 20 questions answered
   - Evidence and reasoning documented
   - Viewable in same format as DIY tool

4. **Report Generation**
   - Two voice modes (Direct / Suitable for Work)
   - Executive summary + category-by-category + context
   - Export as PDF and Markdown
   - Professional formatting

## What's Out of Scope (Post-Alpha)

### Future Enhancements (30+ Days)

- **Automated Question-Answering**: Use EXA/deep research to find answers
- **Multi-Vendor Library**: Analyses of Hebbia, Writer, Harvey.ai
- **Comparison Views**: Side-by-side vendor comparisons
- **Peer Reviews**: Community-contributed evaluations
- **Advanced Reports**: Custom report templates, slide decks

## Technical Constraints

- **No Login Required**: Tool works without authentication (LocalStorage persistence)
- **Browser Storage Only**: No backend database for alpha
- **Client-Side Only**: All processing happens in browser
- **Mobile-Friendly**: Must work on phones (execs read on mobile)
- **Fast Load**: Documentation must be instantly accessible
- **Offline Capable**: Consider PWA for offline access (future)

## Business Model Context

**This is NOT a standalone product.** It's a value-add for $200K/year Feedforward membership.

- Free to members
- Not monetized separately (initially)
- Success = member retention and recruitment
- Potential future: Standalone offering if demand warrants

## Key Decisions Made

1. ✅ **6 categories, not 7**: Maturity model stays in docs, not evaluation tool
2. ✅ **20 questions total**: 3-4 per category, balanced depth
3. ✅ **Two voice modes**: Direct + Suitable for Work (not three)
4. ✅ **No automated search in alpha**: Manual evaluation only, automation later
5. ✅ **Integrated tool**: Not separate quick + deep, one progressive disclosure
6. ✅ **LocalStorage persistence**: No backend needed for alpha
7. ✅ **PDF + Markdown export**: Two report formats for different uses

## Open Questions / Future Decisions

1. **Search Integration**: When to add EXA/deep research automation?
2. **Community Features**: How to enable peer reviews without spam?
3. **Standalone Product**: Should this become separate offering?
4. **API Access**: Should external tools integrate with this framework?
5. **White-Label**: Should consulting firms be able to brand this?
6. **comparisons**: We should be able to compare multiple AI-powered B2B SaaS software vendors easily and generate reports on multiple ones. 

## Next Steps

1. Create detailed technical specification
2. Define component architecture
3. Write all content (both voice modes)
4. Design visual system
5. Build in phases (docs → tool → reports)
6. Test with 2-3 friendly members
7. Iterate based on feedback
8. Launch to full membership

---

**Document Version**: 1.0  
**Last Updated**: 2025-01-15  
**Owner**: Adam Davidson / Feedforward Team
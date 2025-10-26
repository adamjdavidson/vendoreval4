// "No BS" Voice Mode Prompt Templates
// Feature: 003-ai-report-generation
// Voice: Direct, candid, cuts through marketing speak

export const NO_BS_SYSTEM_PROMPT = `You are an expert AI vendor evaluator providing direct, candid analysis for Fortune 500 executives making high-stakes procurement decisions.

## Your Communication Style

**Direct and Honest**:
- Cut through marketing BS and vendor claims
- Name what vendors hide or obscure
- Use conversational, straightforward language
- Call out red flags explicitly
- No corporate euphemisms or softening

**Practical and Action-Oriented**:
- Focus on business impact, not theory
- Provide clear recommendations (buy, avoid, investigate further)
- Explain why something matters in practice
- Use real-world examples and implications

**Examples of "No BS" Voice**:

❌ Corporate: "The vendor's approach to transparency may present challenges for organizations requiring detailed visibility into system operations."

✅ No BS: "You can't see their system prompts. They control the behavior, you're flying blind. That's a problem if you need to debug or audit."

❌ Corporate: "Migration considerations should be evaluated prior to commitment."

✅ No BS: "Getting your data out is painful. Plan your exit before you go in, or you'll regret it later."

## Framework Principles (CACHED)

You evaluate vendors across 6 categories based on 20 questions answered by the user:

### See (Transparency)
**Principle**: Can you see what the AI is doing and why?
- System prompts visibility
- Model routing logic transparency
- Retrieval mechanism visibility
- Fine-tuning data inspection

**Why it matters**: Without transparency, you can't debug, audit, or trust. Vendor controls behavior, you fly blind.

### Change (Customization & Lock-in)
**Principle**: Can you customize the AI to your needs without vendor lock-in?
- Custom model training capability
- Proprietary vs standard formats
- Vendor-specific dependencies
- Switching cost assessment

**Why it matters**: Flexibility = negotiating power. Lock-in = vendor owns your AI strategy.

### Use (Ease of Use)
**Principle**: How easy is it for your team to actually use the system?
- Learning curve for end users
- Complexity hidden vs exposed
- Integration simplicity
- User autonomy vs hand-holding

**Why it matters**: Complex = slow adoption = wasted investment. Simple = faster ROI.

### Adapt (Autonomy & Control)
**Principle**: Can you control when/how the AI changes?
- Model update control
- Autonomous changes by vendor
- Breaking change management
- Rollback capabilities

**Why it matters**: Surprise changes break your workflows. Control = predictability = reliability.

### Leave (Exit Strategy)
**Principle**: Can you get your data and migrate away if needed?
- Data export completeness
- Migration path clarity
- Post-exit functionality
- Competitive barriers

**Why it matters**: Easy exit = vendor stays honest. Hard exit = trapped paying whatever they charge.

### Learn (Skill Transferability)
**Principle**: Do skills learned here work elsewhere?
- Standard vs proprietary concepts
- Documentation quality
- Ecosystem lock-in
- Knowledge portability

**Why it matters**: Proprietary knowledge dies when vendor dies. Standards outlive vendors.

## Grading System (CACHED)

**Letter Grades**:
- **A (90-100%)**: Excellent - industry leading
- **B (80-89%)**: Good - above average
- **C (70-79%)**: Acceptable - some concerns
- **D (60-69%)**: Poor - significant issues
- **F (<60%)**: Failing - deal-breaker problems

**Red Flags**: D or F grades indicate serious issues that should pause or stop the deal.
**Strengths**: A or B grades indicate vendor excels in this area.

## Your Task

Given:
1. **Vendor Name**: The AI vendor being evaluated
2. **User Answers**: The user's responses to the 20 evaluation questions (Yes, No, Unknown counts per category)
3. **Research Findings** (optional): External research about the vendor's capabilities

Generate:
1. **Headline** (1-2 sentences): Bottom-line assessment
   - Summarize overall verdict
   - Highlight any red flags (D/F grades)
   - State clear recommendation
   - Use direct, conversational language

2. **Category Analyses** (6 sections, one per category):
   - **Grade**: Already calculated from user answers
   - **Analysis** (2-3 sentences): What the user's answers reveal
   - **Key Insights** (3-5 bullet points): Specific implications

## Output Format

Return ONLY valid JSON (no markdown, no explanation):

\`\`\`json
{
  "headline": "Bottom-line assessment with recommendation",
  "categoryAnalyses": [
    {
      "categoryKey": "see",
      "analysisText": "Direct analysis of what user's answers reveal about transparency",
      "keyInsights": [
        "Specific insight about what this means for the user",
        "Another actionable insight",
        "Third insight if relevant"
      ]
    },
    // ... 5 more categories
  ]
}
\`\`\`

## Quality Standards

✅ **Direct**: "You can't see system prompts" not "Visibility limitations exist"
✅ **Specific**: Reference actual answers, not generic statements
✅ **Actionable**: Explain what the user should do with this information
✅ **Consistent**: Use the same tone throughout (candid, no-BS)

❌ **NO corporate euphemisms**: "challenges", "opportunities", "considerations"
❌ **NO marketing speak**: Don't parrot vendor claims
❌ **NO hedging**: "may", "might", "could" - be direct
❌ **NO speculation**: Base analysis on user's answers + research only`;

/**
 * Build synthesis prompt for Cons/Pros/Extended sections
 * Feature: 004-analytical-report-format
 */
export function buildNoBSSynthesisPrompt(
  vendorName: string,
  evaluationDate: string,
  completionStatus: string,
  categoryAnalyses: any[],
  researchFindings: any[],
  userNotes: Record<string, string>
): string {
  let prompt = `# Generate Executive Analytical Report\n\n`;
  prompt += `**Vendor**: ${vendorName}\n`;
  prompt += `**Evaluation Date**: ${evaluationDate}\n`;
  prompt += `**Completion**: ${completionStatus}\n\n`;

  // Add category analyses summary
  prompt += `## Category Analyses Summary\n\n`;
  categoryAnalyses.forEach((analysis) => {
    prompt += `**${analysis.categoryName}** (Grade: ${analysis.grade})\n`;
    prompt += `${analysis.analysisText}\n\n`;
  });

  // Add research findings if available
  if (researchFindings.length > 0) {
    prompt += `## External Research Findings\n\n`;
    researchFindings.forEach((finding) => {
      prompt += `**[${finding.categoryKey.toUpperCase()}]** ${finding.finding}\n`;
      if (finding.sources && finding.sources.length > 0) {
        prompt += `Source: ${finding.sources[0].title}\n`;
      }
      prompt += `\n`;
    });
  }

  // Add user notes if available
  const noteEntries = Object.entries(userNotes || {}).filter(([_, note]) => note.trim());
  if (noteEntries.length > 0) {
    prompt += `## User Notes (Additional Context)\n\n`;
    noteEntries.forEach(([key, note]) => {
      prompt += `- ${note}\n`;
    });
    prompt += `\n`;
  }

  prompt += `## Instructions\n\n`;
  prompt += `Generate an executive-ready analytical report with three synthesized sections:\n\n`;

  prompt += `### 1. CONS (Negatives & Why Concerning)\n`;
  prompt += `Synthesize negative findings across ALL 6 categories into a coherent narrative.\n`;
  prompt += `Use framework-aligned classification:\n`;
  prompt += `- See: opacity/lack of transparency = negative\n`;
  prompt += `- Change: rigidity/lack of customization = negative\n`;
  prompt += `- Use: complexity/high learning curve = negative\n`;
  prompt += `- Adapt: closed system/poor integration = negative\n`;
  prompt += `- Leave: lock-in/poor portability = negative\n`;
  prompt += `- Learn: proprietary knowledge/poor documentation = negative\n\n`;
  prompt += `Explain WHY each negative is concerning from a business perspective:\n`;
  prompt += `- Opacity → vendor lock-in, hidden costs, audit problems\n`;
  prompt += `- Rigidity → can't adapt to workflows, wasted customization time\n`;
  prompt += `- Complexity → low adoption, high training costs\n`;
  prompt += `- Closed system → integration challenges, vendor dependency\n`;
  prompt += `- Lock-in → exit costs, data loss risk, no negotiating power\n`;
  prompt += `- Proprietary → team dependency, hiring challenges\n\n`;
  prompt += `Format as Markdown. Use bold for key concerns. Be direct and specific.\n\n`;

  prompt += `### 2. PROS (Positives & Why They Matter)\n`;
  prompt += `Synthesize positive findings across ALL 6 categories into a coherent narrative.\n`;
  prompt += `Use framework-aligned classification:\n`;
  prompt += `- See: transparency/visibility = positive\n`;
  prompt += `- Change: flexibility/customization = positive\n`;
  prompt += `- Use: simplicity/easy adoption = positive\n`;
  prompt += `- Adapt: integration flexibility/open APIs = positive\n`;
  prompt += `- Leave: easy export/portability = positive\n`;
  prompt += `- Learn: transferable skills/good docs = positive\n\n`;
  prompt += `Explain WHY each positive matters and provides business value:\n`;
  prompt += `- Transparency → trust, predictability, easier debugging\n`;
  prompt += `- Flexibility → adapt to needs, faster customization\n`;
  prompt += `- Simplicity → fast adoption, low training costs\n`;
  prompt += `- Open → ecosystem benefits, easier integration\n`;
  prompt += `- Portable → risk mitigation, vendor stays honest\n`;
  prompt += `- Transferable → team resilience, easier hiring\n\n`;
  prompt += `Format as Markdown. Use bold for key strengths. Be direct and specific.\n\n`;

  prompt += `### 3. EXTENDED (Balanced Analysis)\n`;
  prompt += `Present trade-offs between Cons and Pros WITHOUT offering a firm recommendation.\n`;
  prompt += `Acknowledge:\n`;
  prompt += `- When pros/cons are balanced and decision depends on organizational priorities\n`;
  prompt += `- User notes that provide additional nuance (if any)\n`;
  prompt += `- Research contradictions or gaps (if any)\n`;
  prompt += `- Organizational factors that affect the decision\n\n`;
  prompt += `DO NOT say "I recommend" or "you should" - keep it analytical and balanced.\n`;
  prompt += `Format as Markdown. Use "No BS" voice: direct, candid, cuts through marketing speak.\n\n`;

  prompt += `## Output Format\n\n`;
  prompt += `Return ONLY valid JSON (no markdown, no explanation):\n\n`;
  prompt += `\`\`\`json\n`;
  prompt += `{\n`;
  prompt += `  "headline": "1-2 sentence summary (No BS voice)",\n`;
  prompt += `  "cons": "Markdown: synthesized negatives + why concerning",\n`;
  prompt += `  "pros": "Markdown: synthesized positives + why they matter",\n`;
  prompt += `  "extended": "Markdown: balanced analysis without firm recommendation"\n`;
  prompt += `}\n`;
  prompt += `\`\`\`\n\n`;
  prompt += `Use direct, candid "No BS" language throughout. Be specific and actionable.`;

  return prompt;
}

/**
 * Original prompt builder for category analyses
 * Feature: 003-ai-report-generation
 */
export function buildNoBSPrompt(
  vendorName: string,
  categoryAnalyses: any[],
  researchFindings: any[]
): string {
  let prompt = `# Generate Evaluation Report\n\n`;
  prompt += `**Vendor**: ${vendorName}\n\n`;

  // Add user answers summary
  prompt += `## User's Evaluation Answers\n\n`;
  categoryAnalyses.forEach((analysis) => {
    prompt += `**${analysis.categoryName}** (Grade: ${analysis.grade})\n`;
    prompt += `- Yes: ${analysis.yesCount}\n`;
    prompt += `- No: ${analysis.noCount}\n`;
    prompt += `- Unknown: ${analysis.unknownCount}\n`;
    prompt += `- Total Questions: ${analysis.totalQuestions}\n\n`;
  });

  // Add research findings if available
  if (researchFindings.length > 0) {
    prompt += `## External Research Findings\n\n`;
    researchFindings.forEach((finding) => {
      prompt += `**[${finding.categoryKey.toUpperCase()}] ${finding.topic}**\n`;
      prompt += `Confidence: ${finding.confidence}\n`;
      prompt += `${finding.finding}\n\n`;
      if (finding.sources.length > 0) {
        prompt += `Sources:\n`;
        finding.sources.forEach((source: any) => {
          prompt += `- ${source.title} (${source.url})\n`;
        });
        prompt += `\n`;
      }
    });
  }

  prompt += `## Instructions\n\n`;
  prompt += `Generate a "No BS" voice report with:\n`;
  prompt += `1. **Headline**: Direct bottom-line assessment (1-2 sentences)\n`;
  prompt += `2. **Category Analyses**: Analysis + key insights for each of the 6 categories\n\n`;
  prompt += `Use direct, candid language. Cut through BS. Be specific and actionable.\n\n`;
  prompt += `Return ONLY valid JSON matching the specified format.`;

  return prompt;
}

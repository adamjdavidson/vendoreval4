// "Corporate" Voice Mode Prompt Templates
// Feature: 003-ai-report-generation
// Voice: Professional, formal, politically safe

export const CORPORATE_SYSTEM_PROMPT = `You are an expert AI vendor evaluator providing professional, formal analysis for Fortune 500 executives making strategic procurement decisions.

## Your Communication Style

**Professional and Formal**:
- Use standard business language
- Maintain diplomatic tone throughout
- Frame concerns as "considerations" or "areas requiring attention"
- Avoid confrontational or inflammatory language
- Suitable for sharing in formal business contexts

**Objective and Balanced**:
- Present findings neutrally
- Acknowledge both strengths and limitations
- Use measured language ("may present challenges" vs "is a problem")
- Focus on facts and evidence-based assessment

**Examples of "Corporate" Voice**:

✅ Corporate: "The vendor's approach to system prompt visibility may present challenges for organizations requiring detailed oversight of AI behavior and decision-making processes."

❌ Too Direct: "You can't see their system prompts. They control everything, you fly blind."

✅ Corporate: "Data portability and migration considerations should be carefully evaluated prior to vendor commitment to ensure alignment with long-term strategic objectives."

❌ Too Direct: "Getting your data out is painful. Plan your exit or you'll regret it."

## Framework Principles (CACHED)

You evaluate vendors across 6 categories based on 20 questions answered by the user:

### See (Transparency)
**Principle**: Assess the vendor's transparency regarding AI operations and decision-making processes.
- System prompt accessibility
- Model routing visibility
- Retrieval mechanism transparency
- Fine-tuning data inspection capabilities

**Business Impact**: Transparency enables effective governance, audit compliance, and operational debugging.

### Change (Customization & Vendor Independence)
**Principle**: Evaluate customization capabilities and potential for vendor lock-in.
- Custom model training options
- Data format standards vs proprietary formats
- Vendor-specific dependencies
- Migration cost assessment

**Business Impact**: Flexibility supports strategic autonomy and competitive positioning.

### Use (Operational Efficiency)
**Principle**: Assess system usability and integration complexity.
- User learning curve
- System complexity management
- Integration requirements
- User autonomy

**Business Impact**: Ease of use accelerates adoption and maximizes return on investment.

### Adapt (Change Management & Control)
**Principle**: Evaluate control over system changes and updates.
- Model update governance
- Vendor-initiated changes
- Breaking change protocols
- Version rollback capabilities

**Business Impact**: Predictability supports operational stability and risk management.

### Leave (Exit Strategy & Data Portability)
**Principle**: Assess exit options and data migration capabilities.
- Data export comprehensiveness
- Migration path documentation
- Post-contract functionality
- Competitive transition barriers

**Business Impact**: Clear exit paths support strategic flexibility and vendor accountability.

### Learn (Knowledge Transfer & Ecosystem)
**Principle**: Evaluate skill portability and knowledge ecosystem.
- Standard vs proprietary approaches
- Documentation quality
- Ecosystem dependencies
- Knowledge transferability

**Business Impact**: Standardized knowledge supports long-term sustainability and reduces organizational risk.

## Grading System (CACHED)

**Letter Grades**:
- **A (90-100%)**: Exceeds industry standards
- **B (80-89%)**: Meets or exceeds expectations
- **C (70-79%)**: Acceptable with some areas for improvement
- **D (60-69%)**: Below expectations, requires attention
- **F (<60%)**: Significant concerns requiring immediate evaluation

**Assessment Indicators**:
- **D/F Grades**: Indicate areas requiring careful consideration and potentially additional due diligence
- **A/B Grades**: Indicate vendor strengths and competitive advantages

## Your Task

Given:
1. **Vendor Name**: The AI vendor under evaluation
2. **User Answers**: Evaluation responses across 20 assessment questions (Yes, No, Unknown counts per category)
3. **Research Findings** (optional): External research regarding vendor capabilities

Generate:
1. **Headline** (1-2 sentences): Executive summary of assessment
   - Summarize overall evaluation outcome
   - Highlight key findings or concerns
   - Provide strategic recommendation
   - Use professional, measured language

2. **Category Analyses** (6 sections, one per category):
   - **Grade**: Already calculated from user responses
   - **Analysis** (2-3 sentences): Professional interpretation of findings
   - **Key Insights** (3-5 bullet points): Strategic implications

## Output Format

Return ONLY valid JSON (no markdown, no explanation):

\`\`\`json
{
  "headline": "Executive summary with professional recommendation",
  "categoryAnalyses": [
    {
      "categoryKey": "see",
      "analysisText": "Professional analysis of transparency assessment findings",
      "keyInsights": [
        "Strategic insight regarding implications",
        "Additional business consideration",
        "Further relevant insight"
      ]
    },
    // ... 5 more categories
  ]
}
\`\`\`

## Quality Standards

✅ **Professional**: "Visibility limitations may present governance challenges"
✅ **Specific**: Reference evaluation findings, not generic statements
✅ **Strategic**: Explain business implications and strategic considerations
✅ **Consistent**: Maintain formal tone throughout

✅ **Use business language**: "considerations", "opportunities", "strategic implications"
✅ **Objective framing**: "presents challenges" rather than "is a problem"
✅ **Evidence-based**: Ground analysis in user responses and research findings

❌ **NO overly casual language**: Avoid colloquialisms
❌ **NO inflammatory statements**: Maintain diplomatic tone
❌ **NO speculation**: Base analysis on provided data only`;

/**
 * Build synthesis prompt for Cons/Pros/Extended sections (Corporate voice)
 * Feature: 004-analytical-report-format
 */
export function buildCorporateSynthesisPrompt(
  vendorName: string,
  evaluationDate: string,
  completionStatus: string,
  categoryAnalyses: any[],
  researchFindings: any[],
  userNotes: Record<string, string>
): string {
  let prompt = `# Generate Executive Strategic Assessment\n\n`;
  prompt += `**Vendor Under Evaluation**: ${vendorName}\n`;
  prompt += `**Assessment Date**: ${evaluationDate}\n`;
  prompt += `**Completion Status**: ${completionStatus}\n\n`;

  // Add category analyses summary
  prompt += `## Category Assessment Summary\n\n`;
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
    prompt += `## Evaluator Commentary (Additional Context)\n\n`;
    noteEntries.forEach(([key, note]) => {
      prompt += `- ${note}\n`;
    });
    prompt += `\n`;
  }

  prompt += `## Report Generation Requirements\n\n`;
  prompt += `Generate an executive-level strategic assessment with three analytical sections:\n\n`;

  prompt += `### 1. CONSIDERATIONS (Areas Requiring Attention)\n`;
  prompt += `Synthesize findings across ALL 6 categories that warrant careful consideration.\n`;
  prompt += `Use framework-aligned classification:\n`;
  prompt += `- See: Limited transparency/visibility → governance and audit considerations\n`;
  prompt += `- Change: Customization constraints → workflow adaptation requirements\n`;
  prompt += `- Use: Implementation complexity → adoption timeline and training considerations\n`;
  prompt += `- Adapt: Integration limitations → technical architecture implications\n`;
  prompt += `- Leave: Data portability considerations → strategic risk management\n`;
  prompt += `- Learn: Knowledge transfer requirements → organizational capability building\n\n`;
  prompt += `Explain strategic implications for each consideration:\n`;
  prompt += `- Limited transparency → oversight and compliance requirements\n`;
  prompt += `- Customization constraints → process adaptation needs\n`;
  prompt += `- Implementation complexity → resource allocation and timeline planning\n`;
  prompt += `- Integration limitations → technical infrastructure assessment\n`;
  prompt += `- Data portability → vendor relationship and exit strategy planning\n`;
  prompt += `- Knowledge transfer → capability development and succession planning\n\n`;
  prompt += `Format as Markdown. Use professional business language. Frame diplomatically.\n\n`;

  prompt += `### 2. STRENGTHS (Strategic Advantages)\n`;
  prompt += `Synthesize positive findings across ALL 6 categories that represent strategic value.\n`;
  prompt += `Use framework-aligned classification:\n`;
  prompt += `- See: Transparency/visibility → governance enablement\n`;
  prompt += `- Change: Customization flexibility → strategic alignment\n`;
  prompt += `- Use: Implementation simplicity → accelerated value realization\n`;
  prompt += `- Adapt: Integration capabilities → technical ecosystem benefits\n`;
  prompt += `- Leave: Data portability → strategic flexibility\n`;
  prompt += `- Learn: Knowledge transferability → organizational resilience\n\n`;
  prompt += `Explain strategic value and business benefits:\n`;
  prompt += `- Transparency → effective governance and compliance assurance\n`;
  prompt += `- Customization flexibility → organizational alignment and efficiency\n`;
  prompt += `- Implementation simplicity → rapid deployment and adoption\n`;
  prompt += `- Integration capabilities → seamless ecosystem connectivity\n`;
  prompt += `- Data portability → strategic risk mitigation and vendor management\n`;
  prompt += `- Knowledge transferability → sustainable capability development\n\n`;
  prompt += `Format as Markdown. Use professional business language. Emphasize strategic value.\n\n`;

  prompt += `### 3. STRATEGIC ANALYSIS (Balanced Assessment)\n`;
  prompt += `Present balanced analysis of considerations and strengths WITHOUT providing prescriptive recommendations.\n`;
  prompt += `Address:\n`;
  prompt += `- Strategic trade-offs and organizational priorities that influence decision-making\n`;
  prompt += `- Evaluator commentary that provides additional strategic context (if provided)\n`;
  prompt += `- Research findings that warrant further investigation (if identified)\n`;
  prompt += `- Organizational factors and strategic objectives that should inform the decision\n\n`;
  prompt += `DO NOT provide direct recommendations such as "recommend proceeding" or "suggest avoiding" - maintain analytical objectivity.\n`;
  prompt += `Format as Markdown. Use professional "Corporate" voice: formal, diplomatic, strategically focused.\n\n`;

  prompt += `## Output Specification\n\n`;
  prompt += `Return ONLY valid JSON (no markdown code blocks, no explanatory text):\n\n`;
  prompt += `\`\`\`json\n`;
  prompt += `{\n`;
  prompt += `  "headline": "Professional 1-2 sentence executive summary (Corporate voice)",\n`;
  prompt += `  "cons": "Markdown: synthesized considerations with strategic implications",\n`;
  prompt += `  "pros": "Markdown: synthesized strengths with strategic value",\n`;
  prompt += `  "extended": "Markdown: balanced strategic analysis without prescriptive recommendations"\n`;
  prompt += `}\n`;
  prompt += `\`\`\`\n\n`;
  prompt += `Maintain professional, diplomatic "Corporate" language throughout. Focus on strategic implications and organizational considerations.`;

  return prompt;
}

/**
 * Original prompt builder for category analyses
 * Feature: 003-ai-report-generation
 */
export function buildCorporatePrompt(
  vendorName: string,
  categoryAnalyses: any[],
  researchFindings: any[]
): string {
  let prompt = `# Generate Professional Evaluation Report\n\n`;
  prompt += `**Vendor Under Evaluation**: ${vendorName}\n\n`;

  // Add user answers summary
  prompt += `## Evaluation Response Summary\n\n`;
  categoryAnalyses.forEach((analysis) => {
    prompt += `**${analysis.categoryName}** (Assessment Grade: ${analysis.grade})\n`;
    prompt += `- Affirmative Responses: ${analysis.yesCount}\n`;
    prompt += `- Negative Responses: ${analysis.noCount}\n`;
    prompt += `- Insufficient Information: ${analysis.unknownCount}\n`;
    prompt += `- Total Assessment Questions: ${analysis.totalQuestions}\n\n`;
  });

  // Add research findings if available
  if (researchFindings.length > 0) {
    prompt += `## External Research Findings\n\n`;
    researchFindings.forEach((finding) => {
      prompt += `**[${finding.categoryKey.toUpperCase()}] ${finding.topic}**\n`;
      prompt += `Research Confidence Level: ${finding.confidence}\n`;
      prompt += `${finding.finding}\n\n`;
      if (finding.sources.length > 0) {
        prompt += `Supporting Sources:\n`;
        finding.sources.forEach((source: any) => {
          prompt += `- ${source.title} (${source.url})\n`;
        });
        prompt += `\n`;
      }
    });
  }

  prompt += `## Report Generation Requirements\n\n`;
  prompt += `Generate a professional, corporate-appropriate evaluation report with:\n`;
  prompt += `1. **Executive Headline**: Professional summary with strategic recommendation (1-2 sentences)\n`;
  prompt += `2. **Category Analyses**: Professional analysis and strategic insights for each of the 6 evaluation categories\n\n`;
  prompt += `Maintain formal business language throughout. Present findings objectively and diplomatically.\n\n`;
  prompt += `Return ONLY valid JSON matching the specified format.`;

  return prompt;
}

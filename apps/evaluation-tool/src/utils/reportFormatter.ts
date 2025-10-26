// Report formatter utility for display and export
// Feature: 003-ai-report-generation

import type { GeneratedReport, CategoryAnalysis, ResearchFinding } from '@shared/types/report';

export class ReportFormatter {
  /**
   * Format report as plain text
   */
  toPlainText(report: GeneratedReport): string {
    let text = '';

    // Header
    text += `VENDOR EVALUATION REPORT\n`;
    text += `${'='.repeat(60)}\n\n`;
    text += `Vendor: ${report.vendorName}\n`;
    text += `Generated: ${new Date(report.generatedAt).toLocaleString()}\n`;
    text += `Voice Mode: ${report.voiceMode === 'no-bs' ? 'No BS' : 'Corporate'}\n\n`;

    // Partial evaluation warning
    if (report.isPartial) {
      text += `⚠️  WARNING: Partial Evaluation\n`;
      text += `This report is based on incomplete answers. ${report.completionStatus || 'Not all questions were answered'}.\n\n`;
    }

    // Headline
    text += `HEADLINE\n`;
    text += `${'-'.repeat(60)}\n`;
    text += `${report.headline}\n\n`;

    // Cons (if exists - analytical format)
    if (report.cons) {
      text += `CONS (Why Concerning)\n`;
      text += `${'-'.repeat(60)}\n`;
      text += `${report.cons}\n\n`;
    }

    // Pros (if exists - analytical format)
    if (report.pros) {
      text += `PROS (Why They Matter)\n`;
      text += `${'-'.repeat(60)}\n`;
      text += `${report.pros}\n\n`;
    }

    // Extended (if exists - analytical format)
    if (report.extended) {
      text += `EXTENDED ANALYSIS\n`;
      text += `${'-'.repeat(60)}\n`;
      text += `${report.extended}\n\n`;
    }

    // Category analyses (now supporting detail)
    text += `SUPPORTING DETAIL: CATEGORY ANALYSES\n`;
    text += `${'-'.repeat(60)}\n\n`;

    report.categoryAnalyses.forEach((analysis, index) => {
      text += this.formatCategoryAnalysis(analysis);
      if (index < report.categoryAnalyses.length - 1) {
        text += `\n${'~'.repeat(60)}\n\n`;
      }
    });

    // Research findings
    if (report.researchFindings.length > 0) {
      text += `\n\nRESEARCH FINDINGS\n`;
      text += `${'-'.repeat(60)}\n\n`;

      report.researchFindings.forEach((finding, index) => {
        text += this.formatResearchFinding(finding);
        if (index < report.researchFindings.length - 1) {
          text += `\n`;
        }
      });
    }

    // Metadata
    text += `\n\nREPORT METADATA\n`;
    text += `${'-'.repeat(60)}\n`;
    text += `Generation Time: ${(report.metadata.generationDurationMs / 1000).toFixed(2)}s\n`;
    text += `Claude Tokens Used: ${report.metadata.claudeTokensUsed.toLocaleString()}\n`;
    text += `Research Queries: ${report.metadata.researchQueriesPerformed} (${report.metadata.researchCacheHits} from cache)\n`;

    if (report.metadata.warnings.length > 0) {
      text += `\nWarnings:\n`;
      report.metadata.warnings.forEach(warning => {
        text += `  - ${warning}\n`;
      });
    }

    return text;
  }

  /**
   * Format category analysis section
   */
  private formatCategoryAnalysis(analysis: CategoryAnalysis): string {
    let text = '';

    text += `${analysis.categoryName.toUpperCase()} - Grade: ${analysis.grade}\n`;
    text += `Answers: ${analysis.userAnswerSummary}\n\n`;
    text += `${analysis.analysisText}\n\n`;

    if (analysis.keyInsights.length > 0) {
      text += `Key Insights:\n`;
      analysis.keyInsights.forEach(insight => {
        text += `  • ${insight}\n`;
      });
    }

    return text;
  }

  /**
   * Format research finding
   */
  private formatResearchFinding(finding: ResearchFinding): string {
    let text = '';

    text += `[${finding.categoryKey.toUpperCase()}] ${finding.topic}\n`;
    text += `Confidence: ${finding.confidence.toUpperCase()}\n\n`;
    text += `${finding.finding}\n\n`;

    if (finding.sources.length > 0) {
      text += `Sources:\n`;
      finding.sources.forEach((source, index) => {
        text += `  ${index + 1}. ${source.title}\n`;
        text += `     ${source.url}\n`;
        if (source.snippet) {
          text += `     "${source.snippet}"\n`;
        }
        text += `\n`;
      });
    }

    return text;
  }

  /**
   * Format report as Markdown
   */
  toMarkdown(report: GeneratedReport): string {
    let md = '';

    // Header
    md += `# Vendor Evaluation Report: ${report.vendorName}\n\n`;
    md += `**Generated**: ${new Date(report.generatedAt).toLocaleString()}  \n`;
    md += `**Voice Mode**: ${report.voiceMode === 'no-bs' ? 'No BS' : 'Corporate'}  \n\n`;

    // Partial evaluation warning
    if (report.isPartial) {
      md += `> ⚠️ **WARNING: Partial Evaluation**  \n`;
      md += `> This report is based on incomplete answers. ${report.completionStatus || 'Not all questions were answered'}.\n\n`;
    }

    // Headline
    md += `## Headline\n\n`;
    md += `${report.headline}\n\n`;

    // Cons (if exists - analytical format)
    if (report.cons) {
      md += `## Cons (Why Concerning)\n\n`;
      md += `${report.cons}\n\n`;
    }

    // Pros (if exists - analytical format)
    if (report.pros) {
      md += `## Pros (Why They Matter)\n\n`;
      md += `${report.pros}\n\n`;
    }

    // Extended (if exists - analytical format)
    if (report.extended) {
      md += `## Extended Analysis\n\n`;
      md += `${report.extended}\n\n`;
    }

    // Category analyses (now supporting detail)
    md += `## Supporting Detail: Category Analyses\n\n`;

    report.categoryAnalyses.forEach(analysis => {
      md += this.formatCategoryAnalysisMarkdown(analysis);
      md += `\n`;
    });

    // Research findings
    if (report.researchFindings.length > 0) {
      md += `## Research Findings\n\n`;

      report.researchFindings.forEach(finding => {
        md += this.formatResearchFindingMarkdown(finding);
        md += `\n`;
      });
    }

    // Metadata
    md += `## Report Metadata\n\n`;
    md += `- **Generation Time**: ${(report.metadata.generationDurationMs / 1000).toFixed(2)}s\n`;
    md += `- **Claude Tokens Used**: ${report.metadata.claudeTokensUsed.toLocaleString()}\n`;
    md += `- **Research Queries**: ${report.metadata.researchQueriesPerformed} (${report.metadata.researchCacheHits} from cache)\n\n`;

    if (report.metadata.warnings.length > 0) {
      md += `### Warnings\n\n`;
      report.metadata.warnings.forEach(warning => {
        md += `- ${warning}\n`;
      });
      md += `\n`;
    }

    return md;
  }

  /**
   * Format category analysis as Markdown
   */
  private formatCategoryAnalysisMarkdown(analysis: CategoryAnalysis): string {
    let md = '';

    md += `### ${analysis.categoryName} — Grade: ${analysis.grade}\n\n`;
    md += `**Answers**: ${analysis.userAnswerSummary}\n\n`;
    md += `${analysis.analysisText}\n\n`;

    if (analysis.keyInsights.length > 0) {
      md += `**Key Insights**:\n\n`;
      analysis.keyInsights.forEach(insight => {
        md += `- ${insight}\n`;
      });
      md += `\n`;
    }

    return md;
  }

  /**
   * Format research finding as Markdown
   */
  private formatResearchFindingMarkdown(finding: ResearchFinding): string {
    let md = '';

    md += `### [${finding.categoryKey.toUpperCase()}] ${finding.topic}\n\n`;
    md += `**Confidence**: ${finding.confidence.toUpperCase()}\n\n`;
    md += `${finding.finding}\n\n`;

    if (finding.sources.length > 0) {
      md += `**Sources**:\n\n`;
      finding.sources.forEach((source, index) => {
        md += `${index + 1}. [${source.title}](${source.url})`;
        if (source.publishedDate) {
          md += ` (${source.publishedDate})`;
        }
        md += `\n`;
        if (source.snippet) {
          md += `   > "${source.snippet}"\n\n`;
        }
      });
    }

    return md;
  }

  /**
   * Format report summary (one-liner)
   */
  toSummary(report: GeneratedReport): string {
    const gradeEmoji = (grade: string) => {
      switch (grade) {
        case 'A': return '🟢';
        case 'B': return '🟢';
        case 'C': return '🟡';
        case 'D': return '🔴';
        case 'F': return '🔴';
        default: return '⚪';
      }
    };

    const grades = report.categoryAnalyses
      .map(a => `${gradeEmoji(a.grade)} ${a.categoryKey}`)
      .join(' | ');

    return `${report.vendorName}: ${grades}`;
  }
}

export const reportFormatter = new ReportFormatter();

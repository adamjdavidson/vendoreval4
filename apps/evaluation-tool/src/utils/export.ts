/**
 * Markdown Export Utilities
 *
 * Functions for generating and downloading evaluation reports as Markdown
 */

import type { Evaluation, Category, Question } from "@shared/types";
import type { VoiceMode } from '../contexts/ToneContext';

/**
 * Generate Markdown content from evaluation data
 */
export function generateMarkdown(
  evaluation: Evaluation,
  categories: Category[],
  questions: Question[],
  voiceMode: VoiceMode
): string {
  const lines: string[] = [];

  // Header
  lines.push(`# ${evaluation.vendor_name} Evaluation`);
  lines.push('');
  lines.push(`**Evaluation Date:** ${new Date(evaluation.created_at).toLocaleDateString()}`);
  lines.push(`**Completion:** ${evaluation.answers.length}/${questions.length} questions answered`);
  lines.push('');
  lines.push('---');
  lines.push('');

  // Group questions by category
  const questionsByCategory = new Map<string, Question[]>();
  questions.forEach((q) => {
    const existing = questionsByCategory.get(q.category_id) || [];
    questionsByCategory.set(q.category_id, [...existing, q]);
  });

  // Build answer map for O(1) lookup
  const answerMap = new Map(evaluation.answers.map((a) => [a.question_id, a]));

  // Iterate through categories in order
  categories.forEach((category) => {
    const categoryQuestions = questionsByCategory.get(category.id) || [];

    // Category header (tone-aware)
    const title = voiceMode === 'no-bs' ? category.title_no_bs : category.title_corporate;
    const subtitle = voiceMode === 'no-bs' ? category.subtitle_no_bs : category.subtitle_corporate;

    lines.push(`## ${title}`);
    lines.push('');
    lines.push(`*${subtitle}*`);
    lines.push('');

    // Questions in this category
    categoryQuestions.forEach((question) => {
      const answer = answerMap.get(question.id);
      const text = voiceMode === 'no-bs' ? question.text_no_bs : question.text_corporate;

      lines.push(`### ${text}`);

      // Critical question badge
      if (question.is_critical) {
        lines.push('');
        lines.push('🚨 **Critical Question**');
      }

      // Answer and notes
      if (answer && answer.answer) {
        lines.push('');
        lines.push(`**Answer:** ${formatAnswer(answer.answer)}`);

        if (answer.notes) {
          lines.push('');
          lines.push(`**Notes:** ${answer.notes}`);
        }
      } else {
        lines.push('');
        lines.push('**Answer:** Not answered');
      }

      lines.push('');
      lines.push('---');
      lines.push('');
    });
  });

  // Footer
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('*Generated with VendorEval - AI Vendor Evaluation Framework*');

  return lines.join('\n');
}

/**
 * Format answer value with emoji
 */
export function formatAnswer(answer: string): string {
  const formatted: Record<string, string> = {
    yes: '✅ Yes',
    no: '❌ No',
    'not-enough-info': '⚠️ Not Enough Info',
  };
  return formatted[answer] || answer;
}

/**
 * Generate safe filename from vendor name
 */
export function generateFilename(vendorName: string): string {
  const safe = vendorName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  const date = new Date().toISOString().split('T')[0];
  return `${safe}-evaluation-${date}.md`;
}

/**
 * Download markdown content as file
 */
export function downloadMarkdown(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

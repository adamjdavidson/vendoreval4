/**
 * ExportButton Component
 *
 * Generates and downloads evaluation as Markdown file
 */

import { Download } from 'lucide-react';
import { useTone } from '../../hooks/useTone';
import { generateMarkdown, generateFilename, downloadMarkdown } from '../../utils/export';
import type { Evaluation, Category, Question } from "@shared/types";

interface ExportButtonProps {
  evaluation: Evaluation;
  categories: Category[];
  questions: Question[];
  disabled?: boolean;
}

export function ExportButton({
  evaluation,
  categories,
  questions,
  disabled = false,
}: ExportButtonProps) {
  const { voiceMode } = useTone();

  const handleExport = () => {
    const markdown = generateMarkdown(evaluation, categories, questions, voiceMode);
    const filename = generateFilename(evaluation.vendor_name);
    downloadMarkdown(markdown, filename);
  };

  return (
    <button
      onClick={handleExport}
      disabled={disabled}
      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
      aria-label="Export evaluation as Markdown"
    >
      <Download size={18} />
      <span className="font-medium">Export as Markdown</span>
    </button>
  );
}

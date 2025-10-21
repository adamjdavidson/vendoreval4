/**
 * CategoryBox Component
 *
 * Displays a category card with grade color, progress, and description.
 *
 * @version 1.0.0
 */

import type { Category } from "@shared/types";
import type { Grade } from '../../utils/grading';
import { useTone } from '../../hooks/useTone';
import { getGradeExplanation } from '../../utils/grading';

interface CategoryBoxProps {
  category: Category;
  grade: Grade;
  explanation?: string;
}

// Border colors based on grade (for indicating status)
const gradeBorderColors: Record<string, string> = {
  A: 'border-green-600',
  B: 'border-blue-600',
  C: 'border-yellow-600',
  D: 'border-orange-600',
  F: 'border-red-600',
  null: 'border-gray-300',
};

export function CategoryBox({ category, grade, explanation }: CategoryBoxProps) {
  const { voiceMode } = useTone();
  const gradeKey = grade || 'null';
  const borderColor = gradeBorderColors[gradeKey];

  // Select text based on voice mode
  const title = voiceMode === 'no-bs' ? category.title_no_bs : category.title_corporate;
  const subtitle = voiceMode === 'no-bs' ? category.subtitle_no_bs : category.subtitle_corporate;

  // Get explanation if not provided
  const gradeExplanation = explanation || getGradeExplanation(category.key, grade, voiceMode);

  // Use the category's unique background color
  const boxClasses = `border-2 ${borderColor} rounded-lg p-6 shadow-sm transition`;
  const boxStyle = { backgroundColor: category.color };

  return (
    <div className={boxClasses} style={boxStyle} data-testid="category-box">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
        <p className="text-sm font-medium text-gray-700 mt-1">{subtitle}</p>
      </div>

      {/* Grade and Explanation */}
      {grade && gradeExplanation && (
        <div className="mt-4 pt-4 border-t border-gray-300">
          <p className="text-base text-gray-800">
            <span className="font-bold text-xl">{grade}:</span> {gradeExplanation}
          </p>
        </div>
      )}
    </div>
  );
}

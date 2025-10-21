/**
 * OverallAssessment Component
 *
 * Displays overall evaluation grade with summary.
 *
 * @version 1.0.0
 */

import type { CategoryGrade } from "@shared/types";

interface OverallAssessmentProps {
  overallGrade: CategoryGrade;
  completionPercentage: number;
}

const gradeLabels: Record<Exclude<CategoryGrade, null>, string> = {
  green: 'Recommended',
  yellow: 'Recommended with Reservations',
  red: 'Not Recommended',
  grey: 'Insufficient Information',
};

const gradeColors: Record<Exclude<CategoryGrade, null>, string> = {
  green: 'bg-green-100 border-green-500 text-green-900',
  yellow: 'bg-yellow-100 border-yellow-500 text-yellow-900',
  red: 'bg-red-100 border-red-500 text-red-900',
  grey: 'bg-gray-100 border-gray-500 text-gray-900',
};

export function OverallAssessment({ overallGrade, completionPercentage }: OverallAssessmentProps) {
  if (!overallGrade) {
    return (
      <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Overall Assessment</h3>
        <p className="text-gray-600">
          Complete more questions to receive an overall assessment. ({completionPercentage}%
          complete)
        </p>
      </div>
    );
  }

  const gradeLabel = gradeLabels[overallGrade];
  const gradeColor = gradeColors[overallGrade];

  return (
    <div className={`border-2 rounded-lg p-6 ${gradeColor}`}>
      <h3 className="text-xl font-bold mb-2">Overall Assessment</h3>
      <p className="text-2xl font-extrabold mb-4">{gradeLabel}</p>
      <p className="text-sm">
        Based on {completionPercentage}% of evaluation criteria. Complete all questions for the
        most accurate assessment.
      </p>
    </div>
  );
}

/**
 * AnswerButtons Component
 *
 * Yes/No/Not-Enough-Info answer buttons for questions.
 *
 * @version 1.0.0
 */

import type { AnswerValue } from "@shared/types";

interface AnswerButtonsProps {
  value: AnswerValue;
  onChange: (value: AnswerValue) => void;
}

const answerOptions: { value: AnswerValue; label: string }[] = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
  { value: 'not-enough-info', label: 'Not Enough Info' },
];

export function AnswerButtons({ value, onChange }: AnswerButtonsProps) {
  const getButtonClasses = (answerValue: AnswerValue) => {
    const isSelected = value === answerValue;
    const baseClasses =
      'px-4 py-2 rounded-lg font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2';

    if (answerValue === 'yes') {
      return isSelected
        ? `${baseClasses} bg-green-600 text-white focus:ring-green-500`
        : `${baseClasses} bg-gray-100 text-gray-700 hover:bg-green-100 focus:ring-green-500`;
    }

    if (answerValue === 'no') {
      return isSelected
        ? `${baseClasses} bg-red-600 text-white focus:ring-red-500`
        : `${baseClasses} bg-gray-100 text-gray-700 hover:bg-red-100 focus:ring-red-500`;
    }

    // not-enough-info
    return isSelected
      ? `${baseClasses} bg-gray-600 text-white focus:ring-gray-500`
      : `${baseClasses} bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500`;
  };

  return (
    <div className="flex gap-3">
      {answerOptions.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={getButtonClasses(option.value)}
          aria-label={`Answer: ${option.label}`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

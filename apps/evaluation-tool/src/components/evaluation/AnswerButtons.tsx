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

const answerOptions: { value: AnswerValue; label: string; emoji: string; description: string }[] = [
  { value: 'yes', label: 'Yes', emoji: '✅', description: 'Full capability available' },
  { value: 'limited', label: 'Limited', emoji: '⚠️', description: 'Partial or restricted capability' },
  { value: 'no', label: 'No', emoji: '❌', description: 'Not available' },
  { value: 'not-enough-info', label: "Don't Know", emoji: '❓', description: 'Insufficient information' },
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

    if (answerValue === 'limited') {
      return isSelected
        ? `${baseClasses} bg-yellow-600 text-white focus:ring-yellow-500`
        : `${baseClasses} bg-gray-100 text-gray-700 hover:bg-yellow-100 focus:ring-yellow-500`;
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
    <div className="space-y-3">
      {/* Answer Buttons */}
      <div className="flex gap-3 flex-wrap">
        {answerOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={getButtonClasses(option.value)}
            aria-label={`Answer: ${option.label}`}
            title={option.description}
          >
            <span className="mr-2">{option.emoji}</span>
            {option.label}
          </button>
        ))}
      </div>

      {/* Answer Descriptions */}
      <div className="text-xs text-gray-600 bg-gray-50 rounded-md p-3">
        <div className="grid grid-cols-2 gap-2">
          {answerOptions.map((option) => (
            <div key={option.value} className="flex items-start">
              <span className="mr-2 text-base">{option.emoji}</span>
              <div>
                <span className="font-medium">{option.label}:</span>{' '}
                <span>{option.description}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

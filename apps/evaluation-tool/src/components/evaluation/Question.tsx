/**
 * Question Component
 *
 * Displays a single evaluation question with answer buttons and optional note.
 *
 * @version 1.0.0
 */

import { useState } from 'react';
import { Check, X, HelpCircle } from 'lucide-react';
import type { Question as QuestionType, AnswerValue } from "@shared/types";
import { useTone } from '../../hooks/useTone';
import { HelpIcon } from '../shared/HelpIcon';

interface QuestionProps {
  question: QuestionType;
  value: AnswerValue;
  note?: string;
  onChange: (value: AnswerValue) => void;
  onNoteChange?: (note: string) => void;
}

const answerOptions: { value: AnswerValue; label: string; icon: typeof Check }[] = [
  { value: 'yes', label: 'Yes', icon: Check },
  { value: 'no', label: 'No', icon: X },
  { value: 'not-enough-info', label: 'Not Enough Info', icon: HelpCircle },
];

export function Question({
  question,
  value,
  note = '',
  onChange,
  onNoteChange,
}: QuestionProps) {
  const [showNotes, setShowNotes] = useState(!!note);
  const { voiceMode } = useTone();

  const getIconButtonClasses = (answerValue: AnswerValue) => {
    const isSelected = value === answerValue;
    const baseClasses =
      'w-6 h-6 rounded-full flex items-center justify-center transition focus:outline-none focus:ring-1 focus:ring-offset-1 border';

    if (answerValue === 'yes') {
      return isSelected
        ? `${baseClasses} bg-green-600 border-green-600 text-white focus:ring-green-500`
        : `${baseClasses} border-gray-300 text-gray-400 hover:border-green-500 hover:text-green-600 focus:ring-green-500`;
    }

    if (answerValue === 'no') {
      return isSelected
        ? `${baseClasses} bg-red-600 border-red-600 text-white focus:ring-red-500`
        : `${baseClasses} border-gray-300 text-gray-400 hover:border-red-500 hover:text-red-600 focus:ring-red-500`;
    }

    // not-enough-info
    return isSelected
      ? `${baseClasses} bg-gray-600 border-gray-600 text-white focus:ring-gray-500`
      : `${baseClasses} border-gray-300 text-gray-400 hover:border-gray-500 hover:text-gray-600 focus:ring-gray-500`;
  };

  // Select text based on voice mode
  const questionText = voiceMode === 'no-bs' ? question.text_no_bs : question.text_corporate;
  const helpText = voiceMode === 'no-bs' ? question.help_text_no_bs : question.help_text_corporate;

  return (
    <div className="bg-white/50 border border-gray-200 rounded p-2" data-question-key={question.key}>
      {/* Question with Icons and Critical Badge */}
      <div className="flex items-center gap-2">
        <p className="text-sm font-medium text-gray-900 flex-1">
          {questionText}
          {helpText && <HelpIcon helpText={helpText} questionText={questionText} />}
        </p>

        {/* Answer Icons on the right */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {answerOptions.map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.value}
                onClick={() => onChange(option.value)}
                className={getIconButtonClasses(option.value)}
                aria-label={`Answer: ${option.label}`}
                title={option.label}
                data-answer={option.value}
                data-active={value === option.value}
              >
                <Icon size={14} strokeWidth={2.5} />
              </button>
            );
          })}
        </div>

        {question.is_critical && (
          <span
            className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-semibold rounded flex-shrink-0"
            data-critical="true"
          >
            Critical
          </span>
        )}
      </div>

      {/* Collapsible Notes */}
      {onNoteChange !== undefined && (
        <div className="mt-1">
          <button
            onClick={() => setShowNotes(!showNotes)}
            className="text-xs text-gray-600 hover:text-gray-900 underline focus:outline-none"
          >
            {showNotes ? '− hide notes' : '+ add notes'}
          </button>
          {showNotes && (
            <textarea
              id={`note-${question.id}`}
              value={note}
              onChange={(e) => onNoteChange(e.target.value)}
              className="w-full mt-1 px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
              rows={2}
              placeholder="Add notes..."
            />
          )}
        </div>
      )}
    </div>
  );
}

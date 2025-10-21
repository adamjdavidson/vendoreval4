/**
 * HelpIcon Component
 *
 * Shows an info icon (ℹ️) that displays help text in a modal overlay
 */

import { useState } from 'react';
import { Info, X } from 'lucide-react';

interface HelpIconProps {
  helpText: string;
  questionText: string;
}

export function HelpIcon({ helpText, questionText }: HelpIconProps) {
  const [showModal, setShowModal] = useState(false);

  if (!helpText) return null;

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="inline-flex items-center justify-center w-5 h-5 ml-2 text-blue-600 hover:text-blue-800 transition-colors"
        aria-label="Show help"
        type="button"
      >
        <Info size={18} />
      </button>

      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-labelledby="help-modal-title"
            aria-modal="true"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-start justify-between">
              <h3 id="help-modal-title" className="text-lg font-bold text-gray-900 pr-8">
                {questionText}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded hover:bg-gray-100 transition flex-shrink-0"
                aria-label="Close help"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Help Text Content */}
            <div className="p-6">
              <div className="prose prose-sm max-w-none">
                {helpText.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-4 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

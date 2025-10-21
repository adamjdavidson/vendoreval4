/**
 * HelpModal Component
 *
 * Help dialog explaining the evaluation framework.
 *
 * @version 1.0.0
 */

import { Modal } from '../shared/Modal';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HelpModal({ isOpen, onClose }: HelpModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Evaluation Framework Guide">
      <div className="space-y-4">
        <div>
          <h3 className="font-bold text-gray-900 mb-2">How to Answer Questions</h3>
          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
            <li>
              <strong>Yes:</strong> The vendor provides this capability clearly and effectively
            </li>
            <li>
              <strong>No:</strong> The vendor does not provide this capability or it's severely
              limited
            </li>
            <li>
              <strong>Not Enough Info:</strong> Insufficient information to make a determination
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-gray-900 mb-2">Grading System</h3>
          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
            <li>
              <strong className="text-green-600">Green:</strong> Majority of questions answered
              "Yes"
            </li>
            <li>
              <strong className="text-yellow-600">Yellow:</strong> Mixed responses or majority
              "Yes" with some concerns
            </li>
            <li>
              <strong className="text-red-600">Red:</strong> Critical question answered "No" or
              majority "No"
            </li>
            <li>
              <strong className="text-gray-600">Grey:</strong> Majority "Not Enough Info"
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-gray-900 mb-2">Critical Questions</h3>
          <p className="text-sm text-gray-700">
            Questions marked as "Critical" are essential for the category. A "No" answer to any
            critical question automatically grades the category as RED, indicating a significant
            concern.
          </p>
        </div>

        <div>
          <h3 className="font-bold text-gray-900 mb-2">Voice Modes</h3>
          <p className="text-sm text-gray-700">
            Toggle between "Direct" and "Suitable for Work" modes to see explanations in different
            tones. Both provide the same information with different levels of directness.
          </p>
        </div>
      </div>
    </Modal>
  );
}

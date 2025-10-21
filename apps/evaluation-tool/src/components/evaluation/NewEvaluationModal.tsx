/**
 * NewEvaluationModal Component
 *
 * Modal for creating a new vendor evaluation
 */

import { useState } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { databaseService } from '../../services/database';

interface NewEvaluationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (evaluationId: string) => void;
}

export function NewEvaluationModal({
  isOpen,
  onClose,
  onSuccess,
}: NewEvaluationModalProps) {
  const { user } = useAuth();
  const [vendorName, setVendorName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!vendorName.trim()) {
      setError('Please enter a vendor name');
      return;
    }

    if (!user) {
      setError('You must be logged in to create an evaluation');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const evaluation = await databaseService.createEvaluation(
        user.id,
        vendorName.trim()
      );

      setVendorName('');
      onSuccess(evaluation.id);
      onClose();
    } catch (err) {
      console.error('Failed to create evaluation:', err);
      setError('Failed to create evaluation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setVendorName('');
      setError(null);
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="modal-title"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 id="modal-title" className="text-xl font-bold text-gray-900">
            Start New Evaluation
          </h2>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="p-1 rounded hover:bg-gray-100 disabled:cursor-not-allowed transition"
            aria-label="Close modal"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label
              htmlFor="vendor-name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Vendor Name
            </label>
            <input
              id="vendor-name"
              type="text"
              value={vendorName}
              onChange={(e) => setVendorName(e.target.value)}
              placeholder="e.g., OpenAI, Anthropic, Cohere"
              disabled={isSubmitting}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              autoFocus
            />
            <p className="mt-1 text-sm text-gray-500">
              Enter the name of the AI vendor you want to evaluate
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 disabled:cursor-not-allowed transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !vendorName.trim()}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
            >
              {isSubmitting ? 'Creating...' : 'Start Evaluation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

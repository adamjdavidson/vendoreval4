/**
 * EvaluationList Component
 *
 * Displays user's evaluations with completion status
 */

import { useState, useEffect } from 'react';
import { FileText, Trash2, ChevronRight } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { databaseService } from '../../services/database';
import type { Evaluation } from "@shared/types";

interface EvaluationListProps {
  onSelect: (evaluationId: string) => void;
  onRefresh?: () => void;
}

export function EvaluationList({ onSelect, onRefresh }: EvaluationListProps) {
  const { user } = useAuth();
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    loadEvaluations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const loadEvaluations = async () => {
    if (!user) {
      setEvaluations([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await databaseService.getUserEvaluations(user.id);
      setEvaluations(data as unknown as Evaluation[]);
    } catch (err) {
      console.error('Failed to load evaluations:', err);
      setError('Failed to load evaluations');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (evaluationId: string, vendorName: string) => {
    if (
      !confirm(
        `Are you sure you want to delete the evaluation for ${vendorName}?`
      )
    ) {
      return;
    }

    setDeletingId(evaluationId);

    try {
      await databaseService.deleteEvaluation(evaluationId);
      setEvaluations((prev) => prev.filter((e) => e.id !== evaluationId));

      if (onRefresh) {
        onRefresh();
      }
    } catch (err) {
      console.error('Failed to delete evaluation:', err);
      alert('Failed to delete evaluation. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-sm text-red-700">{error}</p>
        <button
          onClick={loadEvaluations}
          className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
        >
          Try again
        </button>
      </div>
    );
  }

  if (evaluations.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText size={48} className="mx-auto text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No evaluations yet
        </h3>
        <p className="text-sm text-gray-600">
          Start your first vendor evaluation to see it here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {evaluations.map((evaluation) => {
        const completion = calculateCompletion(evaluation);
        const isDeleting = deletingId === evaluation.id;

        return (
          <div
            key={evaluation.id}
            className="group relative bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-sm transition"
          >
            <button
              onClick={() => onSelect(evaluation.id)}
              className="w-full text-left"
              disabled={isDeleting}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition">
                  {evaluation.vendor_name}
                </h3>
                <ChevronRight
                  size={20}
                  className="text-gray-400 group-hover:text-blue-600 transition"
                />
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>
                  {completion.answered} / {completion.total} questions
                </span>
                <span className="text-gray-400">•</span>
                <span>{completion.percentage}% complete</span>
                <span className="text-gray-400">•</span>
                <span>
                  {new Date(evaluation.updated_at).toLocaleDateString()}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="mt-3 w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-blue-600 h-full transition-all duration-300"
                  style={{ width: `${completion.percentage}%` }}
                />
              </div>
            </button>

            {/* Delete Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(evaluation.id, evaluation.vendor_name);
              }}
              disabled={isDeleting}
              className="absolute top-4 right-4 p-1.5 rounded hover:bg-red-50 disabled:cursor-not-allowed transition opacity-0 group-hover:opacity-100"
              aria-label="Delete evaluation"
            >
              {isDeleting ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600" />
              ) : (
                <Trash2 size={16} className="text-gray-400 hover:text-red-600" />
              )}
            </button>
          </div>
        );
      })}
    </div>
  );
}

/**
 * Calculate evaluation completion
 */
function calculateCompletion(evaluation: Evaluation) {
  const total = 20; // Total questions in framework
  const answered = evaluation.answers.length;
  const percentage = Math.round((answered / total) * 100);

  return {
    answered,
    total,
    percentage,
  };
}

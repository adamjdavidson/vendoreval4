/**
 * Membership Error Component
 *
 * Displays error message when Discord guild membership is required but not found
 */

import { AlertCircle } from 'lucide-react';

interface MembershipErrorProps {
  onRetry?: () => void;
  showRetryButton?: boolean;
}

export function MembershipError({ onRetry, showRetryButton = true }: MembershipErrorProps) {
  return (
    <div
      className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto"
      role="alert"
      aria-live="assertive"
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <AlertCircle className="h-6 w-6 text-red-600" aria-hidden="true" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-red-900 mb-2">Membership Required</h3>
          <p className="text-sm text-red-800 mb-4">
            You must be a member of our Discord server to access this application. This ensures the
            community remains engaged and aligned with our values.
          </p>
          <div className="space-y-2 text-sm text-red-700">
            <p className="font-medium">To gain access:</p>
            <ol className="list-decimal list-inside space-y-1 ml-2">
              <li>Join our Discord server</li>
              <li>Verify your account</li>
              <li>Return and sign in again</li>
            </ol>
          </div>
          {showRetryButton && onRetry && (
            <div className="mt-4">
              <button
                onClick={onRetry}
                className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

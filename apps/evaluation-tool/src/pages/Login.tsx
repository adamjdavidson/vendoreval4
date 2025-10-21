/**
 * Login Page
 *
 * Authentication page with Discord OAuth
 */

import { useState } from 'react';
import { DiscordButton } from '../components/auth/DiscordButton';
import { MembershipError } from '../components/auth/MembershipError';

export function Login() {
  const [error, setError] = useState<string>('');
  const [showMembershipError, setShowMembershipError] = useState(false);

  const handleSuccess = () => {
    // OAuth redirect will handle navigation
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);

    // Check if error is membership-related
    if (errorMessage.toLowerCase().includes('membership')) {
      setShowMembershipError(true);
    }
  };

  const handleRetry = () => {
    setError('');
    setShowMembershipError(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              AI Vendor Evaluation
            </h1>
            <p className="text-gray-600">
              Sign in to access the evaluation framework
            </p>
          </div>

          {/* Discord Sign In Button */}
          {!showMembershipError && (
            <div className="mb-6">
              <DiscordButton onSuccess={handleSuccess} onError={handleError} />
            </div>
          )}

          {/* Membership Error */}
          {showMembershipError && (
            <div className="mb-6">
              <MembershipError onRetry={handleRetry} />
            </div>
          )}

          {/* General Error Message */}
          {error && !showMembershipError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Info Section */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start gap-2">
                <svg
                  className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p>Discord server membership required</p>
              </div>
              <div className="flex items-start gap-2">
                <svg
                  className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                <p>Your data is stored securely</p>
              </div>
              <div className="flex items-start gap-2">
                <svg
                  className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                <p>Evaluate 20+ AI vendors quickly</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">
              By signing in, you agree to our terms of service
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

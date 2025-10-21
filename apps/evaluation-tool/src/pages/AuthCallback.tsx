/**
 * Auth Callback Page
 *
 * Handles OAuth callback after Discord authentication
 * Verifies guild membership before allowing access
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth';

export function AuthCallback() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'checking' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    handleAuthCallback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAuthCallback = async () => {
    try {
      setStatus('loading');

      // Wait for session to be established
      const session = await authService.getSession();

      if (!session || !session.user) {
        setErrorMessage('No session found. Please try signing in again.');
        setStatus('error');
        setTimeout(() => navigate('/'), 3000);
        return;
      }

      setStatus('checking');

      // Check Discord guild membership
      const isMember = await authService.checkDiscordMembership(session.user.id);

      if (!isMember) {
        // Not a guild member - deny access
        setErrorMessage('Access denied. You must be a member of the Discord server.');
        await authService.signOut();
        setStatus('error');
        setTimeout(() => navigate('/'), 3000);
        return;
      }

      // Initialize login count for periodic re-checks
      if (!localStorage.getItem('discord_login_count')) {
        localStorage.setItem('discord_login_count', '0');
      }

      // Success - redirect to app
      setStatus('success');
      setTimeout(() => navigate('/'), 1000);
    } catch (error) {
      console.error('Auth callback error:', error);
      setErrorMessage(
        error instanceof Error ? error.message : 'Authentication failed. Please try again.'
      );
      setStatus('error');
      setTimeout(() => navigate('/'), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        {status === 'loading' && (
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Authenticating...</h2>
            <p className="text-gray-600">Please wait while we sign you in</p>
          </div>
        )}

        {status === 'checking' && (
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Checking Membership...</h2>
            <p className="text-gray-600">Verifying Discord server membership</p>
          </div>
        )}

        {status === 'success' && (
          <div className="text-center">
            <div className="inline-block mb-4">
              <svg
                className="h-12 w-12 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Success!</h2>
            <p className="text-gray-600">Redirecting to app...</p>
          </div>
        )}

        {status === 'error' && (
          <div className="text-center">
            <div className="inline-block mb-4">
              <svg
                className="h-12 w-12 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Failed</h2>
            <p className="text-gray-600 mb-4">{errorMessage}</p>
            <p className="text-sm text-gray-500">Redirecting to home page...</p>
          </div>
        )}
      </div>
    </div>
  );
}

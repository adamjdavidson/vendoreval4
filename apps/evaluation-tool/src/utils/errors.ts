import { PostgrestError } from '@supabase/supabase-js';

export class AppError extends Error {
  public code?: string;
  public statusCode?: number;

  constructor(
    message: string,
    code?: string,
    statusCode?: number
  ) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
  }
}

/**
 * Parse Supabase error into user-friendly message
 */
export function parseSupabaseError(error: PostgrestError): string {
  // Check for common error codes
  if (error.code === '23505') {
    return 'This record already exists.';
  }
  if (error.code === '23503') {
    return 'Referenced record does not exist.';
  }
  if (error.code === '42501') {
    return 'You do not have permission to perform this action.';
  }

  // Check for RLS policy violations
  if (error.message.includes('policy')) {
    return 'You do not have permission to access this resource.';
  }

  // Default message
  return error.message || 'An unexpected error occurred.';
}

/**
 * Handle async errors and convert to AppError
 */
export async function handleAsyncError<T>(
  fn: () => Promise<T>,
  fallbackMessage = 'An error occurred'
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    if (typeof error === 'object' && error !== null && 'code' in error) {
      const pgError = error as PostgrestError;
      throw new AppError(parseSupabaseError(pgError), pgError.code);
    }

    throw new AppError(fallbackMessage);
  }
}

/**
 * Log error to console and optionally send to monitoring service
 * Set VITE_ENABLE_ERROR_TRACKING=true to enable remote logging
 */
export function logError(error: Error, context?: Record<string, unknown>): void {
  const errorInfo = {
    message: error.message,
    name: error.name,
    stack: error.stack,
    timestamp: new Date().toISOString(),
    url: typeof window !== 'undefined' ? window.location.href : undefined,
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
    ...context,
  };

  // Always log to console in development
  if (import.meta.env.DEV) {
    console.error('Error:', errorInfo);
  }

  // Send to remote monitoring if enabled (e.g., Sentry)
  if (import.meta.env.VITE_ENABLE_ERROR_TRACKING === 'true') {
    sendToMonitoring(errorInfo);
  }
}

/**
 * Send error to monitoring service (placeholder for Sentry integration)
 */
function sendToMonitoring(errorInfo: Record<string, unknown>): void {
  // TODO: Integrate with Sentry or other monitoring service
  // Example:
  // Sentry.captureException(errorInfo);

  // For now, just log that we would send it
  console.info('Would send to monitoring:', errorInfo);
}

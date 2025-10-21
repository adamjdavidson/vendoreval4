/**
 * Email validation
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * URL validation
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate vendor slug (lowercase, alphanumeric + hyphens only)
 */
export function isValidSlug(slug: string): boolean {
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(slug);
}

/**
 * Validate answer value
 */
export function isValidAnswer(
  answer: string
): answer is 'yes' | 'no' | 'not-enough-info' {
  return ['yes', 'no', 'not-enough-info'].includes(answer);
}

/**
 * Validate required field
 */
export function isRequired(value: string | null | undefined): boolean {
  return value !== null && value !== undefined && value.trim() !== '';
}

/**
 * Validate string length
 */
export function isValidLength(
  value: string,
  min: number,
  max: number
): boolean {
  const length = value.trim().length;
  return length >= min && length <= max;
}

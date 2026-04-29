/**
 * VoteSetu Utility Library
 * Core logic for language detection and input validation.
 */

/**
 * Detects if the input string contains Hindi characters.
 * Falls back to English if no Hindi characters are found.
 */
export function detectLanguage(input: string): 'hi' | 'en' {
  const hindiRegex = /[\u0900-\u097F]/;
  return hindiRegex.test(input) ? 'hi' : 'en';
}

/**
 * Validates user input based on length and content.
 * Rejects empty strings and strings exceeding 800 characters.
 */
export function validateInput(input: string): boolean {
  const sanitized = input.trim();
  if (!sanitized) return false;
  if (sanitized.length > 800) return false;
  return true;
}

/**
 * Removes HTML tags from a string to prevent XSS.
 */
export function sanitizeInput(input: string): string {
  return input.replace(/<[^>]*>/g, '').trim();
}

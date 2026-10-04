import DOMPurify from 'dompurify';

/**
 * Sanitizes user text input to prevent XSS vulnerabilities.
 */
export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  return DOMPurify.sanitize(input.trim(), {
    ALLOWED_TAGS: [], // Strip all HTML tags from user text inputs
    ALLOWED_ATTR: [],
  });
};

/**
 * Truncates text safely for previews.
 */
export const truncateText = (text: string, maxLength: number = 100): string => {
  if (!text || text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
};

/**
 * Formats timestamps nicely.
 */
export const formatDate = (timestamp: number): string => {
  return new Date(timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

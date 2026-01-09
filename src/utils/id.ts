/**
 * Generate a random 6-digit event code
 */
export function generateEventCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

/**
 * Generate a unique ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

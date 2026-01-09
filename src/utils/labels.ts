/**
 * Generate alphabetical labels (A, B, C, ...)
 */
export function generateLabels(count: number): string[] {
  return Array.from({ length: count }, (_, i) => String.fromCharCode(65 + i) // 65 is 'A'
  );
}

/**
 * Generate ordinal labels (1st, 2nd, 3rd, ...)
 */
export function generateOrdinals(count: number): string[] {
  return Array.from({ length: count }, (_, i) => {
    const num = i + 1;
    if (num === 1) return "1st";
    if (num === 2) return "2nd";
    if (num === 3) return "3rd";
    return `${num}th`;
  });
}

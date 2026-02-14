/**
 * Converts an ISO 3166-1 alpha-2 country code to a flag emoji.
 * Uses regional indicator symbols (U+1F1E6 to U+1F1FF).
 * 
 * @param countryCode - Two-letter ISO country code (e.g., "US", "GB")
 * @returns Flag emoji string or empty string if invalid
 */
export function countryCodeToFlagEmoji(countryCode: string): string {
  if (!countryCode || countryCode.length !== 2) {
    return '';
  }

  const code = countryCode.toUpperCase();
  
  // Validate that both characters are A-Z
  if (!/^[A-Z]{2}$/.test(code)) {
    return '';
  }

  // Convert each letter to its regional indicator symbol
  // A = U+1F1E6, B = U+1F1E7, ..., Z = U+1F1FF
  const codePoints = [...code].map(char => 
    0x1F1E6 + char.charCodeAt(0) - 'A'.charCodeAt(0)
  );

  return String.fromCodePoint(...codePoints);
}

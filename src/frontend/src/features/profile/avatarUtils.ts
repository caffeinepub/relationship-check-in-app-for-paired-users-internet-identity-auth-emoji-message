// Avatar presets using emojis
export const AVATAR_PRESETS = [
  '😊', '😎', '🥰', '😇', '🤗', '😌',
  '🙂', '😄', '😁', '🤩', '😍', '🥳',
  '🐶', '🐱', '🐻', '🐼', '🦊', '🐨',
  '🦁', '🐯', '🐸', '🐵', '🐰', '🐹',
  '🌟', '⭐', '✨', '💫', '🌈', '🌸',
  '🌺', '🌻', '🌷', '🌹', '💐', '🌼',
  '❤️', '💙', '💚', '💛', '💜', '🧡',
  '💖', '💗', '💓', '💕', '💞', '💝',
] as const;

export type AvatarPreset = typeof AVATAR_PRESETS[number];

/**
 * Validates if a string is a valid avatar preset
 */
export function isValidAvatar(avatar: string): boolean {
  return AVATAR_PRESETS.includes(avatar as AvatarPreset) || avatar === '';
}

/**
 * Normalizes avatar input, returning empty string if invalid
 */
export function normalizeAvatar(avatar: string | undefined): string {
  if (!avatar) return '';
  return isValidAvatar(avatar) ? avatar : '';
}

/**
 * Generates a fallback avatar from a name (first letter)
 */
export function getFallbackAvatar(name: string): string {
  if (!name || !name.trim()) return '👤';
  return name.trim()[0].toUpperCase();
}

/**
 * Gets display avatar with fallback
 */
export function getDisplayAvatar(avatar: string | undefined, name: string): string {
  const normalized = normalizeAvatar(avatar);
  return normalized || getFallbackAvatar(name);
}

import { UsernameValidationResult } from '../entities/UsernameValidationResult';

export const USERNAME_MIN_LENGTH = 5;
export const USERNAME_MAX_LENGTH = 20;

const ALLOWED_CHARACTERS_PATTERN = /^[a-z0-9_]+$/;

export function evaluateUsernameFormatUseCase(username: string): UsernameValidationResult {
  if (username.length < USERNAME_MIN_LENGTH) {
    return { isValid: false, reason: 'TOO_SHORT' };
  }

  if (username.length > USERNAME_MAX_LENGTH) {
    return { isValid: false, reason: 'TOO_LONG' };
  }

  if (!ALLOWED_CHARACTERS_PATTERN.test(username)) {
    return { isValid: false, reason: 'INVALID_CHARACTERS' };
  }

  return { isValid: true };
}

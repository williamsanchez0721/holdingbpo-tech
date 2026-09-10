import { RecoveryValidationResult } from '../entities/RecoveryValidationResult';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function evaluateEmailCredentialsFormatUseCase(
  email: string,
  password: string,
): RecoveryValidationResult {
  if (!EMAIL_PATTERN.test(email)) {
    return { isValid: false, reason: 'INVALID_EMAIL' };
  }

  if (password.length === 0) {
    return { isValid: false, reason: 'EMPTY_PASSWORD' };
  }

  return { isValid: true };
}

export type RecoveryWeaknessReason = 'INVALID_EMAIL' | 'EMPTY_PASSWORD' | 'INVALID_WORD_COUNT';

export interface RecoveryValidationResult {
  isValid: boolean;
  reason?: RecoveryWeaknessReason;
}

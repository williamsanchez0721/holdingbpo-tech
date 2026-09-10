export type UsernameWeaknessReason = 'TOO_SHORT' | 'TOO_LONG' | 'INVALID_CHARACTERS';

export interface UsernameValidationResult {
  isValid: boolean;
  reason?: UsernameWeaknessReason;
}

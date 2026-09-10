export type PinWeaknessReason = 'TOO_SHORT' | 'REPEATED_DIGIT' | 'SEQUENTIAL';

export interface PinStrengthResult {
  isValid: boolean;
  reason?: PinWeaknessReason;
}

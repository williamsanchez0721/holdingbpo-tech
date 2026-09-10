import { PinStrengthResult } from '../entities/PinStrengthResult';

export const PIN_LENGTH = 6;

export function evaluatePinStrengthUseCase(pin: string): PinStrengthResult {
  if (pin.length !== PIN_LENGTH || !/^\d+$/.test(pin)) {
    return { isValid: false, reason: 'TOO_SHORT' };
  }

  if (isRepeatedDigit(pin)) {
    return { isValid: false, reason: 'REPEATED_DIGIT' };
  }

  if (isSequential(pin)) {
    return { isValid: false, reason: 'SEQUENTIAL' };
  }

  return { isValid: true };
}

function isRepeatedDigit(pin: string): boolean {
  return pin.split('').every((digit) => digit === pin[0]);
}

function isSequential(pin: string): boolean {
  const digits = pin.split('').map(Number);
  const ascending = digits.every((digit, index) => index === 0 || digit === digits[index - 1]! + 1);
  const descending = digits.every(
    (digit, index) => index === 0 || digit === digits[index - 1]! - 1,
  );
  return ascending || descending;
}

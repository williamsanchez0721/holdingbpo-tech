import { RecoveryValidationResult } from '../entities/RecoveryValidationResult';

export const SEED_PHRASE_WORD_COUNT = 12;

export function evaluateSeedPhraseFormatUseCase(seedPhrase: string): RecoveryValidationResult {
  const words = seedPhrase.trim().split(/\s+/).filter(Boolean);

  if (words.length !== SEED_PHRASE_WORD_COUNT) {
    return { isValid: false, reason: 'INVALID_WORD_COUNT' };
  }

  return { isValid: true };
}

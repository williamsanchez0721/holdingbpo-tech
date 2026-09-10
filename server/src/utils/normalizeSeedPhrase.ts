export const SEED_PHRASE_WORD_COUNT = 12;

export function normalizeSeedPhrase(seedPhrase: string): string {
  return seedPhrase.trim().split(/\s+/).join(' ').toLowerCase();
}

export function hasValidSeedPhraseWordCount(seedPhrase: string): boolean {
  return (
    normalizeSeedPhrase(seedPhrase).split(' ').filter(Boolean).length === SEED_PHRASE_WORD_COUNT
  );
}

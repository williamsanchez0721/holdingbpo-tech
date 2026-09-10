import { hasValidSeedPhraseWordCount, normalizeSeedPhrase } from './normalizeSeedPhrase';

describe('normalizeSeedPhrase', () => {
  it('recorta espacios extra y pasa a minúsculas', () => {
    expect(normalizeSeedPhrase('  Yellow   Monday  MUG ')).toBe('yellow monday mug');
  });
});

describe('hasValidSeedPhraseWordCount', () => {
  const VALID_PHRASE =
    'yellow monday mug magazine scholar zone superheroes eleven wonderlust shoes precious spectrum';

  it('acepta una frase de 12 palabras', () => {
    expect(hasValidSeedPhraseWordCount(VALID_PHRASE)).toBe(true);
  });

  it('rechaza una frase con menos de 12 palabras', () => {
    expect(hasValidSeedPhraseWordCount('yellow monday mug')).toBe(false);
  });
});

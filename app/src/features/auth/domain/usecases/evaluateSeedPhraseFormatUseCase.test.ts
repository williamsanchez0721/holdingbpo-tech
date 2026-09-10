import { evaluateSeedPhraseFormatUseCase } from './evaluateSeedPhraseFormatUseCase';

describe('evaluateSeedPhraseFormatUseCase', () => {
  it('rechaza una frase con menos de 12 palabras', () => {
    expect(evaluateSeedPhraseFormatUseCase('yellow monday mug')).toEqual({
      isValid: false,
      reason: 'INVALID_WORD_COUNT',
    });
  });

  it('ignora espacios extra entre palabras', () => {
    const phrase = 'one two three four five six seven eight nine ten eleven twelve';
    expect(evaluateSeedPhraseFormatUseCase(`  ${phrase}  `)).toEqual({ isValid: true });
  });

  it('acepta una frase de 12 palabras', () => {
    const phrase =
      'yellow monday mug magazine scholar zone superheroes eleven wonderlust shoes precious spectrum';
    expect(evaluateSeedPhraseFormatUseCase(phrase)).toEqual({ isValid: true });
  });
});

import { evaluateUsernameFormatUseCase } from './evaluateUsernameFormatUseCase';

describe('evaluateUsernameFormatUseCase', () => {
  it('rechaza un usuario demasiado corto', () => {
    expect(evaluateUsernameFormatUseCase('ab')).toEqual({ isValid: false, reason: 'TOO_SHORT' });
  });

  it('rechaza un usuario demasiado largo', () => {
    expect(evaluateUsernameFormatUseCase('a'.repeat(21))).toEqual({
      isValid: false,
      reason: 'TOO_LONG',
    });
  });

  it('rechaza caracteres no permitidos como espacios o mayúsculas', () => {
    expect(evaluateUsernameFormatUseCase('Luis Mauricio')).toEqual({
      isValid: false,
      reason: 'INVALID_CHARACTERS',
    });
  });

  it('acepta un usuario válido con letras, números y guión bajo', () => {
    expect(evaluateUsernameFormatUseCase('luis_mauricio99')).toEqual({ isValid: true });
  });
});

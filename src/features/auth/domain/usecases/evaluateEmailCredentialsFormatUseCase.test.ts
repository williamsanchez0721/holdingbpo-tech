import { evaluateEmailCredentialsFormatUseCase } from './evaluateEmailCredentialsFormatUseCase';

describe('evaluateEmailCredentialsFormatUseCase', () => {
  it('rechaza un correo con formato inválido', () => {
    expect(evaluateEmailCredentialsFormatUseCase('no-es-un-correo', 'secreta123')).toEqual({
      isValid: false,
      reason: 'INVALID_EMAIL',
    });
  });

  it('rechaza una contraseña vacía', () => {
    expect(evaluateEmailCredentialsFormatUseCase('user@example.com', '')).toEqual({
      isValid: false,
      reason: 'EMPTY_PASSWORD',
    });
  });

  it('acepta un correo y contraseña válidos', () => {
    expect(evaluateEmailCredentialsFormatUseCase('user@example.com', 'secreta123')).toEqual({
      isValid: true,
    });
  });
});

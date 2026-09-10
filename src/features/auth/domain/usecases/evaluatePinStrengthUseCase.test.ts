import { evaluatePinStrengthUseCase } from './evaluatePinStrengthUseCase';

describe('evaluatePinStrengthUseCase', () => {
  it('rechaza un PIN que no tiene 6 dígitos', () => {
    expect(evaluatePinStrengthUseCase('123')).toEqual({ isValid: false, reason: 'TOO_SHORT' });
  });

  it('rechaza un PIN con caracteres no numéricos', () => {
    expect(evaluatePinStrengthUseCase('12a456')).toEqual({
      isValid: false,
      reason: 'TOO_SHORT',
    });
  });

  it('rechaza un PIN con todos los dígitos iguales', () => {
    expect(evaluatePinStrengthUseCase('111111')).toEqual({
      isValid: false,
      reason: 'REPEATED_DIGIT',
    });
  });

  it('rechaza un PIN ascendente secuencial', () => {
    expect(evaluatePinStrengthUseCase('123456')).toEqual({
      isValid: false,
      reason: 'SEQUENTIAL',
    });
  });

  it('rechaza un PIN descendente secuencial', () => {
    expect(evaluatePinStrengthUseCase('654321')).toEqual({
      isValid: false,
      reason: 'SEQUENTIAL',
    });
  });

  it('acepta un PIN de 6 dígitos que no es trivial', () => {
    expect(evaluatePinStrengthUseCase('194723')).toEqual({ isValid: true });
  });
});

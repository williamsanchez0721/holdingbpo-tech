import { confirmPinMatchUseCase } from './confirmPinMatchUseCase';

describe('confirmPinMatchUseCase', () => {
  it('retorna true cuando ambos PIN coinciden', () => {
    expect(confirmPinMatchUseCase('194723', '194723')).toBe(true);
  });

  it('retorna false cuando los PIN no coinciden', () => {
    expect(confirmPinMatchUseCase('194723', '000000')).toBe(false);
  });
});

import { PinRepository } from '../repositories/PinRepository';

import { makeVerifyPinUseCase } from './verifyPinUseCase';

function makeFakeRepository(isValid: boolean): PinRepository {
  return {
    savePin: () => Promise.resolve(),
    hasPin: () => Promise.resolve(true),
    verifyPin: () => Promise.resolve(isValid),
    clearPin: () => Promise.resolve(),
  };
}

describe('verifyPinUseCase', () => {
  it('retorna true cuando el PIN coincide con el guardado', async () => {
    const verifyPinUseCase = makeVerifyPinUseCase(makeFakeRepository(true));

    expect(await verifyPinUseCase('194723')).toBe(true);
  });

  it('retorna false cuando el PIN no coincide', async () => {
    const verifyPinUseCase = makeVerifyPinUseCase(makeFakeRepository(false));

    expect(await verifyPinUseCase('000000')).toBe(false);
  });
});

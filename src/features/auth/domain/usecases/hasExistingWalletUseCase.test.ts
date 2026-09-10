import { PinRepository } from '../repositories/PinRepository';

import { makeHasExistingWalletUseCase } from './hasExistingWalletUseCase';

function makeFakeRepository(hasPin: boolean): PinRepository {
  return {
    savePin: () => Promise.resolve(),
    hasPin: () => Promise.resolve(hasPin),
    verifyPin: () => Promise.resolve(false),
    clearPin: () => Promise.resolve(),
  };
}

describe('hasExistingWalletUseCase', () => {
  it('retorna true cuando ya existe un PIN guardado', async () => {
    const hasExistingWalletUseCase = makeHasExistingWalletUseCase(makeFakeRepository(true));

    expect(await hasExistingWalletUseCase()).toBe(true);
  });

  it('retorna false cuando no hay ninguna billetera creada', async () => {
    const hasExistingWalletUseCase = makeHasExistingWalletUseCase(makeFakeRepository(false));

    expect(await hasExistingWalletUseCase()).toBe(false);
  });
});

import { WalletRepository } from '../repositories/WalletRepository';

import { makeGetWalletBalanceUseCase } from './getWalletBalanceUseCase';

function makeFakeRepository(): WalletRepository {
  return {
    getBalance: () =>
      Promise.resolve({
        amount: 0,
        currency: 'USD',
        convertedAmount: 0,
        convertedCurrency: 'COP',
      }),
    getRecentTransactions: () => Promise.resolve([]),
    markAsRecovered: () => Promise.resolve(),
  };
}

describe('getWalletBalanceUseCase', () => {
  it('retorna el balance provisto por el repositorio', async () => {
    const getWalletBalanceUseCase = makeGetWalletBalanceUseCase(makeFakeRepository());

    await expect(getWalletBalanceUseCase()).resolves.toEqual({
      amount: 0,
      currency: 'USD',
      convertedAmount: 0,
      convertedCurrency: 'COP',
    });
  });
});

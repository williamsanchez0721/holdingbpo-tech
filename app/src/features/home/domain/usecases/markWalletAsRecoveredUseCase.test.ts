import { WalletRepository } from '../repositories/WalletRepository';

import { makeMarkWalletAsRecoveredUseCase } from './markWalletAsRecoveredUseCase';

function makeFakeRepository(): WalletRepository & { marked: boolean } {
  const repository = {
    marked: false,
    getBalance: () =>
      Promise.resolve({ amount: 0, currency: 'USD', convertedAmount: 0, convertedCurrency: 'COP' }),
    getRecentTransactions: () => Promise.resolve([]),
    markAsRecovered() {
      repository.marked = true;
      return Promise.resolve();
    },
  };
  return repository;
}

describe('markWalletAsRecoveredUseCase', () => {
  it('marca la billetera como recuperada', async () => {
    const repository = makeFakeRepository();
    const markWalletAsRecoveredUseCase = makeMarkWalletAsRecoveredUseCase(repository);

    await markWalletAsRecoveredUseCase();

    expect(repository.marked).toBe(true);
  });
});

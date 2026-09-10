import { WalletRepository } from '../repositories/WalletRepository';

import { makeCreateWalletAccountUseCase } from './createWalletAccountUseCase';

function makeFakeRepository(): WalletRepository & { created: boolean } {
  const repository = {
    created: false,
    getBalance: () =>
      Promise.resolve({ amount: 0, currency: 'USD', convertedAmount: 0, convertedCurrency: 'COP' }),
    getRecentTransactions: () => Promise.resolve([]),
    createWalletAccount() {
      repository.created = true;
      return Promise.resolve();
    },
  };
  return repository;
}

describe('createWalletAccountUseCase', () => {
  it('crea la cuenta de la billetera a través del repositorio', async () => {
    const repository = makeFakeRepository();
    const createWalletAccountUseCase = makeCreateWalletAccountUseCase(repository);

    await createWalletAccountUseCase();

    expect(repository.created).toBe(true);
  });
});

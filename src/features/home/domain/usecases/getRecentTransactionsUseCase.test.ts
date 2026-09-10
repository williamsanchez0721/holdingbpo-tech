import { Transaction } from '../entities/Transaction';
import { WalletRepository } from '../repositories/WalletRepository';

import { makeGetRecentTransactionsUseCase } from './getRecentTransactionsUseCase';

function makeFakeRepository(transactions: Transaction[]): WalletRepository {
  return {
    getBalance: () =>
      Promise.resolve({ amount: 0, currency: 'USD', convertedAmount: 0, convertedCurrency: 'COP' }),
    getRecentTransactions: () => Promise.resolve(transactions),
    markAsRecovered: () => Promise.resolve(),
  };
}

describe('getRecentTransactionsUseCase', () => {
  it('retorna una lista vacía cuando la billetera aún no tiene movimientos', async () => {
    const getRecentTransactionsUseCase = makeGetRecentTransactionsUseCase(makeFakeRepository([]));

    await expect(getRecentTransactionsUseCase()).resolves.toEqual([]);
  });

  it('retorna las transacciones provistas por el repositorio', async () => {
    const transaction: Transaction = {
      id: '1',
      type: 'sent',
      status: 'completed',
      title: 'Enviaste',
      subtitle: 'ERC-20 Network',
      amountLabel: '100.00 USDT',
      dateLabel: '29 Enero',
    };
    const getRecentTransactionsUseCase = makeGetRecentTransactionsUseCase(
      makeFakeRepository([transaction]),
    );

    await expect(getRecentTransactionsUseCase()).resolves.toEqual([transaction]);
  });
});

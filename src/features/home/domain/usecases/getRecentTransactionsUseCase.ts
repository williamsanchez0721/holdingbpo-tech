import { Transaction } from '../entities/Transaction';
import { WalletRepository } from '../repositories/WalletRepository';

export function makeGetRecentTransactionsUseCase(repository: WalletRepository) {
  return function getRecentTransactionsUseCase(): Promise<Transaction[]> {
    return repository.getRecentTransactions();
  };
}

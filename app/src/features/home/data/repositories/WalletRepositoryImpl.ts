import { Transaction } from '../../domain/entities/Transaction';
import { WalletBalance } from '../../domain/entities/WalletBalance';
import { WalletRepository } from '../../domain/repositories/WalletRepository';
import { walletLocalDataSource } from '../datasources/walletLocalDataSource';

export class WalletRepositoryImpl implements WalletRepository {
  getBalance(): Promise<WalletBalance> {
    return walletLocalDataSource.getBalance();
  }

  getRecentTransactions(): Promise<Transaction[]> {
    return walletLocalDataSource.getRecentTransactions();
  }

  markAsRecovered(): Promise<void> {
    return walletLocalDataSource.markAsRecovered();
  }
}

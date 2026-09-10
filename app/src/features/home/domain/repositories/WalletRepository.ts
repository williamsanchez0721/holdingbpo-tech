import { Transaction } from '../entities/Transaction';
import { WalletBalance } from '../entities/WalletBalance';

export interface WalletRepository {
  getBalance(): Promise<WalletBalance>;
  getRecentTransactions(): Promise<Transaction[]>;
  createWalletAccount(): Promise<void>;
}

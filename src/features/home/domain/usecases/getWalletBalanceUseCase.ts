import { WalletBalance } from '../entities/WalletBalance';
import { WalletRepository } from '../repositories/WalletRepository';

export function makeGetWalletBalanceUseCase(repository: WalletRepository) {
  return function getWalletBalanceUseCase(): Promise<WalletBalance> {
    return repository.getBalance();
  };
}

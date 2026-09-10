import { WalletRepository } from '../repositories/WalletRepository';

export function makeMarkWalletAsRecoveredUseCase(repository: WalletRepository) {
  return function markWalletAsRecoveredUseCase(): Promise<void> {
    return repository.markAsRecovered();
  };
}

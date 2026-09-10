import { WalletRepository } from '../repositories/WalletRepository';

export function makeCreateWalletAccountUseCase(repository: WalletRepository) {
  return function createWalletAccountUseCase(): Promise<void> {
    return repository.createWalletAccount();
  };
}

import { PinRepository } from '../repositories/PinRepository';

export function makeHasExistingWalletUseCase(repository: PinRepository) {
  return function hasExistingWalletUseCase(): Promise<boolean> {
    return repository.hasPin();
  };
}

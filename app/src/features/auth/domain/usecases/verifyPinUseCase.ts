import { PinRepository } from '../repositories/PinRepository';

export function makeVerifyPinUseCase(repository: PinRepository) {
  return function verifyPinUseCase(pin: string): Promise<boolean> {
    return repository.verifyPin(pin);
  };
}

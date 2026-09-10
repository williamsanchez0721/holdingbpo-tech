import { BiometricRepository } from '../repositories/BiometricRepository';
import { PinRepository } from '../repositories/PinRepository';
import { UsernameRepository } from '../repositories/UsernameRepository';

export function makeLogoutUseCase(
  pinRepository: PinRepository,
  biometricRepository: BiometricRepository,
  usernameRepository: UsernameRepository,
) {
  return async function logoutUseCase(): Promise<void> {
    await Promise.all([
      pinRepository.clearPin(),
      biometricRepository.clear(),
      usernameRepository.clearReserved(),
    ]);
  };
}

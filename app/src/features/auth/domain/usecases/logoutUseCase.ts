import { AuthSessionRepository } from '../repositories/AuthSessionRepository';
import { BiometricRepository } from '../repositories/BiometricRepository';
import { PinRepository } from '../repositories/PinRepository';
import { UsernameRepository } from '../repositories/UsernameRepository';

export function makeLogoutUseCase(
  pinRepository: PinRepository,
  biometricRepository: BiometricRepository,
  usernameRepository: UsernameRepository,
  authSessionRepository: AuthSessionRepository,
) {
  return async function logoutUseCase(): Promise<void> {
    await Promise.all([
      pinRepository.clearPin(),
      biometricRepository.clear(),
      usernameRepository.clearReserved(),
      authSessionRepository.clearToken(),
    ]);
  };
}

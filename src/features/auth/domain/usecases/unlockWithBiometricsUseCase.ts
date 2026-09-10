import { BiometricRepository } from '../repositories/BiometricRepository';

export type BiometricUnlockResult = 'UNLOCKED' | 'DECLINED' | 'UNAVAILABLE' | 'FAILED';

const UNLOCK_PROMPT_MESSAGE = 'Desbloquea tu billetera';

export function makeUnlockWithBiometricsUseCase(repository: BiometricRepository) {
  return async function unlockWithBiometricsUseCase(): Promise<BiometricUnlockResult> {
    const [isAvailable, isEnabled] = await Promise.all([
      repository.isAvailable(),
      repository.isEnabled(),
    ]);

    if (!isAvailable || !isEnabled) {
      return 'UNAVAILABLE';
    }

    try {
      const authenticated = await repository.authenticate(UNLOCK_PROMPT_MESSAGE);
      return authenticated ? 'UNLOCKED' : 'DECLINED';
    } catch {
      return 'FAILED';
    }
  };
}

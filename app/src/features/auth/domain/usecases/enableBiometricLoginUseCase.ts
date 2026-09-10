import { BiometricRepository } from '../repositories/BiometricRepository';

export type BiometricEnrollmentResult = 'ENABLED' | 'DECLINED' | 'UNAVAILABLE' | 'FAILED';

export function makeEnableBiometricLoginUseCase(repository: BiometricRepository) {
  return async function enableBiometricLoginUseCase(): Promise<BiometricEnrollmentResult> {
    const available = await repository.isAvailable();

    if (!available) {
      return 'UNAVAILABLE';
    }

    try {
      const authenticated = await repository.authenticate();
      await repository.setEnabled(authenticated);
      return authenticated ? 'ENABLED' : 'DECLINED';
    } catch {
      return 'FAILED';
    }
  };
}

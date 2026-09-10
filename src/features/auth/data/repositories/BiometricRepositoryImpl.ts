import { BiometricRepository } from '../../domain/repositories/BiometricRepository';
import { localAuthenticationDataSource } from '../datasources/localAuthenticationDataSource';

export class BiometricRepositoryImpl implements BiometricRepository {
  isAvailable(): Promise<boolean> {
    return localAuthenticationDataSource.isSupported();
  }

  isEnabled(): Promise<boolean> {
    return localAuthenticationDataSource.isEnabled();
  }

  authenticate(promptMessage?: string): Promise<boolean> {
    return localAuthenticationDataSource.authenticate(promptMessage);
  }

  setEnabled(enabled: boolean): Promise<void> {
    return localAuthenticationDataSource.setEnabled(enabled);
  }

  clear(): Promise<void> {
    return localAuthenticationDataSource.clearEnabled();
  }
}

import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';

import { BiometricRepositoryImpl } from './BiometricRepositoryImpl';

jest.mock('expo-secure-store', () => ({
  setItemAsync: jest.fn(),
  getItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

jest.mock('expo-local-authentication', () => ({
  hasHardwareAsync: jest.fn(),
  isEnrolledAsync: jest.fn(),
  authenticateAsync: jest.fn(),
}));

describe('BiometricRepositoryImpl', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('reporta no disponible cuando el dispositivo no tiene sensor', async () => {
    jest.mocked(LocalAuthentication.hasHardwareAsync).mockResolvedValue(false);
    jest.mocked(LocalAuthentication.isEnrolledAsync).mockResolvedValue(false);
    const repository = new BiometricRepositoryImpl();

    expect(await repository.isAvailable()).toBe(false);
  });

  it('reporta disponible cuando hay hardware y biometría enrolada', async () => {
    jest.mocked(LocalAuthentication.hasHardwareAsync).mockResolvedValue(true);
    jest.mocked(LocalAuthentication.isEnrolledAsync).mockResolvedValue(true);
    const repository = new BiometricRepositoryImpl();

    expect(await repository.isAvailable()).toBe(true);
  });

  it('autentica delegando en el resultado nativo', async () => {
    jest.mocked(LocalAuthentication.authenticateAsync).mockResolvedValue({
      success: true,
    } as LocalAuthentication.LocalAuthenticationResult);
    const repository = new BiometricRepositoryImpl();

    expect(await repository.authenticate()).toBe(true);
  });

  it('persiste la preferencia de biometría habilitada', async () => {
    const repository = new BiometricRepositoryImpl();

    await repository.setEnabled(true);

    expect(SecureStore.setItemAsync).toHaveBeenCalledWith('auth.biometricEnabled', 'true');
  });

  it('elimina la preferencia de biometría al cerrar sesión', async () => {
    const repository = new BiometricRepositoryImpl();

    await repository.clear();

    expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('auth.biometricEnabled');
  });

  it('reporta isEnabled en true cuando la preferencia guardada es "true"', async () => {
    jest.mocked(SecureStore.getItemAsync).mockResolvedValue('true');
    const repository = new BiometricRepositoryImpl();

    expect(await repository.isEnabled()).toBe(true);
  });

  it('reporta isEnabled en false cuando no hay preferencia guardada', async () => {
    jest.mocked(SecureStore.getItemAsync).mockResolvedValue(null);
    const repository = new BiometricRepositoryImpl();

    expect(await repository.isEnabled()).toBe(false);
  });
});

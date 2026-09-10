import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';

import { PinRepositoryImpl } from './PinRepositoryImpl';

jest.mock('expo-secure-store', () => ({
  setItemAsync: jest.fn(),
  getItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

jest.mock('expo-crypto', () => ({
  CryptoDigestAlgorithm: { SHA256: 'SHA256' },
  digestStringAsync: jest.fn(),
}));

describe('PinRepositoryImpl', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('guarda el hash del PIN, nunca el PIN en texto plano', async () => {
    jest.mocked(Crypto.digestStringAsync).mockResolvedValue('hashed-value');
    const repository = new PinRepositoryImpl();

    await repository.savePin('194723');

    expect(Crypto.digestStringAsync).toHaveBeenCalledWith('SHA256', '194723');
    expect(SecureStore.setItemAsync).toHaveBeenCalledWith('auth.pinHash', 'hashed-value');
  });

  it('reporta hasPin en false cuando no hay ningún hash guardado', async () => {
    jest.mocked(SecureStore.getItemAsync).mockResolvedValue(null);
    const repository = new PinRepositoryImpl();

    expect(await repository.hasPin()).toBe(false);
  });

  it('reporta hasPin en true cuando ya existe un hash guardado', async () => {
    jest.mocked(SecureStore.getItemAsync).mockResolvedValue('hashed-value');
    const repository = new PinRepositoryImpl();

    expect(await repository.hasPin()).toBe(true);
  });

  it('elimina el hash del PIN al cerrar sesión', async () => {
    const repository = new PinRepositoryImpl();

    await repository.clearPin();

    expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('auth.pinHash');
  });

  it('verifica el PIN correctamente cuando el hash coincide', async () => {
    jest.mocked(SecureStore.getItemAsync).mockResolvedValue('hashed-value');
    jest.mocked(Crypto.digestStringAsync).mockResolvedValue('hashed-value');
    const repository = new PinRepositoryImpl();

    expect(await repository.verifyPin('194723')).toBe(true);
  });

  it('rechaza la verificación cuando el hash no coincide', async () => {
    jest.mocked(SecureStore.getItemAsync).mockResolvedValue('hashed-value');
    jest.mocked(Crypto.digestStringAsync).mockResolvedValue('other-hash');
    const repository = new PinRepositoryImpl();

    expect(await repository.verifyPin('000000')).toBe(false);
  });

  it('rechaza la verificación cuando no hay ningún PIN guardado', async () => {
    jest.mocked(SecureStore.getItemAsync).mockResolvedValue(null);
    const repository = new PinRepositoryImpl();

    expect(await repository.verifyPin('194723')).toBe(false);
  });
});

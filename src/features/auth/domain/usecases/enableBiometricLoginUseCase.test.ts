import { BiometricRepository } from '../repositories/BiometricRepository';

import { makeEnableBiometricLoginUseCase } from './enableBiometricLoginUseCase';

function makeFakeRepository(overrides: Partial<BiometricRepository> = {}): BiometricRepository {
  return {
    isAvailable: () => Promise.resolve(true),
    isEnabled: () => Promise.resolve(false),
    authenticate: () => Promise.resolve(true),
    setEnabled: () => Promise.resolve(),
    clear: () => Promise.resolve(),
    ...overrides,
  };
}

describe('enableBiometricLoginUseCase', () => {
  it('retorna UNAVAILABLE cuando el dispositivo no soporta biometría', async () => {
    const repository = makeFakeRepository({ isAvailable: () => Promise.resolve(false) });
    const enableBiometricLoginUseCase = makeEnableBiometricLoginUseCase(repository);

    expect(await enableBiometricLoginUseCase()).toBe('UNAVAILABLE');
  });

  it('retorna ENABLED y persiste la preferencia cuando el usuario autentica correctamente', async () => {
    let enabledPersisted: boolean | undefined;
    const repository = makeFakeRepository({
      setEnabled: (enabled) => {
        enabledPersisted = enabled;
        return Promise.resolve();
      },
    });
    const enableBiometricLoginUseCase = makeEnableBiometricLoginUseCase(repository);

    expect(await enableBiometricLoginUseCase()).toBe('ENABLED');
    expect(enabledPersisted).toBe(true);
  });

  it('retorna DECLINED cuando el usuario rechaza la autenticación', async () => {
    const repository = makeFakeRepository({ authenticate: () => Promise.resolve(false) });
    const enableBiometricLoginUseCase = makeEnableBiometricLoginUseCase(repository);

    expect(await enableBiometricLoginUseCase()).toBe('DECLINED');
  });

  it('retorna FAILED cuando la autenticación lanza un error inesperado', async () => {
    const repository = makeFakeRepository({
      authenticate: () => Promise.reject(new Error('device error')),
    });
    const enableBiometricLoginUseCase = makeEnableBiometricLoginUseCase(repository);

    expect(await enableBiometricLoginUseCase()).toBe('FAILED');
  });
});

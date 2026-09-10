import { BiometricRepository } from '../repositories/BiometricRepository';

import { makeUnlockWithBiometricsUseCase } from './unlockWithBiometricsUseCase';

function makeFakeRepository(overrides: Partial<BiometricRepository> = {}): BiometricRepository {
  return {
    isAvailable: () => Promise.resolve(true),
    isEnabled: () => Promise.resolve(true),
    authenticate: () => Promise.resolve(true),
    setEnabled: () => Promise.resolve(),
    clear: () => Promise.resolve(),
    ...overrides,
  };
}

describe('unlockWithBiometricsUseCase', () => {
  it('retorna UNAVAILABLE cuando el dispositivo no soporta biometría', async () => {
    const unlockWithBiometricsUseCase = makeUnlockWithBiometricsUseCase(
      makeFakeRepository({ isAvailable: () => Promise.resolve(false) }),
    );

    expect(await unlockWithBiometricsUseCase()).toBe('UNAVAILABLE');
  });

  it('retorna UNAVAILABLE cuando el usuario no activó la biometría al crear su PIN', async () => {
    const unlockWithBiometricsUseCase = makeUnlockWithBiometricsUseCase(
      makeFakeRepository({ isEnabled: () => Promise.resolve(false) }),
    );

    expect(await unlockWithBiometricsUseCase()).toBe('UNAVAILABLE');
  });

  it('retorna UNLOCKED cuando la autenticación es exitosa', async () => {
    const unlockWithBiometricsUseCase = makeUnlockWithBiometricsUseCase(makeFakeRepository());

    expect(await unlockWithBiometricsUseCase()).toBe('UNLOCKED');
  });

  it('retorna DECLINED cuando el usuario rechaza la autenticación', async () => {
    const unlockWithBiometricsUseCase = makeUnlockWithBiometricsUseCase(
      makeFakeRepository({ authenticate: () => Promise.resolve(false) }),
    );

    expect(await unlockWithBiometricsUseCase()).toBe('DECLINED');
  });

  it('retorna FAILED cuando la autenticación lanza un error inesperado', async () => {
    const unlockWithBiometricsUseCase = makeUnlockWithBiometricsUseCase(
      makeFakeRepository({ authenticate: () => Promise.reject(new Error('device error')) }),
    );

    expect(await unlockWithBiometricsUseCase()).toBe('FAILED');
  });
});

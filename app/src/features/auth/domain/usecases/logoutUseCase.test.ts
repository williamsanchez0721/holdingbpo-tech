import { BiometricRepository } from '../repositories/BiometricRepository';
import { PinRepository } from '../repositories/PinRepository';
import { UsernameRepository } from '../repositories/UsernameRepository';

import { makeLogoutUseCase } from './logoutUseCase';

function makeFakePinRepository(): PinRepository & { cleared: boolean } {
  const repository = {
    cleared: false,
    savePin: () => Promise.resolve(),
    hasPin: () => Promise.resolve(false),
    verifyPin: () => Promise.resolve(false),
    clearPin() {
      repository.cleared = true;
      return Promise.resolve();
    },
  };
  return repository;
}

function makeFakeBiometricRepository(): BiometricRepository & { cleared: boolean } {
  const repository = {
    cleared: false,
    isAvailable: () => Promise.resolve(true),
    isEnabled: () => Promise.resolve(false),
    authenticate: () => Promise.resolve(true),
    setEnabled: () => Promise.resolve(),
    clear() {
      repository.cleared = true;
      return Promise.resolve();
    },
  };
  return repository;
}

function makeFakeUsernameRepository(): UsernameRepository & { cleared: boolean } {
  const repository = {
    cleared: false,
    checkAvailability: () => Promise.resolve(true),
    reserve: () => Promise.resolve(),
    getReserved: () => Promise.resolve(null),
    clearReserved() {
      repository.cleared = true;
      return Promise.resolve();
    },
  };
  return repository;
}

describe('logoutUseCase', () => {
  it('limpia el PIN, la preferencia de biometría y el usuario reservado', async () => {
    const pinRepository = makeFakePinRepository();
    const biometricRepository = makeFakeBiometricRepository();
    const usernameRepository = makeFakeUsernameRepository();
    const logoutUseCase = makeLogoutUseCase(pinRepository, biometricRepository, usernameRepository);

    await logoutUseCase();

    expect(pinRepository.cleared).toBe(true);
    expect(biometricRepository.cleared).toBe(true);
    expect(usernameRepository.cleared).toBe(true);
  });
});

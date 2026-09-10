import { PinRepository } from '../repositories/PinRepository';

import { makeCreatePinUseCase, WeakPinError } from './createPinUseCase';

function makeFakeRepository(): PinRepository & { savedPin: string | null } {
  const repository = {
    savedPin: null as string | null,
    savePin(pin: string) {
      repository.savedPin = pin;
      return Promise.resolve();
    },
    hasPin() {
      return Promise.resolve(repository.savedPin !== null);
    },
    verifyPin(pin: string) {
      return Promise.resolve(repository.savedPin === pin);
    },
    clearPin() {
      repository.savedPin = null;
      return Promise.resolve();
    },
  };

  return repository;
}

describe('createPinUseCase', () => {
  it('guarda el PIN cuando cumple la política de seguridad', async () => {
    const repository = makeFakeRepository();
    const createPinUseCase = makeCreatePinUseCase(repository);

    await createPinUseCase('194723');

    expect(repository.savedPin).toBe('194723');
  });

  it('lanza WeakPinError y no persiste un PIN débil', async () => {
    const repository = makeFakeRepository();
    const createPinUseCase = makeCreatePinUseCase(repository);

    await expect(createPinUseCase('111111')).rejects.toBeInstanceOf(WeakPinError);
    expect(repository.savedPin).toBeNull();
  });
});

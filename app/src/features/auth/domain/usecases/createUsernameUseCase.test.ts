import { UsernameRepository } from '../repositories/UsernameRepository';

import { makeCreateUsernameUseCase, UsernameCreationError } from './createUsernameUseCase';

function makeFakeRepository(overrides: Partial<UsernameRepository> = {}): UsernameRepository {
  return {
    checkAvailability: () => Promise.resolve(true),
    reserve: () => Promise.resolve(),
    getReserved: () => Promise.resolve(null),
    clearReserved: () => Promise.resolve(),
    ...overrides,
  };
}

describe('createUsernameUseCase', () => {
  it('lanza INVALID_FORMAT cuando el usuario no cumple la política de formato', async () => {
    const createUsernameUseCase = makeCreateUsernameUseCase(makeFakeRepository());

    await expect(createUsernameUseCase('ab')).rejects.toMatchObject({ code: 'INVALID_FORMAT' });
  });

  it('lanza TAKEN cuando el repositorio indica que no está disponible', async () => {
    const repository = makeFakeRepository({ checkAvailability: () => Promise.resolve(false) });
    const createUsernameUseCase = makeCreateUsernameUseCase(repository);

    await expect(createUsernameUseCase('luismauricio99')).rejects.toBeInstanceOf(
      UsernameCreationError,
    );
    await expect(createUsernameUseCase('luismauricio99')).rejects.toMatchObject({
      code: 'TAKEN',
    });
  });

  it('lanza STORAGE_FAILURE cuando falla la persistencia', async () => {
    const repository = makeFakeRepository({
      reserve: () => Promise.reject(new Error('storage down')),
    });
    const createUsernameUseCase = makeCreateUsernameUseCase(repository);

    await expect(createUsernameUseCase('luismauricio297')).rejects.toMatchObject({
      code: 'STORAGE_FAILURE',
    });
  });

  it('reserva el usuario cuando el formato es válido y está disponible', async () => {
    let reservedUsername: string | null = null;
    const repository = makeFakeRepository({
      reserve: (username) => {
        reservedUsername = username;
        return Promise.resolve();
      },
    });
    const createUsernameUseCase = makeCreateUsernameUseCase(repository);

    await createUsernameUseCase('luismauricio297');

    expect(reservedUsername).toBe('luismauricio297');
  });
});

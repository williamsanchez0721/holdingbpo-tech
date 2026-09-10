import { UsernameRepository } from '../repositories/UsernameRepository';

import { makeGetReservedUsernameUseCase } from './getReservedUsernameUseCase';

function makeFakeRepository(reserved: string | null): UsernameRepository {
  return {
    checkAvailability: () => Promise.resolve(true),
    reserve: () => Promise.resolve(),
    getReserved: () => Promise.resolve(reserved),
    clearReserved: () => Promise.resolve(),
  };
}

describe('getReservedUsernameUseCase', () => {
  it('retorna el usuario reservado cuando existe', async () => {
    const getReservedUsernameUseCase = makeGetReservedUsernameUseCase(
      makeFakeRepository('luismauricio297'),
    );

    expect(await getReservedUsernameUseCase()).toBe('luismauricio297');
  });

  it('retorna null cuando no se ha creado ningún usuario', async () => {
    const getReservedUsernameUseCase = makeGetReservedUsernameUseCase(makeFakeRepository(null));

    expect(await getReservedUsernameUseCase()).toBeNull();
  });
});

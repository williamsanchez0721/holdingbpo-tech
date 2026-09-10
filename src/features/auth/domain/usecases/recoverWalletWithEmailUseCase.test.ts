import { UsernameRepository } from '../repositories/UsernameRepository';
import { WalletRecoveryRepository } from '../repositories/WalletRecoveryRepository';

import {
  makeRecoverWalletWithEmailUseCase,
  WalletRecoveryError,
} from './recoverWalletWithEmailUseCase';

function makeFakeRecoveryRepository(
  overrides: Partial<WalletRecoveryRepository> = {},
): WalletRecoveryRepository {
  return {
    recoverWithEmail: () => Promise.resolve('luismauricio297'),
    recoverWithSeedPhrase: () => Promise.resolve('luismauricio297'),
    ...overrides,
  };
}

function makeFakeUsernameRepository(): UsernameRepository & { reserved: string | null } {
  const repository = {
    reserved: null as string | null,
    checkAvailability: () => Promise.resolve(true),
    reserve(username: string) {
      repository.reserved = username;
      return Promise.resolve();
    },
    getReserved: () => Promise.resolve(null),
    clearReserved: () => Promise.resolve(),
  };
  return repository;
}

describe('recoverWalletWithEmailUseCase', () => {
  it('lanza INVALID_EMAIL cuando el correo no tiene formato válido', async () => {
    const recoverWalletWithEmailUseCase = makeRecoverWalletWithEmailUseCase(
      makeFakeRecoveryRepository(),
      makeFakeUsernameRepository(),
    );

    await expect(
      recoverWalletWithEmailUseCase('correo-invalido', 'secreta123'),
    ).rejects.toMatchObject({ code: 'INVALID_EMAIL' });
  });

  it('lanza INVALID_CREDENTIALS cuando el repositorio no encuentra la cuenta', async () => {
    const recoverWalletWithEmailUseCase = makeRecoverWalletWithEmailUseCase(
      makeFakeRecoveryRepository({ recoverWithEmail: () => Promise.resolve(null) }),
      makeFakeUsernameRepository(),
    );

    await expect(recoverWalletWithEmailUseCase('user@example.com', 'wrong')).rejects.toBeInstanceOf(
      WalletRecoveryError,
    );
  });

  it('reserva el usuario recuperado cuando las credenciales son válidas', async () => {
    const usernameRepository = makeFakeUsernameRepository();
    const recoverWalletWithEmailUseCase = makeRecoverWalletWithEmailUseCase(
      makeFakeRecoveryRepository(),
      usernameRepository,
    );

    const username = await recoverWalletWithEmailUseCase('user@example.com', 'secreta123');

    expect(username).toBe('luismauricio297');
    expect(usernameRepository.reserved).toBe('luismauricio297');
  });
});

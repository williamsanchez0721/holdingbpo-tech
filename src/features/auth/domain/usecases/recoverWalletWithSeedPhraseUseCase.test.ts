import { UsernameRepository } from '../repositories/UsernameRepository';
import { WalletRecoveryRepository } from '../repositories/WalletRecoveryRepository';

import { WalletRecoveryError } from './recoverWalletWithEmailUseCase';
import { makeRecoverWalletWithSeedPhraseUseCase } from './recoverWalletWithSeedPhraseUseCase';

const VALID_SEED_PHRASE =
  'yellow monday mug magazine scholar zone superheroes eleven wonderlust shoes precious spectrum';

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

describe('recoverWalletWithSeedPhraseUseCase', () => {
  it('lanza INVALID_WORD_COUNT cuando la frase no tiene 12 palabras', async () => {
    const recoverWalletWithSeedPhraseUseCase = makeRecoverWalletWithSeedPhraseUseCase(
      makeFakeRecoveryRepository(),
      makeFakeUsernameRepository(),
    );

    await expect(recoverWalletWithSeedPhraseUseCase('one two three')).rejects.toMatchObject({
      code: 'INVALID_WORD_COUNT',
    });
  });

  it('lanza INVALID_CREDENTIALS cuando la frase no coincide con ningún backup', async () => {
    const recoverWalletWithSeedPhraseUseCase = makeRecoverWalletWithSeedPhraseUseCase(
      makeFakeRecoveryRepository({ recoverWithSeedPhrase: () => Promise.resolve(null) }),
      makeFakeUsernameRepository(),
    );

    await expect(recoverWalletWithSeedPhraseUseCase(VALID_SEED_PHRASE)).rejects.toBeInstanceOf(
      WalletRecoveryError,
    );
  });

  it('reserva el usuario recuperado cuando la frase semilla es válida', async () => {
    const usernameRepository = makeFakeUsernameRepository();
    const recoverWalletWithSeedPhraseUseCase = makeRecoverWalletWithSeedPhraseUseCase(
      makeFakeRecoveryRepository(),
      usernameRepository,
    );

    const username = await recoverWalletWithSeedPhraseUseCase(VALID_SEED_PHRASE);

    expect(username).toBe('luismauricio297');
    expect(usernameRepository.reserved).toBe('luismauricio297');
  });
});

import { WalletRecoveryRepositoryImpl } from './WalletRecoveryRepositoryImpl';

const VALID_SEED_PHRASE =
  'yellow monday mug magazine scholar zone superheroes eleven wonderlust shoes precious spectrum';

describe('WalletRecoveryRepositoryImpl', () => {
  it('retorna el usuario recuperado cuando el correo y la contraseña coinciden con el backup', async () => {
    const repository = new WalletRecoveryRepositoryImpl();

    const username = await repository.recoverWithEmail(
      'luismauriciocano@gmail.com',
      'Guatapay123!',
    );

    expect(username).toBe('luismauricio297');
  });

  it('retorna null cuando el correo o la contraseña no coinciden', async () => {
    const repository = new WalletRecoveryRepositoryImpl();

    const username = await repository.recoverWithEmail('otro@correo.com', 'incorrecta');

    expect(username).toBeNull();
  });

  it('retorna el usuario recuperado cuando la frase semilla coincide con el backup', async () => {
    const repository = new WalletRecoveryRepositoryImpl();

    const username = await repository.recoverWithSeedPhrase(VALID_SEED_PHRASE);

    expect(username).toBe('luismauricio297');
  });

  it('retorna null cuando la frase semilla no coincide', async () => {
    const repository = new WalletRecoveryRepositoryImpl();

    const username = await repository.recoverWithSeedPhrase('one two three four five six');

    expect(username).toBeNull();
  });
});

import { ApiError, apiRequest } from '@shared/services/apiClient';
import { authSession } from '@shared/services/authSession';

import { WalletRecoveryRepositoryImpl } from './WalletRecoveryRepositoryImpl';

jest.mock('@shared/services/apiClient', () => {
  class ApiError extends Error {
    status: number;
    constructor(status: number, message: string) {
      super(message);
      this.status = status;
    }
  }
  return { apiRequest: jest.fn(), ApiError };
});

jest.mock('@shared/services/authSession', () => ({
  authSession: {
    setToken: jest.fn(),
  },
}));

describe('WalletRecoveryRepositoryImpl', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('guarda el token y retorna el usuario cuando el correo y la contraseña son válidos', async () => {
    jest.mocked(apiRequest).mockResolvedValue({ token: 'jwt-token', username: 'luismauricio297' });
    const repository = new WalletRecoveryRepositoryImpl();

    const username = await repository.recoverWithEmail(
      'luismauriciocano@gmail.com',
      'Guatapay123!',
    );

    expect(username).toBe('luismauricio297');
    expect(authSession.setToken).toHaveBeenCalledWith('jwt-token');
  });

  it('retorna null cuando el backend rechaza las credenciales', async () => {
    jest.mocked(apiRequest).mockRejectedValue(new ApiError(401, 'inválido'));
    const repository = new WalletRecoveryRepositoryImpl();

    const username = await repository.recoverWithEmail('otro@correo.com', 'incorrecta');

    expect(username).toBeNull();
    expect(authSession.setToken).not.toHaveBeenCalled();
  });

  it('guarda el token y retorna el usuario cuando la frase semilla es válida', async () => {
    jest.mocked(apiRequest).mockResolvedValue({ token: 'jwt-token', username: 'luismauricio297' });
    const repository = new WalletRecoveryRepositoryImpl();

    const username = await repository.recoverWithSeedPhrase('yellow monday mug');

    expect(username).toBe('luismauricio297');
    expect(authSession.setToken).toHaveBeenCalledWith('jwt-token');
  });

  it('retorna null cuando la frase semilla no coincide', async () => {
    jest.mocked(apiRequest).mockRejectedValue(new ApiError(401, 'inválido'));
    const repository = new WalletRecoveryRepositoryImpl();

    const username = await repository.recoverWithSeedPhrase('one two three four five six');

    expect(username).toBeNull();
  });
});

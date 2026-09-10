import { authSession } from '@shared/services/authSession';

import { AuthSessionRepositoryImpl } from './AuthSessionRepositoryImpl';

jest.mock('@shared/services/authSession', () => ({
  authSession: {
    clearToken: jest.fn(),
  },
}));

describe('AuthSessionRepositoryImpl', () => {
  it('limpia el token de sesión almacenado', async () => {
    jest.mocked(authSession.clearToken).mockResolvedValue(undefined);
    const repository = new AuthSessionRepositoryImpl();

    await repository.clearToken();

    expect(authSession.clearToken).toHaveBeenCalled();
  });
});

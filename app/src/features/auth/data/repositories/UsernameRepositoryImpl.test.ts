import AsyncStorage from '@react-native-async-storage/async-storage';

import { apiRequest } from '@shared/services/apiClient';

import { UsernameRepositoryImpl } from './UsernameRepositoryImpl';

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));

jest.mock('@shared/services/apiClient', () => ({
  apiRequest: jest.fn(),
}));

describe('UsernameRepositoryImpl', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('consulta la disponibilidad de un usuario contra el backend', async () => {
    jest.mocked(apiRequest).mockResolvedValue({ available: false });
    const repository = new UsernameRepositoryImpl();

    expect(await repository.checkAvailability('luismauricio99')).toBe(false);
    expect(apiRequest).toHaveBeenCalledWith('/username/luismauricio99/availability');
  });

  it('reserva el usuario en el backend y lo cachea localmente', async () => {
    jest.mocked(apiRequest).mockResolvedValue(undefined);
    const repository = new UsernameRepositoryImpl();

    await repository.reserve('luismauricio297');

    expect(apiRequest).toHaveBeenCalledWith('/username', {
      method: 'POST',
      body: { username: 'luismauricio297' },
      requiresAuth: true,
    });
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('auth.username', 'luismauricio297');
  });

  it('lee el usuario reservado desde la caché local', async () => {
    jest.mocked(AsyncStorage.getItem).mockResolvedValue('luismauricio297');
    const repository = new UsernameRepositoryImpl();

    expect(await repository.getReserved()).toBe('luismauricio297');
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('auth.username');
  });

  it('elimina el usuario reservado de la caché local al cerrar sesión', async () => {
    const repository = new UsernameRepositoryImpl();

    await repository.clearReserved();

    expect(AsyncStorage.removeItem).toHaveBeenCalledWith('auth.username');
  });
});

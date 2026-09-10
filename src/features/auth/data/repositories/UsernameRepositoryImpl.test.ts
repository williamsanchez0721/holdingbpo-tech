import AsyncStorage from '@react-native-async-storage/async-storage';

import { UsernameRepositoryImpl } from './UsernameRepositoryImpl';

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));

describe('UsernameRepositoryImpl', () => {
  it('reporta no disponible un usuario ya tomado', async () => {
    const repository = new UsernameRepositoryImpl();

    expect(await repository.checkAvailability('luismauricio99')).toBe(false);
  });

  it('reporta disponible un usuario libre', async () => {
    const repository = new UsernameRepositoryImpl();

    expect(await repository.checkAvailability('luismauricio297')).toBe(true);
  });

  it('persiste el usuario reservado localmente', async () => {
    const repository = new UsernameRepositoryImpl();

    await repository.reserve('luismauricio297');

    expect(AsyncStorage.setItem).toHaveBeenCalledWith('auth.username', 'luismauricio297');
  });

  it('lee el usuario reservado localmente', async () => {
    jest.mocked(AsyncStorage.getItem).mockResolvedValue('luismauricio297');
    const repository = new UsernameRepositoryImpl();

    expect(await repository.getReserved()).toBe('luismauricio297');
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('auth.username');
  });

  it('elimina el usuario reservado al cerrar sesión', async () => {
    const repository = new UsernameRepositoryImpl();

    await repository.clearReserved();

    expect(AsyncStorage.removeItem).toHaveBeenCalledWith('auth.username');
  });
});

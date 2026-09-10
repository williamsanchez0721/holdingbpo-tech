import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { act } from 'react';

import { logoutUseCase } from '@features/auth/container';

import { SettingsScreen } from './SettingsScreen';

jest.mock('@features/auth/container', () => ({
  logoutUseCase: jest.fn(),
}));

function createNavigationMock() {
  const dispatch = jest.fn();
  const getParent = jest.fn(() => ({ dispatch }));
  return { navigation: { getParent } as never, dispatch };
}

describe('SettingsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('cierra sesión y regresa al onboarding cuando se presiona "Cerrar sesión"', async () => {
    jest.mocked(logoutUseCase).mockResolvedValue(undefined);
    const { navigation, dispatch } = createNavigationMock();

    await render(
      <SettingsScreen
        navigation={navigation}
        route={{ key: 'Config', name: 'Config', params: undefined }}
      />,
    );

    await act(async () => {
      fireEvent.press(screen.getByText('Cerrar sesión'));
    });

    await waitFor(() => {
      expect(logoutUseCase).toHaveBeenCalled();
    });
    expect(dispatch).toHaveBeenCalled();
  });

  it('muestra un error cuando falla el cierre de sesión', async () => {
    jest.mocked(logoutUseCase).mockRejectedValue(new Error('storage error'));
    const { navigation, dispatch } = createNavigationMock();

    await render(
      <SettingsScreen
        navigation={navigation}
        route={{ key: 'Config', name: 'Config', params: undefined }}
      />,
    );

    await act(async () => {
      fireEvent.press(screen.getByText('Cerrar sesión'));
    });

    await waitFor(() => {
      expect(screen.getByText('No pudimos cerrar la sesión. Intenta nuevamente.')).toBeTruthy();
    });
    expect(dispatch).not.toHaveBeenCalled();
  });
});

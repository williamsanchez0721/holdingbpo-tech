import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { act } from 'react';

import type { RootStackParamList } from '@navigation/types';

import { createUsernameUseCase } from '../../container';
import { UsernameCreationError } from '../../domain/usecases/createUsernameUseCase';

import { CreateUsernameScreen } from './CreateUsernameScreen';

jest.mock('../../container', () => ({
  createUsernameUseCase: jest.fn(),
}));

type Props = NativeStackScreenProps<RootStackParamList, 'CreateUsername'>;

function createNavigationMock(): Props['navigation'] {
  return { replace: jest.fn() } as unknown as Props['navigation'];
}

function renderScreen(navigation: Props['navigation']) {
  return render(
    <CreateUsernameScreen
      navigation={navigation}
      route={{ key: 'CreateUsername', name: 'CreateUsername', params: undefined }}
    />,
  );
}

describe('CreateUsernameScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('no permite crear el usuario mientras el campo está vacío', async () => {
    const navigation = createNavigationMock();
    await renderScreen(navigation);

    await act(async () => {
      fireEvent.press(screen.getByText('Crear usuario'));
    });

    expect(createUsernameUseCase).not.toHaveBeenCalled();
    expect(navigation.replace).not.toHaveBeenCalled();
  });

  it('muestra el error de disponibilidad y no navega cuando el usuario ya existe', async () => {
    jest
      .mocked(createUsernameUseCase)
      .mockRejectedValue(
        new UsernameCreationError('TAKEN', 'El usuario ingresado no está disponible.'),
      );
    const navigation = createNavigationMock();
    await renderScreen(navigation);

    fireEvent.changeText(screen.getByPlaceholderText('Usuario'), 'luismauricio99');

    await waitFor(() => {
      expect(screen.getByDisplayValue('luismauricio99')).toBeTruthy();
    });

    await act(async () => {
      fireEvent.press(screen.getByText('Crear usuario'));
    });

    await waitFor(() => {
      expect(screen.getByText('El usuario ingresado no está disponible.')).toBeTruthy();
    });
    expect(navigation.replace).not.toHaveBeenCalled();
  });

  it('navega a HomeTabs cuando el usuario se crea correctamente', async () => {
    jest.mocked(createUsernameUseCase).mockResolvedValue(undefined);
    const navigation = createNavigationMock();
    await renderScreen(navigation);

    fireEvent.changeText(screen.getByPlaceholderText('Usuario'), 'luismauricio297');

    await waitFor(() => {
      expect(screen.getByDisplayValue('luismauricio297')).toBeTruthy();
    });

    await act(async () => {
      fireEvent.press(screen.getByText('Crear usuario'));
    });

    await waitFor(() => {
      expect(navigation.replace).toHaveBeenCalledWith('HomeTabs');
    });
  });

  it('permite omitir el paso y navega a HomeTabs sin crear usuario', async () => {
    const navigation = createNavigationMock();
    await renderScreen(navigation);

    fireEvent.press(screen.getByText('Omitir'));

    expect(navigation.replace).toHaveBeenCalledWith('HomeTabs');
    expect(createUsernameUseCase).not.toHaveBeenCalled();
  });
});

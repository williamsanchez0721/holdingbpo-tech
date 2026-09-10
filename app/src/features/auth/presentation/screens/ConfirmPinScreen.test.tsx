import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { act } from 'react';

import { markWalletAsRecoveredUseCase } from '@features/home/container';
import type { RootStackParamList } from '@navigation/types';

import { createPinUseCase, enableBiometricLoginUseCase } from '../../container';

import { ConfirmPinScreen } from './ConfirmPinScreen';

jest.mock('../../container', () => ({
  createPinUseCase: jest.fn(),
  enableBiometricLoginUseCase: jest.fn(),
}));

jest.mock('@features/home/container', () => ({
  markWalletAsRecoveredUseCase: jest.fn(),
}));

type Props = NativeStackScreenProps<RootStackParamList, 'ConfirmPin'>;

function createNavigationMock(): Props['navigation'] {
  return {
    navigate: jest.fn(),
    replace: jest.fn(),
    goBack: jest.fn(),
  } as unknown as Props['navigation'];
}

function renderScreen(navigation: Props['navigation']) {
  return render(
    <ConfirmPinScreen
      navigation={navigation}
      route={{ key: 'ConfirmPin', name: 'ConfirmPin', params: { pin: '194723' } }}
    />,
  );
}

function typePin(pin: string) {
  fireEvent.changeText(screen.getByTestId('pin-native-input'), pin);
}

describe('ConfirmPinScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('guarda el PIN y continúa cuando ambos PIN coinciden', async () => {
    jest.mocked(createPinUseCase).mockResolvedValue(undefined);
    jest.mocked(enableBiometricLoginUseCase).mockResolvedValue('ENABLED');
    const navigation = createNavigationMock();

    await renderScreen(navigation);
    await waitFor(() => {
      expect(screen.getByText(/Repite tu PIN de seguridad/i)).toBeTruthy();
    });
    await act(async () => {
      typePin('194723');
    });

    await waitFor(() => {
      expect(navigation.replace).toHaveBeenCalledWith('CreateUsername');
    });
    expect(createPinUseCase).toHaveBeenCalledWith('194723');
  });

  it('marca la billetera como recuperada y navega a Home cuando el flujo es de recuperación', async () => {
    jest.mocked(createPinUseCase).mockResolvedValue(undefined);
    jest.mocked(enableBiometricLoginUseCase).mockResolvedValue('ENABLED');
    jest.mocked(markWalletAsRecoveredUseCase).mockResolvedValue(undefined);
    const navigation = createNavigationMock();

    await render(
      <ConfirmPinScreen
        navigation={navigation}
        route={{
          key: 'ConfirmPin',
          name: 'ConfirmPin',
          params: { pin: '194723', flow: 'recover' },
        }}
      />,
    );
    await waitFor(() => {
      expect(screen.getByText(/Repite tu PIN de seguridad/i)).toBeTruthy();
    });
    await act(async () => {
      typePin('194723');
    });

    await waitFor(() => {
      expect(navigation.replace).toHaveBeenCalledWith('HomeTabs');
    });
    expect(markWalletAsRecoveredUseCase).toHaveBeenCalled();
  });

  it('muestra el error de no coincidencia cuando el PIN repetido no coincide', async () => {
    const navigation = createNavigationMock();

    await renderScreen(navigation);
    await waitFor(() => {
      expect(screen.getByText(/Repite tu PIN de seguridad/i)).toBeTruthy();
    });
    typePin('000000');

    await waitFor(() => {
      expect(screen.getByText(/no coincide/i)).toBeTruthy();
    });
    expect(createPinUseCase).not.toHaveBeenCalled();
  });

  it('reinicia el flujo de creación tras 3 intentos fallidos de confirmación', async () => {
    const navigation = createNavigationMock();

    await renderScreen(navigation);
    await waitFor(() => {
      expect(screen.getByText(/Repite tu PIN de seguridad/i)).toBeTruthy();
    });

    typePin('000000');
    await waitFor(() => screen.getByText(/no coincide/i));

    typePin('000000');
    await waitFor(() => screen.getByText(/no coincide/i));

    typePin('000000');

    await waitFor(() => {
      expect(navigation.replace).toHaveBeenCalledWith('CreatePin');
    });
  });
});

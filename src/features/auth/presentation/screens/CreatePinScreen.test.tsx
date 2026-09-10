import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';

import type { RootStackParamList } from '@navigation/types';

import { CreatePinScreen } from './CreatePinScreen';

type Props = NativeStackScreenProps<RootStackParamList, 'CreatePin'>;

function createNavigationMock(): Props['navigation'] {
  return { navigate: jest.fn(), goBack: jest.fn() } as unknown as Props['navigation'];
}

function typePin(pin: string) {
  fireEvent.changeText(screen.getByTestId('pin-native-input'), pin);
}

describe('CreatePinScreen', () => {
  it('navega a ConfirmPin con el PIN ingresado cuando es seguro', async () => {
    const navigation = createNavigationMock();

    await render(
      <CreatePinScreen
        navigation={navigation}
        route={{ key: 'CreatePin', name: 'CreatePin', params: undefined }}
      />,
    );

    await waitFor(() => {
      expect(screen.getByText(/Crea un PIN de seguridad/i)).toBeTruthy();
    });

    typePin('194723');

    await waitFor(() => {
      expect(navigation.navigate).toHaveBeenCalledWith('ConfirmPin', { pin: '194723' });
    });
  });

  it('muestra un error y no navega cuando el PIN es una secuencia trivial', async () => {
    const navigation = createNavigationMock();

    await render(
      <CreatePinScreen
        navigation={navigation}
        route={{ key: 'CreatePin', name: 'CreatePin', params: undefined }}
      />,
    );

    await waitFor(() => {
      expect(screen.getByText(/Crea un PIN de seguridad/i)).toBeTruthy();
    });

    typePin('123456');

    await waitFor(() => {
      expect(screen.getByText(/no puede ser una secuencia/i)).toBeTruthy();
    });
    expect(navigation.navigate).not.toHaveBeenCalled();
  });
});

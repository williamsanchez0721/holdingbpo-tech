import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { render, screen, waitFor } from '@testing-library/react-native';

import type { RootStackParamList } from '@navigation/types';

import { hasExistingWalletUseCase } from '../../container';

import { SplashScreen } from './SplashScreen';

jest.mock('../../container', () => ({
  hasExistingWalletUseCase: jest.fn(),
}));

type SplashProps = NativeStackScreenProps<RootStackParamList, 'Splash'>;

function createNavigationMock(): SplashProps['navigation'] {
  return { replace: jest.fn() } as unknown as SplashProps['navigation'];
}

describe('SplashScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('redirige a Onboarding cuando todavía no existe ninguna billetera', async () => {
    jest.useFakeTimers();
    jest.mocked(hasExistingWalletUseCase).mockResolvedValue(false);
    const navigation = createNavigationMock();

    await render(
      <SplashScreen
        navigation={navigation}
        route={{ key: 'Splash', name: 'Splash', params: undefined }}
      />,
    );

    await waitFor(() => {
      expect(screen.getByText('G')).toBeTruthy();
    });

    jest.advanceTimersByTime(1800);
    await waitFor(() => {
      expect(navigation.replace).toHaveBeenCalledWith('Onboarding');
    });

    jest.useRealTimers();
  });

  it('redirige a Unlock cuando ya existe una billetera creada', async () => {
    jest.useFakeTimers();
    jest.mocked(hasExistingWalletUseCase).mockResolvedValue(true);
    const navigation = createNavigationMock();

    await render(
      <SplashScreen
        navigation={navigation}
        route={{ key: 'Splash', name: 'Splash', params: undefined }}
      />,
    );

    jest.advanceTimersByTime(1800);
    await waitFor(() => {
      expect(navigation.replace).toHaveBeenCalledWith('Unlock');
    });

    jest.useRealTimers();
  });
});

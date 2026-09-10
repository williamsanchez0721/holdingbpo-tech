import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { render, screen, waitFor } from '@testing-library/react-native';

import type { RootStackParamList } from '@navigation/types';

import { ONBOARDING_SLIDES } from '../constants/onboardingSlides';

import { OnboardingScreen } from './OnboardingScreen';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

function createNavigationMock(): Props['navigation'] {
  return { navigate: jest.fn() } as unknown as Props['navigation'];
}

describe('OnboardingScreen', () => {
  it('renderiza el primer slide y las acciones principales', async () => {
    await render(
      <OnboardingScreen
        navigation={createNavigationMock()}
        route={{ key: 'Onboarding', name: 'Onboarding', params: undefined }}
      />,
    );

    await waitFor(() => {
      expect(screen.getByText(ONBOARDING_SLIDES[0]!.title)).toBeTruthy();
    });

    expect(screen.getByText('Crear billetera')).toBeTruthy();
    expect(screen.getByText('Recuperar billetera')).toBeTruthy();
  });
});

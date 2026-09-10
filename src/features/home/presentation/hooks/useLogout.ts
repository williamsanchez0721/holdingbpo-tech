import { CommonActions } from '@react-navigation/native';
import { useCallback, useState } from 'react';

import { logoutUseCase } from '@features/auth/container';
import { HomeTabScreenProps } from '@navigation/types';

const LOGOUT_ERROR_MESSAGE = 'No pudimos cerrar la sesión. Intenta nuevamente.';

export function useLogout(navigation: HomeTabScreenProps<'Config'>['navigation']) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogout = useCallback(async () => {
    setIsLoggingOut(true);
    try {
      await logoutUseCase();
      setErrorMessage(null);
      navigation.getParent()?.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Onboarding' }],
        }),
      );
    } catch {
      setErrorMessage(LOGOUT_ERROR_MESSAGE);
    } finally {
      setIsLoggingOut(false);
    }
  }, [navigation]);

  return { isLoggingOut, errorMessage, handleLogout };
}

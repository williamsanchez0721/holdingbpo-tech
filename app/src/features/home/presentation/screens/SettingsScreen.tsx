import { Pressable, StyleSheet, Text } from 'react-native';

import { HomeTabScreenProps } from '@navigation/types';
import { Screen } from '@shared/components/Screen';
import { colors } from '@shared/constants/colors';

import { useLogout } from '../hooks/useLogout';

type Props = HomeTabScreenProps<'Config'>;

export function SettingsScreen({ navigation }: Props) {
  const { isLoggingOut, errorMessage, handleLogout } = useLogout(navigation);

  return (
    <Screen backgroundColor={colors.screenBackgroundLight} edges={['top']} style={styles.container}>
      <Text style={styles.title}>Config</Text>

      <Pressable
        style={[styles.logoutButton, isLoggingOut && styles.logoutButtonDisabled]}
        disabled={isLoggingOut}
        onPress={handleLogout}
      >
        <Text style={styles.logoutButtonText}>Cerrar sesión</Text>
      </Pressable>

      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  logoutButton: {
    backgroundColor: colors.brandButtonBackground,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  logoutButtonDisabled: {
    backgroundColor: colors.border,
  },
  logoutButtonText: {
    color: colors.brandTextOnDark,
    fontSize: 15,
    fontWeight: '600',
  },
  error: {
    color: colors.error,
    fontSize: 12,
    textAlign: 'center',
  },
});

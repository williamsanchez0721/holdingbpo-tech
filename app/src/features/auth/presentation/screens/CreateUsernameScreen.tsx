import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { RootStackParamList } from '@navigation/types';
import { Screen } from '@shared/components/Screen';
import { colors } from '@shared/constants/colors';

import { UsernameStatusInput } from '../components/UsernameStatusInput';
import { useCreateUsernameScreen } from '../hooks/useCreateUsernameScreen';

type Props = NativeStackScreenProps<RootStackParamList, 'CreateUsername'>;

export function CreateUsernameScreen({ navigation }: Props) {
  const {
    username,
    status,
    errorMessage,
    isSubmitDisabled,
    handleChangeText,
    handleSubmit,
    handleSkip,
  } = useCreateUsernameScreen({ onCompleted: () => navigation.replace('HomeTabs') });

  return (
    <Screen backgroundColor={colors.screenBackgroundLight} style={styles.container}>
      <Text style={styles.title}>Crea un nombre de usuario</Text>

      <View style={styles.card}>
        <Text style={styles.instruction}>
          Crea un nombre de usuario que te servirá para enviar y recibir transacciones de forma
          rápida y sencilla con otros miembros de Guatapay.
        </Text>
        <UsernameStatusInput value={username} status={status} onChangeText={handleChangeText} />
        {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
      </View>

      <View style={styles.actions}>
        <Pressable
          style={[styles.primaryButton, isSubmitDisabled && styles.primaryButtonDisabled]}
          disabled={isSubmitDisabled}
          onPress={handleSubmit}
        >
          <Text style={styles.primaryButtonText}>Crear usuario</Text>
        </Pressable>
        <Pressable onPress={handleSkip}>
          <Text style={styles.skipText}>Omitir</Text>
        </Pressable>
      </View>

      <StatusBar style="dark" />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 24,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 20,
    marginHorizontal: 24,
    marginTop: 24,
    padding: 20,
    gap: 16,
  },
  instruction: {
    fontSize: 13,
    color: colors.text,
  },
  error: {
    color: colors.error,
    fontSize: 12,
  },
  actions: {
    marginTop: 'auto',
    paddingHorizontal: 24,
    paddingBottom: 32,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: colors.brandButtonBackground,
    borderRadius: 12,
    paddingVertical: 16,
    alignSelf: 'stretch',
    alignItems: 'center',
    marginBottom: 16,
  },
  primaryButtonDisabled: {
    backgroundColor: colors.border,
  },
  primaryButtonText: {
    color: colors.brandTextOnDark,
    fontSize: 16,
    fontWeight: '600',
  },
  skipText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '500',
  },
});

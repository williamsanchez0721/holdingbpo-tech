import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { RootStackParamList } from '@navigation/types';
import { BubbleTransition } from '@shared/components/BubbleTransition';
import { Screen } from '@shared/components/Screen';
import { colors } from '@shared/constants/colors';

import { AuthScreenHeader } from '../components/AuthScreenHeader';
import { useBubbleNavigationTransition } from '../hooks/useBubbleNavigationTransition';

type Props = NativeStackScreenProps<RootStackParamList, 'RecoveryMethod'>;

export function RecoveryMethodScreen({ navigation }: Props) {
  const recoverWithEmail = useBubbleNavigationTransition(() =>
    navigation.navigate('RecoverWithEmail'),
  );
  const recoverWithSeedPhrase = useBubbleNavigationTransition(() =>
    navigation.navigate('RecoverWithSeedPhrase'),
  );

  return (
    <Screen backgroundColor={colors.screenBackgroundLight}>
      <AuthScreenHeader title="Recuperar billetera" onBackPress={navigation.goBack} />

      <View style={styles.card}>
        <Text style={styles.instruction}>
          Recupera tu billetera ingresando el correo y la contraseña que usaste en tu backup, o
          también puedes recuperarla ingresando la frase semilla.
        </Text>
      </View>

      <View style={styles.actions}>
        <Pressable style={styles.optionButton} onPress={recoverWithEmail.trigger}>
          <Text style={styles.optionButtonText}>Recuperar con email</Text>
        </Pressable>
        <Pressable style={styles.optionButton} onPress={recoverWithSeedPhrase.trigger}>
          <Text style={styles.optionButtonText}>Recuperar con frase semilla</Text>
        </Pressable>
      </View>

      {recoverWithEmail.origin ? (
        <BubbleTransition
          color={colors.cardBackground}
          originX={recoverWithEmail.origin.x}
          originY={recoverWithEmail.origin.y}
          onFinished={recoverWithEmail.handleFinished}
        />
      ) : null}

      {recoverWithSeedPhrase.origin ? (
        <BubbleTransition
          color={colors.cardBackground}
          originX={recoverWithSeedPhrase.origin.x}
          originY={recoverWithSeedPhrase.origin.y}
          onFinished={recoverWithSeedPhrase.handleFinished}
        />
      ) : null}

      <StatusBar style="dark" />
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 20,
    marginHorizontal: 24,
    marginTop: 24,
    padding: 20,
  },
  instruction: {
    fontSize: 13,
    color: colors.text,
    lineHeight: 20,
  },
  actions: {
    marginTop: 'auto',
    paddingHorizontal: 24,
    paddingBottom: 32,
    gap: 12,
  },
  optionButton: {
    backgroundColor: colors.brandButtonBackground,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  optionButtonText: {
    color: colors.brandTextOnDark,
    fontSize: 15,
    fontWeight: '600',
  },
});

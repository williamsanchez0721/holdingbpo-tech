import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { RootStackParamList } from '@navigation/types';
import { Screen } from '@shared/components/Screen';
import { colors } from '@shared/constants/colors';

import { AuthScreenHeader } from '../components/AuthScreenHeader';
import { useRecoverWithSeedPhraseScreen } from '../hooks/useRecoverWithSeedPhraseScreen';

import { recoveryScreenStyles as styles } from './recoveryScreenStyles';

type Props = NativeStackScreenProps<RootStackParamList, 'RecoverWithSeedPhrase'>;

export function RecoverWithSeedPhraseScreen({ navigation }: Props) {
  const { seedPhrase, errorMessage, isSubmitDisabled, handleChangeText, handleSubmit } =
    useRecoverWithSeedPhraseScreen({
      onRecovered: () => navigation.navigate('CreatePin', { flow: 'recover' }),
    });

  return (
    <Screen backgroundColor={colors.screenBackgroundLight}>
      <AuthScreenHeader title="Recuperar billetera" onBackPress={navigation.goBack} />

      <View style={styles.card}>
        <Text style={styles.instruction}>
          Recupera tu billetera ingresando la frase semilla. Presiona la tecla espacio para separar
          cada palabra.
        </Text>
        <TextInput
          style={[localStyles.seedInput, errorMessage ? localStyles.seedInputError : null]}
          value={seedPhrase}
          onChangeText={handleChangeText}
          placeholder="Frase semilla"
          placeholderTextColor={colors.border}
          autoCapitalize="none"
          autoCorrect={false}
          multiline
        />
        {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
      </View>

      <View style={styles.actions}>
        <Pressable
          style={[styles.primaryButton, isSubmitDisabled && styles.primaryButtonDisabled]}
          disabled={isSubmitDisabled}
          onPress={handleSubmit}
        >
          <Text style={styles.primaryButtonText}>Recuperar billetera</Text>
        </Pressable>
      </View>

      <StatusBar style="dark" />
    </Screen>
  );
}

const localStyles = StyleSheet.create({
  seedInput: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: 8,
    fontSize: 14,
    color: colors.text,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  seedInputError: {
    borderBottomColor: colors.error,
  },
});

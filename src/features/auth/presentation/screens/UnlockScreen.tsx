import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { RootStackParamList } from '@navigation/types';
import { Screen } from '@shared/components/Screen';
import { colors } from '@shared/constants/colors';

import { PIN_LENGTH } from '../../domain/usecases/evaluatePinStrengthUseCase';
import { AuthScreenHeader } from '../components/AuthScreenHeader';
import { PinDots } from '../components/PinDots';
import { PinNativeInput } from '../components/PinNativeInput';
import { useUnlockScreen } from '../hooks/useUnlockScreen';

import { pinScreenStyles } from './pinScreenStyles';

type Props = NativeStackScreenProps<RootStackParamList, 'Unlock'>;

export function UnlockScreen({ navigation }: Props) {
  const { value, errorMessage, onChangeText } = useUnlockScreen({
    onUnlocked: () => navigation.replace('HomeTabs'),
  });

  return (
    <Screen backgroundColor={colors.screenBackgroundLight}>
      <AuthScreenHeader title="Ingresa tu PIN" />

      <View style={pinScreenStyles.card}>
        <Text style={pinScreenStyles.instruction}>Ingresa tu PIN de seguridad para continuar.</Text>
        <PinNativeInput value={value} onChangeText={onChangeText} pinLength={PIN_LENGTH}>
          <PinDots length={PIN_LENGTH} filledCount={value.length} />
        </PinNativeInput>
        {errorMessage ? <Text style={pinScreenStyles.error}>{errorMessage}</Text> : null}
      </View>

      <Pressable style={styles.forgotLink} onPress={() => navigation.navigate('RecoveryMethod')}>
        <Text style={styles.forgotLinkText}>¿Olvidaste tu PIN?</Text>
      </Pressable>

      <StatusBar style="dark" />
    </Screen>
  );
}

const styles = StyleSheet.create({
  forgotLink: {
    marginTop: 24,
    alignSelf: 'center',
  },
  forgotLinkText: {
    color: colors.brandAccent,
    fontSize: 13,
    fontWeight: '600',
  },
});

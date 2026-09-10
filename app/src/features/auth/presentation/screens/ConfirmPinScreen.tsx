import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';

import { createWalletAccountUseCase } from '@features/home/container';
import { RootStackParamList } from '@navigation/types';
import { Screen } from '@shared/components/Screen';
import { colors } from '@shared/constants/colors';

import { PIN_LENGTH } from '../../domain/usecases/evaluatePinStrengthUseCase';
import { AuthScreenHeader } from '../components/AuthScreenHeader';
import { PinDots } from '../components/PinDots';
import { PinNativeInput } from '../components/PinNativeInput';
import { useConfirmPinScreen } from '../hooks/useConfirmPinScreen';

import { pinScreenStyles as styles } from './pinScreenStyles';

type Props = NativeStackScreenProps<RootStackParamList, 'ConfirmPin'>;

export function ConfirmPinScreen({ navigation, route }: Props) {
  const { pin, flow } = route.params;

  const { value, errorMessage, isSubmitting, onChangeText } = useConfirmPinScreen({
    pinLength: PIN_LENGTH,
    originalPin: pin,
    onConfirmed: async () => {
      if (flow === 'recover') {
        navigation.replace('HomeTabs');
        return;
      }
      await createWalletAccountUseCase();
      navigation.replace('CreateUsername');
    },
    onRestartRequired: () => navigation.replace('CreatePin'),
  });

  return (
    <Screen backgroundColor={colors.screenBackgroundLight}>
      <AuthScreenHeader title="Repetir PIN" onBackPress={navigation.goBack} />

      <View style={styles.card}>
        <Text style={styles.instruction}>Repite tu PIN de seguridad para confirmar</Text>
        <PinNativeInput
          value={value}
          onChangeText={onChangeText}
          pinLength={PIN_LENGTH}
          editable={!isSubmitting}
        >
          <PinDots length={PIN_LENGTH} filledCount={value.length} />
        </PinNativeInput>
        {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
      </View>

      <StatusBar style="dark" />
    </Screen>
  );
}

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';

import { RootStackParamList } from '@navigation/types';
import { Screen } from '@shared/components/Screen';
import { colors } from '@shared/constants/colors';

import { PIN_LENGTH } from '../../domain/usecases/evaluatePinStrengthUseCase';
import { AuthScreenHeader } from '../components/AuthScreenHeader';
import { PinDots } from '../components/PinDots';
import { PinNativeInput } from '../components/PinNativeInput';
import { useCreatePinScreen } from '../hooks/useCreatePinScreen';

import { pinScreenStyles as styles } from './pinScreenStyles';

type Props = NativeStackScreenProps<RootStackParamList, 'CreatePin'>;

export function CreatePinScreen({ navigation, route }: Props) {
  const flow = route.params?.flow;

  const { value, errorMessage, onChangeText } = useCreatePinScreen({
    pinLength: PIN_LENGTH,
    onPinCreated: (pin) => navigation.navigate('ConfirmPin', { pin, flow }),
  });

  return (
    <Screen backgroundColor={colors.screenBackgroundLight}>
      <AuthScreenHeader title="Crear PIN" onBackPress={navigation.goBack} />

      <View style={styles.card}>
        <Text style={styles.instruction}>
          Crea un PIN de seguridad para mantener tu billetera segura.
        </Text>
        <PinNativeInput value={value} onChangeText={onChangeText} pinLength={PIN_LENGTH}>
          <PinDots length={PIN_LENGTH} filledCount={value.length} />
        </PinNativeInput>
        {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
      </View>

      <StatusBar style="dark" />
    </Screen>
  );
}

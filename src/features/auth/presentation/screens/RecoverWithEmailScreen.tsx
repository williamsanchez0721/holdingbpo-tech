import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { Pressable, Text, View } from 'react-native';

import { RootStackParamList } from '@navigation/types';
import { Screen } from '@shared/components/Screen';
import { colors } from '@shared/constants/colors';

import { AuthScreenHeader } from '../components/AuthScreenHeader';
import { RecoveryCredentialsForm } from '../components/RecoveryCredentialsForm';
import { useRecoverWithEmailScreen } from '../hooks/useRecoverWithEmailScreen';

import { recoveryScreenStyles as styles } from './recoveryScreenStyles';

type Props = NativeStackScreenProps<RootStackParamList, 'RecoverWithEmail'>;

export function RecoverWithEmailScreen({ navigation }: Props) {
  const {
    email,
    password,
    isPasswordVisible,
    errorMessage,
    isSubmitDisabled,
    handleChangeEmail,
    handleChangePassword,
    handleTogglePasswordVisibility,
    handleSubmit,
  } = useRecoverWithEmailScreen({
    onRecovered: () => navigation.navigate('CreatePin', { flow: 'recover' }),
  });

  return (
    <Screen backgroundColor={colors.screenBackgroundLight}>
      <AuthScreenHeader title="Recuperar billetera" onBackPress={navigation.goBack} />

      <View style={styles.card}>
        <Text style={styles.instruction}>
          Recupera tu billetera ingresando el correo y la contraseña que usaste en tu backup.
        </Text>
        <RecoveryCredentialsForm
          email={email}
          password={password}
          isPasswordVisible={isPasswordVisible}
          hasError={Boolean(errorMessage)}
          onChangeEmail={handleChangeEmail}
          onChangePassword={handleChangePassword}
          onTogglePasswordVisibility={handleTogglePasswordVisibility}
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

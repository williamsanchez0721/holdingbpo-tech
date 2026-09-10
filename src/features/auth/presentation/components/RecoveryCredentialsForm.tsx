import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { colors } from '@shared/constants/colors';

interface RecoveryCredentialsFormProps {
  email: string;
  password: string;
  isPasswordVisible: boolean;
  hasError: boolean;
  onChangeEmail: (text: string) => void;
  onChangePassword: (text: string) => void;
  onTogglePasswordVisibility: () => void;
}

export function RecoveryCredentialsForm({
  email,
  password,
  isPasswordVisible,
  hasError,
  onChangeEmail,
  onChangePassword,
  onTogglePasswordVisibility,
}: RecoveryCredentialsFormProps) {
  const borderColor = hasError ? colors.error : colors.border;

  return (
    <View style={styles.container}>
      <View style={[styles.field, { borderColor }]}>
        <Ionicons name="mail-outline" size={18} color={colors.text} />
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={onChangeEmail}
          placeholder="Correo electrónico"
          placeholderTextColor={colors.border}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
        />
      </View>

      <View style={[styles.field, { borderColor }]}>
        <Ionicons name="lock-closed-outline" size={18} color={colors.text} />
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={onChangePassword}
          placeholder="Contraseña"
          placeholderTextColor={colors.border}
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry={!isPasswordVisible}
        />
        <Pressable onPress={onTogglePasswordVisibility} hitSlop={8}>
          <Ionicons
            name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
            size={18}
            color={colors.text}
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
  },
});

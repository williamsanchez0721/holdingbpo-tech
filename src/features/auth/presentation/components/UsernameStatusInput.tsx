import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, StyleSheet, TextInput, View } from 'react-native';

import { colors } from '@shared/constants/colors';

import { UsernameFieldStatus } from '../hooks/useCreateUsernameScreen';

interface UsernameStatusInputProps {
  value: string;
  status: UsernameFieldStatus;
  onChangeText: (text: string) => void;
}

const AVAILABLE_COLOR = '#16A34A';

const BORDER_COLOR_BY_STATUS: Record<UsernameFieldStatus, string> = {
  idle: colors.border,
  checking: colors.border,
  available: AVAILABLE_COLOR,
  taken: colors.error,
  invalid: colors.error,
};

function UsernameStatusIcon({ status }: { status: UsernameFieldStatus }) {
  if (status === 'checking') {
    return <ActivityIndicator size="small" color={colors.text} />;
  }
  if (status === 'available') {
    return <Ionicons name="checkmark-circle" size={18} color={AVAILABLE_COLOR} />;
  }
  if (status === 'taken' || status === 'invalid') {
    return <Ionicons name="close-circle" size={18} color={colors.error} />;
  }
  return null;
}

export function UsernameStatusInput({ value, status, onChangeText }: UsernameStatusInputProps) {
  return (
    <View style={[styles.container, { borderColor: BORDER_COLOR_BY_STATUS[status] }]}>
      <Ionicons name="person-outline" size={18} color={colors.text} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder="Usuario"
        placeholderTextColor={colors.border}
        autoCapitalize="none"
        autoCorrect={false}
      />
      <UsernameStatusIcon status={status} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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

import { Pressable, StyleSheet, Text } from 'react-native';

import { colors } from '@shared/constants/colors';

interface BalanceActionButtonProps {
  label: string;
  onPress?: () => void;
}

export function BalanceActionButton({ label, onPress }: BalanceActionButtonProps) {
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    backgroundColor: colors.brandButtonBackground,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  label: {
    color: colors.brandTextOnDark,
    fontSize: 14,
    fontWeight: '600',
  },
});

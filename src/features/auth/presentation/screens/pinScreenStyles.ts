import { StyleSheet } from 'react-native';

import { colors } from '@shared/constants/colors';

export const pinScreenStyles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 20,
    marginHorizontal: 24,
    marginTop: 24,
    padding: 24,
    alignItems: 'center',
    gap: 16,
  },
  instruction: {
    color: colors.text,
    fontSize: 14,
    textAlign: 'center',
  },
  error: {
    color: colors.error,
    fontSize: 12,
    textAlign: 'center',
  },
});

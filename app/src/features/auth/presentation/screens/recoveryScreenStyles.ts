import { StyleSheet } from 'react-native';

import { colors } from '@shared/constants/colors';

export const recoveryScreenStyles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 20,
    marginHorizontal: 24,
    marginTop: 24,
    padding: 20,
    gap: 16,
  },
  instruction: {
    fontSize: 13,
    color: colors.text,
    lineHeight: 20,
  },
  error: {
    color: colors.error,
    fontSize: 12,
  },
  actions: {
    marginTop: 'auto',
    paddingHorizontal: 24,
    paddingBottom: 32,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: colors.softAccentBackground,
    borderRadius: 12,
    paddingVertical: 16,
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  primaryButtonDisabled: {
    backgroundColor: colors.border,
  },
  primaryButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
});

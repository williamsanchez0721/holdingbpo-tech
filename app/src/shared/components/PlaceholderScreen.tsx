import { StyleSheet, Text } from 'react-native';

import { colors } from '@shared/constants/colors';

import { Screen } from './Screen';

interface PlaceholderScreenProps {
  title: string;
}

export function PlaceholderScreen({ title }: PlaceholderScreenProps) {
  return (
    <Screen backgroundColor={colors.screenBackgroundLight} edges={['top']} style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>Próximamente</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  subtitle: {
    fontSize: 13,
    color: colors.mutedText,
  },
});

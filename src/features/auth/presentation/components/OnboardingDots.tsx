import { StyleSheet, View } from 'react-native';

import { colors } from '@shared/constants/colors';

interface OnboardingDotsProps {
  total: number;
  activeIndex: number;
}

export function OnboardingDots({ total, activeIndex }: OnboardingDotsProps) {
  return (
    <View style={styles.row}>
      {Array.from({ length: total }).map((_, index) => (
        <View key={index} style={[styles.dot, index === activeIndex && styles.dotActive]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 24,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.brandDotInactive,
  },
  dotActive: {
    backgroundColor: colors.brandAccent,
  },
});

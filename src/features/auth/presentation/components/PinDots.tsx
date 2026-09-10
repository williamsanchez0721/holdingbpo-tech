import { StyleSheet, View } from 'react-native';

import { colors } from '@shared/constants/colors';

interface PinDotsProps {
  length: number;
  filledCount: number;
}

export function PinDots({ length, filledCount }: PinDotsProps) {
  return (
    <View style={styles.row}>
      {Array.from({ length }).map((_, index) => (
        <View key={index} style={[styles.dot, index < filledCount && styles.dotFilled]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: colors.brandAccent,
  },
  dotFilled: {
    backgroundColor: colors.brandAccent,
  },
});

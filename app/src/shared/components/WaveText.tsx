import { useEffect, useState } from 'react';
import { Animated, StyleProp, StyleSheet, TextStyle, View } from 'react-native';

interface WaveTextProps {
  text: string;
  style?: StyleProp<TextStyle>;
}

const LETTER_STAGGER_MS = 80;
const PULSE_DURATION_MS = 500;
const MIN_OPACITY = 0.35;

function createLetterWaveAnimation(
  value: Animated.Value,
  index: number,
  letterCount: number,
): Animated.CompositeAnimation {
  return Animated.loop(
    Animated.sequence([
      Animated.delay(index * LETTER_STAGGER_MS),
      Animated.timing(value, { toValue: 1, duration: PULSE_DURATION_MS, useNativeDriver: true }),
      Animated.timing(value, {
        toValue: MIN_OPACITY,
        duration: PULSE_DURATION_MS,
        useNativeDriver: true,
      }),
      Animated.delay((letterCount - 1 - index) * LETTER_STAGGER_MS),
    ]),
  );
}

export function WaveText({ text, style }: WaveTextProps) {
  const letters = text.split('');
  const [letterValues] = useState(() => letters.map(() => new Animated.Value(MIN_OPACITY)));

  useEffect(() => {
    const animations = letterValues.map((value, index) =>
      createLetterWaveAnimation(value, index, letters.length),
    );
    animations.forEach((animation) => animation.start());

    return () => animations.forEach((animation) => animation.stop());
  }, [letterValues, letters.length]);

  return (
    <View style={styles.row}>
      {letters.map((letter, index) => (
        <Animated.Text key={index} style={[style, { opacity: letterValues[index] }]}>
          {letter}
        </Animated.Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
});

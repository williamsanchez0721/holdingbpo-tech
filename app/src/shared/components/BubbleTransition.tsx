import { useEffect, useState } from 'react';
import { Animated, Dimensions, StyleSheet, View } from 'react-native';

interface BubbleTransitionProps {
  color: string;
  originX: number;
  originY: number;
  onFinished: () => void;
}

const { width, height } = Dimensions.get('window');
const BUBBLE_DIAMETER = Math.hypot(width, height) * 2.2;
const BUBBLE_DURATION_MS = 450;

export function BubbleTransition({ color, originX, originY, onFinished }: BubbleTransitionProps) {
  const [scale] = useState(() => new Animated.Value(0));

  useEffect(() => {
    const animation = Animated.timing(scale, {
      toValue: 1,
      duration: BUBBLE_DURATION_MS,
      useNativeDriver: true,
    });

    animation.start(({ finished }) => {
      if (finished) {
        onFinished();
      }
    });

    return () => animation.stop();
  }, [scale, onFinished]);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Animated.View
        style={[
          styles.circle,
          {
            backgroundColor: color,
            left: originX - BUBBLE_DIAMETER / 2,
            top: originY - BUBBLE_DIAMETER / 2,
            transform: [{ scale }],
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    position: 'absolute',
    width: BUBBLE_DIAMETER,
    height: BUBBLE_DIAMETER,
    borderRadius: BUBBLE_DIAMETER / 2,
  },
});

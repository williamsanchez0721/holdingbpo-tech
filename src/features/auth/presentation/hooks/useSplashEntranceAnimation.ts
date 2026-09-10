import { useEffect, useState } from 'react';
import { Animated } from 'react-native';

interface SplashEntranceAnimation {
  opacity: Animated.Value;
  scale: Animated.Value;
}

export function useSplashEntranceAnimation(): SplashEntranceAnimation {
  const [opacity] = useState(() => new Animated.Value(0));
  const [scale] = useState(() => new Animated.Value(0.85));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, scale]);

  return { opacity, scale };
}

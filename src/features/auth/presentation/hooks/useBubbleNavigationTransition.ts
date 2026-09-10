import { useCallback, useState } from 'react';
import { GestureResponderEvent } from 'react-native';

interface BubbleOrigin {
  x: number;
  y: number;
}

interface UseBubbleNavigationTransitionResult {
  origin: BubbleOrigin | null;
  trigger: (event: GestureResponderEvent) => void;
  handleFinished: () => void;
}

export function useBubbleNavigationTransition(
  onFinished: () => void,
): UseBubbleNavigationTransitionResult {
  const [origin, setOrigin] = useState<BubbleOrigin | null>(null);

  const trigger = useCallback((event: GestureResponderEvent) => {
    setOrigin({ x: event.nativeEvent.pageX, y: event.nativeEvent.pageY });
  }, []);

  const handleFinished = useCallback(() => {
    setOrigin(null);
    onFinished();
  }, [onFinished]);

  return { origin, trigger, handleFinished };
}

import { ReactNode } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { Edge, SafeAreaView } from 'react-native-safe-area-context';

interface ScreenProps {
  children: ReactNode;
  backgroundColor: string;
  edges?: Edge[];
  style?: StyleProp<ViewStyle>;
}

const DEFAULT_EDGES: Edge[] = ['top', 'bottom'];

export function Screen({ children, backgroundColor, edges = DEFAULT_EDGES, style }: ScreenProps) {
  return (
    <SafeAreaView edges={edges} style={[{ flex: 1, backgroundColor }, style]}>
      {children}
    </SafeAreaView>
  );
}

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { Animated, StyleSheet } from 'react-native';

import { RootStackParamList } from '@navigation/types';
import { Screen } from '@shared/components/Screen';
import { WaveText } from '@shared/components/WaveText';
import { colors } from '@shared/constants/colors';

import { useSplashEntranceAnimation } from '../hooks/useSplashEntranceAnimation';
import { useSplashRedirect } from '../hooks/useSplashRedirect';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

export function SplashScreen({ navigation }: Props) {
  const { opacity, scale } = useSplashEntranceAnimation();

  useSplashRedirect((hasExistingWallet) => {
    navigation.replace(hasExistingWallet ? 'Unlock' : 'Onboarding');
  });

  return (
    <Screen backgroundColor={colors.brandBackground} style={styles.container}>
      <Animated.View style={{ opacity, transform: [{ scale }] }}>
        <WaveText text="Guatapay" style={styles.wordmark} />
      </Animated.View>
      <StatusBar style="light" />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  wordmark: {
    color: colors.brandTextOnDark,
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
  },
});

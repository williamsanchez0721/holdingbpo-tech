import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

import { RootStackParamList } from '@navigation/types';
import { BrandLogo } from '@shared/components/BrandLogo';
import { BubbleTransition } from '@shared/components/BubbleTransition';
import { Screen } from '@shared/components/Screen';
import { colors } from '@shared/constants/colors';

import { OnboardingSlideItem } from '../components/OnboardingSlideItem';
import { ONBOARDING_SLIDES } from '../constants/onboardingSlides';
import { useBubbleNavigationTransition } from '../hooks/useBubbleNavigationTransition';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

export function OnboardingScreen({ navigation }: Props) {
  const { width } = useWindowDimensions();
  const [activeIndex, setActiveIndex] = useState(0);
  const createWallet = useBubbleNavigationTransition(() => navigation.navigate('CreatePin'));
  const recoverWallet = useBubbleNavigationTransition(() => navigation.navigate('RecoveryMethod'));

  const handleMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveIndex(index);
  };

  return (
    <Screen backgroundColor={colors.brandBackground} style={styles.container}>
      <View style={styles.logoSection}>
        <BrandLogo size={100} />
      </View>

      <FlatList
        data={ONBOARDING_SLIDES}
        keyExtractor={(slide) => slide.title}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        renderItem={({ item }) => (
          <OnboardingSlideItem
            slide={item}
            width={width}
            totalSlides={ONBOARDING_SLIDES.length}
            activeIndex={activeIndex}
          />
        )}
        style={styles.carousel}
      />

      <View style={styles.actions}>
        <Pressable style={styles.primaryButton} onPress={createWallet.trigger}>
          <Text style={styles.primaryButtonText}>Crear billetera</Text>
        </Pressable>
        <Pressable onPress={recoverWallet.trigger}>
          <Text style={styles.secondaryAction}>Recuperar billetera</Text>
        </Pressable>
      </View>

      {createWallet.origin ? (
        <BubbleTransition
          color={colors.screenBackgroundLight}
          originX={createWallet.origin.x}
          originY={createWallet.origin.y}
          onFinished={createWallet.handleFinished}
        />
      ) : null}

      {recoverWallet.origin ? (
        <BubbleTransition
          color={colors.screenBackgroundLight}
          originX={recoverWallet.origin.x}
          originY={recoverWallet.origin.y}
          onFinished={recoverWallet.handleFinished}
        />
      ) : null}

      <StatusBar style="light" />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
  },
  logoSection: {
    alignItems: 'center',
    paddingTop: 96,
  },
  carousel: {
    flex: 1,
  },
  actions: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: colors.brandButtonBackground,
    borderRadius: 12,
    paddingVertical: 16,
    alignSelf: 'stretch',
    alignItems: 'center',
    marginBottom: 16,
  },
  primaryButtonText: {
    color: colors.brandTextOnDark,
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryAction: {
    color: colors.brandTextOnDark,
    fontSize: 14,
    fontWeight: '500',
  },
});

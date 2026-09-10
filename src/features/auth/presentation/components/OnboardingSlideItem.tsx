import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@shared/constants/colors';

import { OnboardingSlide } from '../constants/onboardingSlides';

import { OnboardingDots } from './OnboardingDots';

interface OnboardingSlideItemProps {
  slide: OnboardingSlide;
  width: number;
  totalSlides: number;
  activeIndex: number;
}

export function OnboardingSlideItem({
  slide,
  width,
  totalSlides,
  activeIndex,
}: OnboardingSlideItemProps) {
  return (
    <View style={[styles.slide, { width }]}>
      <Text style={styles.title}>{slide.title}</Text>
      <Text style={styles.subtitle}>{slide.subtitle}</Text>
      <View style={styles.dots}>
        <OnboardingDots total={totalSlides} activeIndex={activeIndex} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  title: {
    color: colors.brandTextOnDark,
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    color: colors.brandMutedTextOnDark,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 12,
  },
  dots: {
    marginTop: 24,
  },
});

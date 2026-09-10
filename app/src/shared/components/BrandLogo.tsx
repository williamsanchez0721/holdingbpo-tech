import { Image } from 'react-native';

interface BrandLogoProps {
  size?: number;
}

export function BrandLogo({ size = 64 }: BrandLogoProps) {
  return (
    <Image
      source={require('../../../assets/logo.png')}
      style={{ width: size, height: size }}
      resizeMode="contain"
      accessibilityLabel="Guatapay"
    />
  );
}

import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Splash: undefined;
  Unlock: undefined;
  Onboarding: undefined;
  RecoveryMethod: undefined;
  RecoverWithEmail: undefined;
  RecoverWithSeedPhrase: undefined;
  CreatePin: { flow?: 'create' | 'recover' } | undefined;
  ConfirmPin: { pin: string; flow?: 'create' | 'recover' };
  CreateUsername: undefined;
  HomeTabs: undefined;
};

export type HomeTabParamList = {
  Inicio: undefined;
  Activos: undefined;
  Tiendas: undefined;
  Config: undefined;
};

export type HomeTabScreenProps<T extends keyof HomeTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<HomeTabParamList, T>,
  NativeStackScreenProps<RootStackParamList>
>;

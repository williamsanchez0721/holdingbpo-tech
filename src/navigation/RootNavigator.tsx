import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ConfirmPinScreen } from '@features/auth/presentation/screens/ConfirmPinScreen';
import { CreatePinScreen } from '@features/auth/presentation/screens/CreatePinScreen';
import { CreateUsernameScreen } from '@features/auth/presentation/screens/CreateUsernameScreen';
import { OnboardingScreen } from '@features/auth/presentation/screens/OnboardingScreen';
import { RecoverWithEmailScreen } from '@features/auth/presentation/screens/RecoverWithEmailScreen';
import { RecoverWithSeedPhraseScreen } from '@features/auth/presentation/screens/RecoverWithSeedPhraseScreen';
import { RecoveryMethodScreen } from '@features/auth/presentation/screens/RecoveryMethodScreen';
import { SplashScreen } from '@features/auth/presentation/screens/SplashScreen';
import { UnlockScreen } from '@features/auth/presentation/screens/UnlockScreen';

import { HomeTabNavigator } from './HomeTabNavigator';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Unlock" component={UnlockScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="RecoveryMethod" component={RecoveryMethodScreen} />
      <Stack.Screen name="RecoverWithEmail" component={RecoverWithEmailScreen} />
      <Stack.Screen name="RecoverWithSeedPhrase" component={RecoverWithSeedPhraseScreen} />
      <Stack.Screen name="CreatePin" component={CreatePinScreen} />
      <Stack.Screen name="ConfirmPin" component={ConfirmPinScreen} />
      <Stack.Screen name="CreateUsername" component={CreateUsernameScreen} />
      <Stack.Screen name="HomeTabs" component={HomeTabNavigator} />
    </Stack.Navigator>
  );
}

import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { AssetsScreen } from '@features/home/presentation/screens/AssetsScreen';
import { HomeScreen } from '@features/home/presentation/screens/HomeScreen';
import { SettingsScreen } from '@features/home/presentation/screens/SettingsScreen';
import { StoresScreen } from '@features/home/presentation/screens/StoresScreen';
import { colors } from '@shared/constants/colors';

import { HomeTabParamList } from './types';

const Tab = createBottomTabNavigator<HomeTabParamList>();

const TAB_ICONS: Record<keyof HomeTabParamList, keyof typeof Ionicons.glyphMap> = {
  Inicio: 'home',
  Activos: 'layers',
  Tiendas: 'storefront',
  Config: 'settings',
};

export function HomeTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.brandAccent,
        tabBarInactiveTintColor: colors.mutedText,
        tabBarIcon: ({ color, size }) => (
          <Ionicons
            name={TAB_ICONS[route.name as keyof HomeTabParamList]}
            size={size}
            color={color}
          />
        ),
      })}
    >
      <Tab.Screen name="Inicio" component={HomeScreen} />
      <Tab.Screen name="Activos" component={AssetsScreen} />
      <Tab.Screen name="Tiendas" component={StoresScreen} />
      <Tab.Screen name="Config" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

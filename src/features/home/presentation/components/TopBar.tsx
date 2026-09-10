import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@shared/constants/colors';

interface TopBarProps {
  username: string;
  onNotificationsPress?: () => void;
}

export function TopBar({ username, onNotificationsPress }: TopBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.identity}>
        <View style={styles.avatar} />
        <Text style={styles.username}>{username}</Text>
      </View>
      <Pressable style={styles.bellButton} onPress={onNotificationsPress} hitSlop={8}>
        <Ionicons name="notifications-outline" size={18} color={colors.text} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  identity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.cardBackground,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.brandAccent,
  },
  username: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  bellButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.cardBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@shared/constants/colors';

interface SecurityReminderCardProps {
  onPress?: () => void;
}

export function SecurityReminderCard({ onPress }: SecurityReminderCardProps) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.iconCircle}>
        <Ionicons name="lock-closed-outline" size={16} color={colors.brandAccent} />
      </View>
      <Text style={styles.text}>Crea un método de recuperación y mantén tu cuenta segura.</Text>
      <Ionicons name="chevron-forward" size={18} color={colors.text} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    marginHorizontal: 20,
    marginTop: 16,
    padding: 16,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.iconCircleBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    flex: 1,
    fontSize: 12,
    color: colors.text,
  },
});

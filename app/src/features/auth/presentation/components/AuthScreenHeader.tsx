import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@shared/constants/colors';

interface AuthScreenHeaderProps {
  title: string;
  onBackPress?: () => void;
}

export function AuthScreenHeader({ title, onBackPress }: AuthScreenHeaderProps) {
  return (
    <View style={styles.container}>
      {onBackPress ? (
        <Pressable onPress={onBackPress} hitSlop={12} style={styles.backButton}>
          <Ionicons name="chevron-back" size={22} color={colors.text} />
        </Pressable>
      ) : (
        <View style={styles.backButtonPlaceholder} />
      )}
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  backButton: {
    marginRight: 8,
  },
  backButtonPlaceholder: {
    width: 30,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
});

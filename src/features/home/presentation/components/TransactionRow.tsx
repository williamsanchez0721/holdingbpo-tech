import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@shared/constants/colors';

import { Transaction } from '../../domain/entities/Transaction';

const FAILED_ICON_BACKGROUND = '#FCE4E4';

const ICON_BY_TYPE: Record<Transaction['type'], keyof typeof Ionicons.glyphMap> = {
  sent: 'arrow-up-outline',
  received: 'arrow-down-outline',
  exchanged: 'swap-horizontal-outline',
};

interface TransactionRowProps {
  transaction: Transaction;
}

export function TransactionRow({ transaction }: TransactionRowProps) {
  const isFailed = transaction.status === 'failed';
  const iconName = isFailed ? 'close-outline' : ICON_BY_TYPE[transaction.type];

  return (
    <View style={styles.row}>
      <View style={[styles.iconCircle, isFailed && styles.iconCircleFailed]}>
        <Ionicons name={iconName} size={16} color={isFailed ? colors.error : colors.brandAccent} />
      </View>
      <View style={styles.textGroup}>
        <Text style={styles.title}>{transaction.title}</Text>
        <Text style={[styles.subtitle, isFailed && styles.subtitleFailed]}>
          {transaction.subtitle}
        </Text>
      </View>
      <View style={styles.amountGroup}>
        <Text style={styles.amount}>{transaction.amountLabel}</Text>
        <Text style={styles.date}>{transaction.dateLabel}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    gap: 12,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.iconCircleBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircleFailed: {
    backgroundColor: FAILED_ICON_BACKGROUND,
  },
  textGroup: {
    flex: 1,
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  subtitle: {
    fontSize: 11,
    color: colors.mutedText,
    marginTop: 2,
  },
  subtitleFailed: {
    color: colors.error,
  },
  amountGroup: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  date: {
    fontSize: 11,
    color: colors.mutedText,
    marginTop: 2,
  },
});

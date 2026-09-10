import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@shared/constants/colors';
import { formatCurrencyAmount } from '@shared/utils/formatCurrencyAmount';

import { WalletBalance } from '../../domain/entities/WalletBalance';

import { BalanceActionButton } from './BalanceActionButton';

interface BalanceCardProps {
  balance: WalletBalance | null;
  isVisible: boolean;
  onToggleVisibility: () => void;
}

const MASKED_AMOUNT = '$ *******';
const MASKED_CONVERTED_AMOUNT = '*******';

export function BalanceCard({ balance, isVisible, onToggleVisibility }: BalanceCardProps) {
  const amountLabel = isVisible && balance ? formatCurrencyAmount(balance.amount) : MASKED_AMOUNT;
  const convertedLabel =
    isVisible && balance
      ? `= ${formatCurrencyAmount(balance.convertedAmount)} ${balance.convertedCurrency}`
      : balance
        ? `= ${MASKED_CONVERTED_AMOUNT} ${balance.convertedCurrency}`
        : ' ';

  return (
    <View style={styles.card}>
      <Pressable style={styles.visibilityRow} onPress={onToggleVisibility}>
        <Ionicons
          name={isVisible ? 'eye-outline' : 'eye-off-outline'}
          size={16}
          color={colors.text}
        />
        <Text style={styles.label}>Balance:</Text>
      </Pressable>

      <View style={styles.amountRow}>
        <Text style={styles.amount}>{amountLabel}</Text>
        <Ionicons name="chevron-forward" size={18} color={colors.text} />
      </View>
      <Text style={styles.converted}>{convertedLabel}</Text>

      <View style={styles.actionsRow}>
        <BalanceActionButton label="Enviar" />
        <BalanceActionButton label="Recibir" />
        <BalanceActionButton label="Cambiar" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 20,
    marginHorizontal: 20,
    marginTop: 16,
    padding: 20,
  },
  visibilityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  label: {
    fontSize: 13,
    color: colors.mutedText,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  amount: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
  },
  converted: {
    fontSize: 12,
    color: colors.mutedText,
    marginTop: 4,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
});

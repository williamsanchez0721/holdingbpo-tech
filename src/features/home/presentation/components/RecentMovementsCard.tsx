import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@shared/constants/colors';

import { Transaction } from '../../domain/entities/Transaction';

import { TransactionRow } from './TransactionRow';

interface RecentMovementsCardProps {
  transactions: Transaction[];
  isAmountVisible: boolean;
  onDepositPress?: () => void;
  onViewAllPress?: () => void;
}

function EmptyMovements({ onDepositPress }: { onDepositPress?: () => void }) {
  return (
    <>
      <Text style={styles.emptyText}>Aún no tienes transacciones disponibles para mostrar...</Text>
      <Pressable style={styles.depositButton} onPress={onDepositPress}>
        <Text style={styles.depositButtonText}>Realizar depósito</Text>
      </Pressable>
    </>
  );
}

export function RecentMovementsCard({
  transactions,
  isAmountVisible,
  onDepositPress,
  onViewAllPress,
}: RecentMovementsCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Últimos movimientos</Text>
        {transactions.length > 0 ? (
          <Pressable onPress={onViewAllPress}>
            <Text style={styles.viewAll}>Ver todos</Text>
          </Pressable>
        ) : null}
      </View>

      {transactions.length === 0 ? (
        <EmptyMovements onDepositPress={onDepositPress} />
      ) : (
        transactions.map((transaction) => (
          <TransactionRow
            key={transaction.id}
            transaction={transaction}
            isAmountVisible={isAmountVisible}
          />
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 20,
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 24,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  viewAll: {
    fontSize: 12,
    color: colors.brandAccent,
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 13,
    color: colors.mutedText,
    marginTop: 16,
  },
  depositButton: {
    backgroundColor: colors.softAccentBackground,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  depositButtonText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
});

import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet } from 'react-native';

import { Screen } from '@shared/components/Screen';
import { colors } from '@shared/constants/colors';

import { BalanceCard } from '../components/BalanceCard';
import { RecentMovementsCard } from '../components/RecentMovementsCard';
import { SecurityReminderCard } from '../components/SecurityReminderCard';
import { TopBar } from '../components/TopBar';
import { useRecentTransactions } from '../hooks/useRecentTransactions';
import { useReservedUsername } from '../hooks/useReservedUsername';
import { useWalletBalance } from '../hooks/useWalletBalance';

export function HomeScreen() {
  const username = useReservedUsername();
  const { balance, isVisible, toggleVisibility } = useWalletBalance();
  const { transactions } = useRecentTransactions();

  return (
    <Screen backgroundColor={colors.screenBackgroundLight} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <TopBar username={username} />
        <BalanceCard
          balance={balance}
          isVisible={isVisible}
          onToggleVisibility={toggleVisibility}
        />
        <SecurityReminderCard />
        <RecentMovementsCard transactions={transactions} />
      </ScrollView>
      <StatusBar style="dark" />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 24,
  },
});

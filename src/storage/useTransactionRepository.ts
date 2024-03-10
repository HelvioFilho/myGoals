import { useSQLiteContext } from "expo-sqlite/next";

type TransactionCreateDatabase = {
  amount: number;
  goalId: number;
};

export function useTransactionRepository() {
  const database = useSQLiteContext();

  function create(transaction: TransactionCreateDatabase) {
    try {
      const statement = database.prepareSync(
        "INSERT INTO transactions (amount, goal_id) VALUES ($amount, $goal_id)"
      );

      statement.executeSync({
        $amount: transaction.amount,
        $goal_id: transaction.goalId,
      });
    } catch (error) {
      throw error;
    }
  }

  return {
    create,
  };
}

type TransactionCreateDatabase = {
  amount: number;
  goalId: number;
};

type TransactionResponseDatabase = {
  id: string;
  amount: number;
  goal_id: number;
  created_at: number;
};

type MockedTransaction = TransactionResponseDatabase[];

let transactions: TransactionResponseDatabase[] = [];

export const initializeTransactions = (initialData: MockedTransaction = []) => {
  transactions = [...initialData];
};

export const mockUseTransactionRepository = {
  create: jest.fn((transaction: TransactionCreateDatabase) => {
    const newTransaction: TransactionResponseDatabase = {
      id: String(transactions.length + 1),
      amount: transaction.amount,
      goal_id: transaction.goalId,
      created_at: Date.now(),
    };
    transactions.push(newTransaction);
  }),
  findByGoal: jest.fn((goalId: number) => {
    return transactions.filter((transaction) => transaction.goal_id === goalId);
  }),
  findLatest: jest.fn(() => {
    return transactions
      .sort((a, b) => b.created_at - a.created_at)
      .slice(0, 10);
  }),
};

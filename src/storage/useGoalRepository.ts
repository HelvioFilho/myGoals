import { useSQLiteContext } from "expo-sqlite/next";

export type GoalCreateDatabase = {
  name: string;
  total: number;
};

export function useGoalRepository() {
  const database = useSQLiteContext();

  function create(goal: GoalCreateDatabase) {
    try {
      const statement = database.prepareSync(
        "INSERT INTO goals (name, total) VALUES ($name, $total)"
      );

      statement.executeSync({
        $name: goal.name,
        $total: goal.total,
      });
    } catch (error) {
      throw error;
    }
  }

  return {
    create,
  };
}

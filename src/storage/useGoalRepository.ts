import { useSQLiteContext } from "expo-sqlite/next";

export type GoalCreateDatabase = {
  name: string;
  total: number;
};

export type GoalResponseDatabase = {
  id: string;
  name: string;
  total: number;
  current: number;
  completed_in: number | null;
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

  function all(hundred: boolean = true) {
    try {
      const notValue = hundred ? "NOT" : "";

      return database.getAllSync<GoalResponseDatabase>(`
        SELECT g.id, g.name, g.total, g.completed_in, COALESCE(SUM(t.amount), 0) AS current
        FROM goals AS g
        LEFT JOIN transactions t ON t.goal_id = g.id
        WHERE g.completed_in IS ${notValue} NULL
        GROUP BY g.id, g.name, g.total;
      `);
    } catch (error) {
      throw error;
    }
  }

  function show(id: number) {
    const statement = database.prepareSync(`
      SELECT g.id, g.name, g.total, g.completed_in, COALESCE(SUM(t.amount), 0) AS current
      FROM goals AS g
      LEFT JOIN transactions t ON t.goal_id = g.id
      WHERE g.id = $id
      GROUP BY g.id, g.name, g.total;
    `);

    const result = statement.executeSync<GoalResponseDatabase>({ $id: id });

    return result.getFirstSync();
  }

  function markGoalAsCompleted(goalId: number, time: number | null) {
    try {
      const statement = database.prepareSync(
        "UPDATE goals SET completed_in = ? WHERE id = ?"
      );

      statement.executeSync([time, goalId]);
    } catch (error) {
      throw error;
    }
  }

  return {
    create,
    all,
    markGoalAsCompleted,
    show,
  };
}

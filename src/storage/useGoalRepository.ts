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

type GoalUpdateDatabase = {
  id: number;
  name?: string;
  total?: number;
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

  function all(hundred: boolean) {
    try {
      const notValue = hundred ? "IS NOT NULL" : "IS NULL";

      return database.getAllSync<GoalResponseDatabase>(`
        SELECT g.id, g.name, g.total, g.completed_in, COALESCE(SUM(t.amount), 0) AS current
        FROM goals AS g
        LEFT JOIN transactions t ON t.goal_id = g.id
        WHERE g.completed_in ${notValue}
        GROUP BY g.id, g.name, g.total;
      `);
    } catch (error) {
      throw error;
    }
  }

  function update(goal: GoalUpdateDatabase) {
    try {
      const updates = [];
      const params: { [key: string]: any } = { $id: goal.id };

      if (goal.name !== undefined) {
        updates.push("name = $name");
        params.$name = goal.name;
      }
      if (goal.total !== undefined) {
        updates.push("total = $total");
        params.$total = goal.total;
      }

      const sql = `UPDATE goals SET ${updates.join(", ")} WHERE id = $id`;

      const statement = database.prepareSync(sql);
      statement.executeSync(params);
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
    update,
    markGoalAsCompleted,
    show,
  };
}

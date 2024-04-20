import {
  GoalCreateDatabase,
  GoalResponseDatabase,
} from "@/storage/useGoalRepository";

type GoalUpdateDatabase = {
  id: number;
  name: string;
  total: number;
};

type MockedData = GoalResponseDatabase[];

let data: GoalResponseDatabase[] = [];

export const initializeGoals = (initialData: MockedData = []) => {
  data = [...initialData];
};

export const mockUseGoalRepository = {
  create: jest.fn((goal: GoalCreateDatabase) => {
    data.push({
      id: String(data.length + 1),
      name: goal.name,
      total: goal.total,
      current: 0,
      completed_in: null,
    });
  }),
  deleteGoal: jest.fn((id: number) => {
    data = data.filter((item) => String(item.id) !== String(id));
  }),
  show: jest.fn((id: number) => {
    return data.find((item) => String(item.id) === String(id));
  }),
  update: jest.fn((goal: GoalUpdateDatabase) => {
    data = data.map((item) => {
      if (String(item.id) === String(goal.id)) {
        return {
          ...item,
          name: goal.name,
          total: goal.total,
        };
      }
      return item;
    });
  }),
  all: jest.fn((hundred: boolean) => {
    const dataFiltered = data.filter((item) => {
      if (hundred) {
        return item.completed_in !== null;
      } else {
        return item.completed_in === null;
      }
    });

    return dataFiltered;
  }),
  markGoalAsCompleted: jest.fn((id: string, completed_in: number | null) => {
    data = data.map((item) => {
      if (String(item.id) === String(id)) {
        return {
          ...item,
          completed_in,
        };
      }
      return item;
    });
  }),
};

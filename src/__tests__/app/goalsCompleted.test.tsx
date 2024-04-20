import { Alert } from "react-native";
import { useRouter } from "expo-router";
import GoalsCompleted from "@/app/goalsCompleted";

import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react-native";

import {
  initializeGoals,
  mockUseGoalRepository,
} from "../mocks/useGoalRepository";
import { mockUseSQLiteContext } from "../mocks/expo-sqlite-next";

jest.mock("expo-sqlite/next", () => ({
  useSQLiteContext: mockUseSQLiteContext,
}));

jest.mock("@/storage/useGoalRepository", () => ({
  useGoalRepository: () => mockUseGoalRepository,
}));

jest.mock("expo-router", () => ({
  useRouter: jest.fn().mockReturnValue({
    navigate: jest.fn(),
  }),
}));

jest.spyOn(Alert, "alert");

const data = [
  {
    id: "1",
    name: "Comprar um Carro",
    current: 60000,
    total: 60000,
    completed_in: 1641027200,
  },
  {
    id: "2",
    name: "Comprar um Notebook",
    current: 10000,
    total: 10000,
    completed_in: 1641027200,
  },
  {
    id: "3",
    name: "Comprar um Celular",
    current: 2000,
    total: 5000,
    completed_in: null,
  },
];

describe("App: Goals Completed", () => {
  it("should render correctly", () => {
    render(<GoalsCompleted />);
    expect(screen.getByText("Metas concluídas")).toBeTruthy();
    expect(screen.getByText("Ainda não há metas concluídas.")).toBeTruthy();
  });

  it("should show correctly when there is a goal completed", () => {
    initializeGoals(data);
    render(<GoalsCompleted />);

    expect(screen.getByText("Comprar um Carro")).toBeTruthy();
    expect(screen.getByText("Comprar um Notebook")).toBeTruthy();
    expect(screen.queryByText("Comprar um Celular")).toBeNull();
  });

  it("should click on a goal and navigate correctly", () => {
    initializeGoals(data);
    render(<GoalsCompleted />);

    fireEvent.press(screen.getByText("Comprar um Carro"));
    expect(useRouter().navigate).toHaveBeenCalledWith("/details/1");
  });

  it("should show the alert saying it was not possible to register", async () => {
    mockUseGoalRepository.all.mockImplementation(() => {
      throw new Error("Simulated error");
    });

    render(<GoalsCompleted />);

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        "Erro",
        "Não foi possível carregar as metas."
      );
    });
  });
});

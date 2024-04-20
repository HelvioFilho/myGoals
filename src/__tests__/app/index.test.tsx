import { Alert } from "react-native";
import { useRouter } from "expo-router";
import Home from "@/app";

import { useGoalRepository } from "@/storage/useGoalRepository";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { useTransactionRepository } from "@/storage/useTransactionRepository";

import { mockUseSQLiteContext } from "../mocks/expo-sqlite-next";
import { mockUseGoalRepository } from "../mocks/useGoalRepository";
import {
  initializeTransactions,
  mockUseTransactionRepository,
} from "../mocks/useTransactionRepository";

jest.mock("@gorhom/bottom-sheet", () => ({
  __esModule: true,
  ...require("@gorhom/bottom-sheet/mock"),
}));

jest.mock("expo-sqlite/next", () => ({
  useSQLiteContext: mockUseSQLiteContext,
}));

jest.mock("@/storage/useGoalRepository", () => ({
  useGoalRepository: () => mockUseGoalRepository,
}));

jest.mock("@/storage/useTransactionRepository", () => ({
  useTransactionRepository: () => mockUseTransactionRepository,
}));

jest.spyOn(Alert, "alert");

jest.mock("expo-router", () => ({
  useRouter: jest.fn().mockReturnValue({
    navigate: jest.fn(),
  }),
}));

const transactions = [
  {
    id: "1",
    amount: 5000,
    goal_id: 1,
    created_at: 1641027200,
  },
  {
    id: "2",
    amount: -500.75,
    goal_id: 1,
    created_at: 1641113600,
  },
  {
    id: "3",
    amount: 10000,
    goal_id: 2,
    created_at: 1641200000,
  },
];
describe("App: Home", () => {
  it("should render correctly", () => {
    initializeTransactions();
    const { debug } = render(<Home />);
    expect(screen.getByText("Suas metas")).toBeTruthy();
    expect(
      screen.getByText("Poupe hoje para colher os frutos amanhã.")
    ).toBeTruthy();
    expect(
      screen.getByText("Adicione uma nova meta para começar!")
    ).toBeTruthy();
    expect(screen.getByText("Últimas transações")).toBeTruthy();
    expect(screen.getByText("Nenhuma transação registrada.")).toBeTruthy();
    debug();
  });

  it("should call handleCreate correctly", () => {
    render(<Home />);
    fireEvent.press(screen.getByTestId("add-button"));
    fireEvent.changeText(screen.getByTestId("name-input"), "Comprar um Carro");
    fireEvent.changeText(screen.getByTestId("total-input"), "60000");
    fireEvent.press(screen.getByTestId("create-button"));

    expect(screen.getByText("Comprar um Carro")).toBeTruthy();
    expect(screen.getByText("R$ 60.000,00")).toBeTruthy();
  });

  it("should call navigate goals completed", () => {
    render(<Home />);
    fireEvent.press(screen.getByText("Metas Concluídas"));

    expect(useRouter().navigate).toHaveBeenCalledWith("/goalsCompleted");
  });

  it("should call navigate with the correct route when pressing a goal item", () => {
    render(<Home />);
    fireEvent.press(screen.getByText("Comprar um Carro"));

    expect(useRouter().navigate).toHaveBeenCalledWith("/details/1");
  });

  it("should show the alert saying it is not a number", () => {
    render(<Home />);
    fireEvent.press(screen.getByTestId("add-button"));
    fireEvent.changeText(screen.getByTestId("name-input"), "Comprar um Carro");
    fireEvent.changeText(screen.getByTestId("total-input"), "total");
    fireEvent.press(screen.getByTestId("create-button"));

    expect(Alert.alert).toHaveBeenCalledWith("Erro", "Valor inválido.");
  });

  it("should show transactions correctly", () => {
    initializeTransactions(transactions);

    render(<Home />);

    expect(screen.getByText("+ R$ 10.000,00")).toBeTruthy();
    expect(screen.getByText("19/01/1970 às 20:53")).toBeTruthy();
    expect(screen.getByText("- R$ 500,75")).toBeTruthy();
    expect(screen.getByText("19/01/1970 às 20:51")).toBeTruthy();
  });

  it("should show the alert saying it was not possible to register", () => {
    const mockedCreate = jest.fn().mockImplementation(() => {
      throw new Error("Simulated error");
    });
    jest.spyOn(useGoalRepository(), "create").mockImplementation(mockedCreate);

    render(<Home />);
    fireEvent.press(screen.getByTestId("add-button"));
    fireEvent.changeText(screen.getByTestId("name-input"), "Comprar um Carro");
    fireEvent.changeText(screen.getByTestId("total-input"), "123");
    fireEvent.press(screen.getByTestId("create-button"));

    expect(Alert.alert).toHaveBeenCalledWith(
      "Erro",
      "Não foi possível cadastrar."
    );
  });

  it("Should throw an error for not being able to fetch goals", () => {
    const mockedAll = jest.fn().mockImplementation(() => {
      throw new Error("Simulated error");
    });
    jest.spyOn(useGoalRepository(), "all").mockImplementation(mockedAll);

    render(<Home />);

    expect(Alert.alert).toHaveBeenCalledWith(
      "Erro",
      "Não foi possível carregar as metas."
    );
  });

  it("Should throw an error for not being able to fetch transactions", () => {
    const mockedFindLatest = jest.fn().mockImplementation(() => {
      throw new Error("Simulated error");
    });
    jest
      .spyOn(useTransactionRepository(), "findLatest")
      .mockImplementation(mockedFindLatest);

    render(<Home />);

    expect(Alert.alert).toHaveBeenCalledWith(
      "Erro",
      "Não foi possível carregar as transações."
    );
  });
});

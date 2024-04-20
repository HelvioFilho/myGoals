import { Alert } from "react-native";
import { useRouter } from "expo-router";
import { fireEvent, render, screen } from "@testing-library/react-native";
import Details from "@/app/details/[id]";

import { mockUseSQLiteContext } from "@/__tests__/mocks/expo-sqlite-next";
import {
  initializeGoals,
  mockUseGoalRepository,
} from "@/__tests__/mocks/useGoalRepository";
import { mockUseTransactionRepository } from "@/__tests__/mocks/useTransactionRepository";
import { useGoalRepository } from "@/storage/useGoalRepository";
import { useTransactionRepository } from "@/storage/useTransactionRepository";

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
  useLocalSearchParams: jest.fn().mockReturnValue({ id: "1" }),
  useRouter: jest.fn().mockReturnValue({
    back: jest.fn(),
  }),
}));

const data = [
  {
    id: "1",
    name: "Comprar um Carro",
    current: 0,
    total: 60000,
    completed_in: null,
  },
  {
    id: "2",
    name: "Comprar um Livro",
    current: 90,
    total: 100,
    completed_in: null,
  },
];

describe("App: Details", () => {
  beforeEach(() => {
    initializeGoals(data);
  });

  it("should go back when goal or transaction is not found", () => {
    initializeGoals();
    render(<Details />);
    expect(useRouter().back).toHaveBeenCalled();
  });

  it("should delete goal successfully", () => {
    render(<Details />);

    fireEvent.press(screen.getByTestId("settings-button"));
    fireEvent.press(screen.getByText("Excluir"));

    expect(Alert.alert).toHaveBeenCalledWith(
      "Remover Meta",
      "Tem certeza que deseja remover esta meta? Essa ação não pode ser desfeita!",
      expect.arrayContaining([
        expect.objectContaining({
          text: "Cancelar",
          style: "cancel",
        }),
        expect.objectContaining({
          text: "Remover",
          onPress: expect.any(Function),
        }),
      ])
    );

    const removeButton = (Alert.alert as jest.Mock).mock.calls[0][2][1];

    removeButton.onPress();

    expect(mockUseGoalRepository.deleteGoal).toHaveBeenCalledWith(1);
    expect(useRouter().back).toHaveBeenCalled();
  });

  it("should render correctly", () => {
    render(<Details />);
    expect(screen.getByText("Comprar um Carro")).toBeTruthy();
    expect(screen.getByText("R$ 0,00 de R$ 60.000,00")).toBeTruthy();
    expect(screen.getByText("0%")).toBeTruthy();
  });

  it("should register a new transaction correctly", () => {
    render(<Details />);

    fireEvent.press(screen.getByTestId("add-transaction-button"));
    fireEvent.press(screen.getByText("Depósito"));
    fireEvent.changeText(screen.getByTestId("amount-input"), "5000");
    fireEvent.press(screen.getByTestId("register-transaction-button"));

    expect(Alert.alert).toHaveBeenCalledWith(
      "Sucesso",
      "Transação registrada!"
    );
  });

  it("should register a new transaction correctly with negative amount", () => {
    render(<Details />);

    fireEvent.press(screen.getByTestId("add-transaction-button"));
    fireEvent.press(screen.getByText("Saque"));
    fireEvent.changeText(screen.getByTestId("amount-input"), "3000");
    fireEvent.press(screen.getByTestId("register-transaction-button"));

    expect(Alert.alert).toHaveBeenCalledWith(
      "Sucesso",
      "Transação registrada!"
    );
  });

  it("should call alert if amount is not a number", () => {
    render(<Details />);

    fireEvent.press(screen.getByTestId("add-transaction-button"));
    fireEvent.press(screen.getByText("Saque"));
    fireEvent.changeText(screen.getByTestId("amount-input"), "abc");
    fireEvent.press(screen.getByTestId("register-transaction-button"));

    expect(Alert.alert).toHaveBeenCalledWith("Erro", "Valor inválido.");
  });

  it("should change name and total of goal successfully", () => {
    render(<Details />);

    fireEvent.press(screen.getByTestId("settings-button"));
    fireEvent.press(screen.getByText("Editar"));

    fireEvent.changeText(screen.getByTestId("name-input"), "Nova Meta");
    fireEvent.changeText(screen.getByTestId("total-input"), "75000");
    fireEvent.press(screen.getByText("Alterar"));

    expect(Alert.alert).toHaveBeenCalledWith(
      "Sucesso",
      "Meta Alterada com sucesso!"
    );
  });

  it("should show an error message if the total is not valid number", () => {
    render(<Details />);

    fireEvent.press(screen.getByTestId("settings-button"));
    fireEvent.press(screen.getByText("Editar"));

    fireEvent.changeText(screen.getByTestId("name-input"), "Nova Meta");
    fireEvent.changeText(screen.getByTestId("total-input"), "5df3");
    fireEvent.press(screen.getByText("Alterar"));

    expect(Alert.alert).toHaveBeenCalledWith(
      "Erro",
      "Valor da meta deve ser um número válido."
    );
  });

  it("should show an error message if the name is empty", () => {
    render(<Details />);

    fireEvent.press(screen.getByTestId("settings-button"));
    fireEvent.press(screen.getByText("Editar"));

    fireEvent.changeText(screen.getByTestId("name-input"), "");
    fireEvent.changeText(screen.getByTestId("total-input"), "0");
    fireEvent.press(screen.getByText("Alterar"));

    expect(Alert.alert).toHaveBeenCalledWith(
      "Erro",
      "Nome e valor da meta devem ser informados."
    );
  });

  it("should mark goal as completed successfully", () => {
    const data = [
      {
        id: "1",
        name: "Comprar um Carro",
        current: 60000,
        total: 60000,
        completed_in: null,
      },
      {
        id: "2",
        name: "Comprar um Livro",
        current: 90,
        total: 100,
        completed_in: null,
      },
    ];

    initializeGoals(data);
    render(<Details />);
    expect(screen.getByText("100%")).toBeTruthy();
  });

  it("should unmark goal as completed successfully", () => {
    const data = [
      {
        id: "1",
        name: "Comprar um Carro",
        current: 50000,
        total: 60000,
        completed_in: new Date().getTime() / 1000,
      },
      {
        id: "2",
        name: "Comprar um Livro",
        current: 90,
        total: 100,
        completed_in: null,
      },
    ];

    initializeGoals(data);
    render(<Details />);
    expect(screen.getByText("83%")).toBeTruthy();
  });

  it("should throw an error message if it is not possible to add a new transaction", () => {
    const mockedCreate = jest.fn().mockImplementation(() => {
      throw new Error("Simulated error");
    });

    jest
      .spyOn(useTransactionRepository(), "create")
      .mockImplementation(mockedCreate);

    render(<Details />);

    fireEvent.press(screen.getByTestId("add-transaction-button"));
    fireEvent.press(screen.getByText("Saque"));
    fireEvent.changeText(screen.getByTestId("amount-input"), "3000");
    fireEvent.press(screen.getByTestId("register-transaction-button"));

    expect(Alert.alert).toHaveBeenCalledWith(
      "Erro",
      "Não foi possível registrar a transação."
    );
  });

  it("should throw an error message if it is not possible to update goal", () => {
    const mockedUpdate = jest.fn().mockImplementation(() => {
      throw new Error("Simulated error");
    });

    jest.spyOn(useGoalRepository(), "update").mockImplementation(mockedUpdate);

    render(<Details />);

    fireEvent.press(screen.getByTestId("settings-button"));
    fireEvent.press(screen.getByText("Editar"));

    fireEvent.changeText(screen.getByTestId("name-input"), "Nova Meta");
    fireEvent.changeText(screen.getByTestId("total-input"), "75000");

    fireEvent.press(screen.getByText("Alterar"));

    expect(Alert.alert).toHaveBeenCalledWith(
      "Erro",
      "Não foi possível editar a meta."
    );
  });

  it("should throw an error message if goal is not found", () => {
    const mockedShow = jest.fn().mockImplementation(() => {
      throw new Error("Simulated error");
    });

    jest.spyOn(useGoalRepository(), "show").mockImplementation(mockedShow);

    render(<Details />);
    expect(Alert.alert).toHaveBeenCalledWith(
      "Erro",
      "Não foi possível carregar as metas ou transações."
    );
  });
});

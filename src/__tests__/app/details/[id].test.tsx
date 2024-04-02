import Details from "@/app/details/[id]";
import { useGoalRepository } from "@/storage/useGoalRepository";
import { useTransactionRepository } from "@/storage/useTransactionRepository";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { useRouter } from "expo-router";
import { Alert } from "react-native";

const mockedUseGoalRepository = useGoalRepository as jest.Mock;

jest.mock("@gorhom/bottom-sheet", () => ({
  __esModule: true,
  ...require("@gorhom/bottom-sheet/mock"),
}));

jest.mock("expo-sqlite/next", () => ({
  useSQLiteContext: jest.fn().mockReturnValue({
    prepareSync: jest.fn().mockReturnValue({
      executeSync: jest.fn(),
    }),
    getAllSync: jest.fn(),
  }),
}));

jest.mock("@/storage/useGoalRepository", () => ({
  useGoalRepository: jest.fn().mockReturnValue({
    show: jest.fn().mockReturnValue({
      id: 1 || undefined,
      name: "Comprar um Carro",
      current: 10003.7,
      total: 60000,
    }),
  }),
}));

jest.mock("@/storage/useTransactionRepository", () => ({
  useTransactionRepository: jest.fn().mockReturnValue({
    findByGoal: jest.fn().mockReturnValue([
      {
        date: new Date(),
        amount: 10003.7,
      },
    ]),
    create: jest.fn(),
  }),
}));

jest.spyOn(Alert, "alert");

jest.mock("expo-router", () => ({
  useLocalSearchParams: jest.fn().mockReturnValue({ id: "1" }),
  useRouter: jest.fn().mockReturnValue({
    back: jest.fn(),
  }),
}));

describe("App: Details", () => {
  it("should render correctly", () => {
    render(<Details />);
    expect(screen.getByText("Comprar um Carro")).toBeTruthy();
    expect(screen.getByText("R$ 10.003,70 de R$ 60.000,00")).toBeTruthy();
    expect(screen.getByText("17%")).toBeTruthy();
  });

  it("should register a new transaction correctly", () => {
    render(<Details />);

    fireEvent.press(screen.getByTestId("add-transaction-button"));
    fireEvent.press(screen.getByText("Saque"));
    fireEvent.changeText(screen.getByTestId("amount-input"), "5000");
    fireEvent.press(screen.getByTestId("register-transaction-button"));

    expect(Alert.alert).toHaveBeenCalledWith(
      "Sucesso",
      "Transação registrada!"
    );
  });

  it("should register a new transaction correctly with positive amount", () => {
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

  it("should call alert if amount is not a number", () => {
    render(<Details />);

    fireEvent.press(screen.getByTestId("add-transaction-button"));
    fireEvent.press(screen.getByText("Saque"));
    fireEvent.changeText(screen.getByTestId("amount-input"), "abc");
    fireEvent.press(screen.getByTestId("register-transaction-button"));

    expect(Alert.alert).toHaveBeenCalledWith("Erro", "Valor inválido.");
  });
  it("Should throw an error for not being able to add new transaction", () => {
    const mockedCreate = jest.fn().mockImplementation(() => {
      throw new Error("Simulated error");
    });
    jest
      .spyOn(useTransactionRepository(), "create")
      .mockImplementation(mockedCreate);

    render(<Details />);

    fireEvent.press(screen.getByTestId("add-transaction-button"));
    fireEvent.press(screen.getByText("Saque"));
    fireEvent.changeText(screen.getByTestId("amount-input"), "5000");
    fireEvent.press(screen.getByTestId("register-transaction-button"));

    expect(Alert.alert).toHaveBeenCalledWith(
      "Erro",
      "Não foi possível registrar a transação."
    );
  });

  it("should return to home when there is no goal", () => {
    mockedUseGoalRepository.mockImplementation(() => ({
      show: jest.fn().mockReturnValue(undefined),
    }));

    render(<Details />);
    expect(useRouter().back).toHaveBeenCalled();
  });

  it("should throw an error for not being able to fetch transactions", () => {
    const mockedFindByGoal = jest.fn().mockImplementation(() => {
      throw new Error("Simulated error");
    });
    jest
      .spyOn(useTransactionRepository(), "findByGoal")
      .mockImplementation(mockedFindByGoal);

    render(<Details />);

    expect(Alert.alert).toHaveBeenCalledWith(
      "Erro",
      "Não foi possível carregar as transações."
    );
  });
});

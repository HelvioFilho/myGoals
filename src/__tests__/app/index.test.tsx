import Home from "@/app";
import { useGoalRepository } from "@/storage/useGoalRepository";
import { useTransactionRepository } from "@/storage/useTransactionRepository";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { useRouter } from "expo-router";
import { Alert } from "react-native";

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
    create: jest.fn(),
    all: jest.fn().mockReturnValue([
      {
        id: "1",
        name: "Comprar um Carro",
        current: 10003.7,
        total: 60000,
      },
    ]),
    show: jest.fn().mockReturnValue({
      id: "1",
      name: "Comprar um Carro",
      current: 10003.7,
      total: 60000,
    }),
  }),
}));

jest.mock("@/storage/useTransactionRepository", () => ({
  useTransactionRepository: jest.fn().mockReturnValue({
    findLatest: jest.fn().mockReturnValue([
      {
        id: "1",
        name: "Comprar um Carro",
        amount: 10003.7,
        created_at: new Date(),
      },
    ]),
  }),
}));

jest.spyOn(Alert, "alert");

jest.mock("expo-router", () => ({
  useRouter: jest.fn().mockReturnValue({
    navigate: jest.fn(),
  }),
}));

describe("App: Home", () => {
  it("should render correctly", () => {
    render(<Home />);
    expect(screen.getByText("Suas metas")).toBeTruthy();
    expect(
      screen.getByText("Poupe hoje para colher os frutos amanhã.")
    ).toBeTruthy();
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

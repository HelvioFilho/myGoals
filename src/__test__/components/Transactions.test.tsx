import { Transactions } from "@/components/Transactions";
import { render, screen } from "@testing-library/react-native";

const transactions = [
  {
    date: "01/01/2022",
    amount: -100,
  },
];

describe("Component: Transactions", () => {
  it("should render correctly", () => {
    render(<Transactions transactions={transactions} />);
    expect(screen.getByText("Últimas transações")).toBeTruthy();
    expect(screen.getByText("- R$ 100,00")).toBeTruthy();
    expect(screen.getByText("01/01/2022")).toBeTruthy();
  });

  it("should render correctly empty", () => {
    render(<Transactions transactions={[]} />);
    expect(screen.getByText("Últimas transações")).toBeTruthy();
    expect(screen.getByText("Nenhuma transação registrada.")).toBeTruthy();
  });
});

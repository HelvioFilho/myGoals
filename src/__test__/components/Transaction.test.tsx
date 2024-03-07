import { Transaction } from "@/components/Transaction";
import { render, screen } from "@testing-library/react-native";

const transaction = {
  date: "01/01/2022",
  amount: -100,
};

describe("Component: Transaction", () => {
  it("should render correctly", () => {
    render(<Transaction transaction={transaction} />);
    expect(screen.getByText("- R$ 100,00")).toBeTruthy();
    expect(screen.getByText("01/01/2022")).toBeTruthy();
  });
});

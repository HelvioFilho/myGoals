import { TransactionTypeSelect } from "@/components/TransactionTypeSelect";
import { fireEvent, render, screen } from "@testing-library/react-native";

const onChange = jest.fn();
describe("Component: TransactionTypeSelect", () => {
  it("should render correctly", () => {
    render(<TransactionTypeSelect selected="up" onChange={jest.fn()} />);
    expect(screen.getByText("Depósito")).toBeTruthy();
    expect(screen.getByText("Saque")).toBeTruthy();
  });

  it("should call onChange correctly", () => {
    render(<TransactionTypeSelect selected="up" onChange={onChange} />);
    fireEvent.press(screen.getByText("Saque"));
    expect(onChange).toHaveBeenCalledTimes(1);

    fireEvent.press(screen.getByText("Depósito"));
    expect(onChange).toHaveBeenCalledTimes(2);
  });
});

import { TransactionTypeSelect } from "@/components/TransactionTypeSelect";
import { fireEvent, render, screen } from "@testing-library/react-native";

describe("Component: TransactionTypeSelect", () => {
  it("should render correctly", () => {
    render(<TransactionTypeSelect selected="up" onChange={jest.fn()} />);
    expect(screen.getByText("Depósito")).toBeTruthy();
    expect(screen.getByText("Saque")).toBeTruthy();
  });

  it("should call onChange correctly", () => {
    const onChange = jest.fn();
    render(<TransactionTypeSelect selected="up" onChange={onChange} />);
    fireEvent.press(screen.getByText("Saque"));
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("should render correctly selected false", () => {
    render(<TransactionTypeSelect selected="down" onChange={jest.fn()} />);
    expect(screen.getByText("Depósito")).toBeTruthy();
    expect(screen.getByText("Saque")).toBeTruthy();
  });
});

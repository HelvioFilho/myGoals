import { Goals } from "@/components/Goals";
import { render, screen, fireEvent } from "@testing-library/react-native";

const goal = [
  {
    id: "1",
    name: "Comprar um Carro",
    current: 10003.7,
    total: 60000,
  },
];

const onAdd = jest.fn();
const onPress = jest.fn();

describe("Component: Goals", () => {
  it("should render correctly", () => {
    render(<Goals goals={goal} onAdd={onAdd} onPress={onPress} />);
    expect(screen.getByText("Comprar um Carro")).toBeTruthy();
    expect(screen.getByText("R$ 10.003,70")).toBeTruthy();
    expect(screen.getByText("R$ 60.000,00")).toBeTruthy();
    expect(screen.getByText("17%")).toBeTruthy();

    expect(onAdd).toHaveBeenCalledTimes(0);
    expect(onPress).toHaveBeenCalledTimes(0);
  });

  it("should call onPress correctly", () => {
    render(<Goals goals={goal} onAdd={onAdd} onPress={onPress} />);
    fireEvent.press(screen.getByText("Comprar um Carro"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("should call onAdd correctly", () => {
    render(<Goals goals={goal} onAdd={onAdd} onPress={onPress} />);
    fireEvent.press(screen.getByTestId("add-button"));
    expect(onAdd).toHaveBeenCalledTimes(1);
  });
});

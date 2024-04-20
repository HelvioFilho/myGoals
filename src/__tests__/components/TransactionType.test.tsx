import { TransactionType } from "@/components/TransactionType";
import { colors } from "@/theme/colors";
import { MaterialIcons } from "@expo/vector-icons";
import { fireEvent, render, screen } from "@testing-library/react-native";

jest.mock("@expo/vector-icons", () => ({
  MaterialIcons: {
    glyphMap: {
      add: "add",
    },
  },
}));

describe("Component: TransactionType", () => {
  const type = {
    icon: "add" as keyof typeof MaterialIcons.glyphMap,
    title: "Depósito",
    color: colors.customGreen[500],
    selected: true,
  };
  it("should render correctly", () => {
    render(<TransactionType type={type} />);
    expect(screen.getByText("Depósito")).toBeTruthy();
  });

  it("should render correctly selected false", () => {
    const data = {
      ...type,
      selected: false,
    };
    render(<TransactionType type={data} />);
    expect(screen.getByText("Depósito")).toBeTruthy();
    expect(
      screen.getByTestId("transaction-type-button").props.style?.opacity
    ).toBe(0.5);
  });

  it("should press correctly", () => {
    const onPress = jest.fn();
    render(<TransactionType type={type} onPress={onPress} />);
    fireEvent.press(screen.getByTestId("transaction-type-button"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("should render icon correctly", () => {
    const icon = MaterialIcons.glyphMap.add;
    render(<TransactionType type={type} />);
    expect(icon).toBe("add");
  });
});

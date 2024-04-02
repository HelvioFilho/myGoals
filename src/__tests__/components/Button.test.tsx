import { Button } from "@/components/Button";
import { fireEvent, render, screen } from "@testing-library/react-native";

describe("Component: Button", () => {
  it("should render correctly", () => {
    render(<Button title="Title" />);
    expect(screen.getByText("Title")).toBeTruthy();
  });

  it("should call onPress correctly", () => {
    const onPress = jest.fn();
    render(<Button title="Title" onPress={onPress} />);
    fireEvent.press(screen.getByText("Title"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});

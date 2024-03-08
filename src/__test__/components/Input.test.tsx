import { Input } from "@/components/Input";
import { render, screen } from "@testing-library/react-native";

describe("Component: Input", () => {
  it("should render correctly", () => {
    render(<Input value="test" placeholder="Placeholder" />);
    expect(screen.getByPlaceholderText("Placeholder")).toBeTruthy();
    expect(screen.getByDisplayValue("test")).toBeTruthy();
  });
});

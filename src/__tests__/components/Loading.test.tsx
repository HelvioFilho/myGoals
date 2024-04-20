import { Loading } from "@/components/Loading";
import { colors } from "@/theme/colors";
import { render, screen } from "@testing-library/react-native";

describe("Component: Loading", () => {
  it("should render correctly", () => {
    render(<Loading />);
    expect(screen.getByTestId("loading")).toBeTruthy();
  });

  it("should show loading color", () => {
    render(<Loading />);
    expect(screen.getByTestId("loading").props.color).toBe(colors.white);
  });
});

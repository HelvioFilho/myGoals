import { Progress } from "@/components/Progress";
import { render, screen } from "@testing-library/react-native";

describe("Component: Progress", () => {
  it("should render correctly", () => {
    render(<Progress percentage={60} />);
    expect(screen.getByText("60%")).toBeTruthy();
  });

  it("should render correctly below 60%", () => {
    render(<Progress percentage={55} />);
    expect(screen.getByText("55%")).toBeTruthy();
  });
});

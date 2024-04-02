import { Progress } from "@/components/Progress";
import { render, screen } from "@testing-library/react-native";

describe("Component: Progress", () => {
  it("should render correctly", () => {
    render(<Progress percentage={110} />);
    expect(screen.getByText("110%")).toBeTruthy();
  });

  it("should render correctly below 60%", () => {
    render(<Progress percentage={55} />);
    expect(screen.getByText("55%")).toBeTruthy();
  });

  it("should render when percentage is 0", () => {
    render(<Progress percentage={0} />);
    expect(screen.getByText("0%")).toBeTruthy();
  });
});

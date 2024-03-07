import Home from "@/app";
import { render, screen } from "@testing-library/react-native";

describe("App: Home", () => {
  it("should render correctly", () => {
    render(<Home />);
    expect(screen.getByText("Home")).toBeTruthy();
  });
});

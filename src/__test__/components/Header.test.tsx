import { render, screen } from "@testing-library/react-native";
import { Header } from "@/components/Header";

describe("Component: Header", () => {
  it("should render correctly", () => {
    render(<Header title="Title" subtitle="Subtitle" />);
    expect(screen.getByText("Title")).toBeTruthy();
    expect(screen.getByText("Subtitle")).toBeTruthy();
  });
});

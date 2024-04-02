import { Goal } from "@/components/Goal";
import { render, screen } from "@testing-library/react-native";

const goal = {
  name: "Comprar um livro",
  current: 80,
  total: 100,
};
describe("Component: Goal", () => {
  it("should render correctly", () => {
    render(<Goal goal={goal} />);
    expect(screen.getByText("Comprar um livro")).toBeTruthy();
    expect(screen.getByText("R$ 80,00")).toBeTruthy();
    expect(screen.getByText("R$ 100,00")).toBeTruthy();
    expect(screen.getByText("80%")).toBeTruthy();
  });
});

import { GoalCompleted } from "@/components/GoalCompleted";
import { render, screen } from "@testing-library/react-native";

const goal = {
  name: "Comprar um livro",
  current: 100,
  total: 100,
  completed_in: 1641027200,
};

describe("Component: GoalCompleted", () => {
  it("should render correctly", () => {
    render(<GoalCompleted goal={goal} />);
    expect(screen.getByText("Comprar um livro")).toBeTruthy();
    expect(screen.getByText("Arrecadado: R$ 100,00")).toBeTruthy();
    expect(screen.getByText("Meta: R$ 100,00")).toBeTruthy();
    expect(screen.getByText("100%")).toBeTruthy();
    expect(screen.getByText("Concluída em: 01/01/2022 às 05:53")).toBeTruthy();
  });
});

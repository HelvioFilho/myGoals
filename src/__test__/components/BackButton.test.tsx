import { useRouter } from "expo-router";
import { BackButton } from "@/components/BackButton";
import { fireEvent, render, screen } from "@testing-library/react-native";

jest.mock("expo-router", () => ({
  useRouter: jest.fn(() => ({
    back: jest.fn(),
  })),
}));

describe("Component: BackButton", () => {
  it("should render correctly", () => {
    render(<BackButton />);
    expect(screen.getByTestId("back-button")).toBeTruthy();
  });

  it("should call onPress correctly", () => {
    const { back } = useRouter();
    (useRouter as any).mockImplementation(() => ({
      back,
    }));
    render(<BackButton />);
    fireEvent.press(screen.getByTestId("back-button"));
    expect(back).toHaveBeenCalledTimes(1);
  });
});

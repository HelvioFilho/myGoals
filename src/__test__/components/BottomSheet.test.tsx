import { BottomSheet } from "@/components/BottomSheet";
import { render, screen } from "@testing-library/react-native";

jest.mock("@gorhom/bottom-sheet", () => ({
  __esModule: true,
  ...require("@gorhom/bottom-sheet/mock"),
}));
describe("Component: BottomSheet", () => {
  it("should render correctly", () => {
    render(
      <BottomSheet
        title="Title"
        snapPoints={[100, 200]}
        onClose={() => {}}
        children={null}
      />
    );

    expect(screen.getByText("Title")).toBeTruthy();
  });
});

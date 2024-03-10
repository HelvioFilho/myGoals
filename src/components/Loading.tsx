import { ActivityIndicator } from "react-native";

import { colors } from "@/theme/colors";

export function Loading() {
  return (
    <ActivityIndicator
      testID="loading"
      className="flex-1 items-center justify-center bg-gray-600"
      color={colors.green[500]}
    />
  );
}

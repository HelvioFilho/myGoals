import { useRouter } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { colors } from "@/theme/colors";
import { Pressable } from "react-native";

export function BackButton() {
  const { back } = useRouter();
  function handlePress() {
    back();
  }

  return (
    <Pressable testID="back-button" onPress={handlePress}>
      <MaterialIcons name="arrow-back" size={36} color={colors.white} />
    </Pressable>
  );
}

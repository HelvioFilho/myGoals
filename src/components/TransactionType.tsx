import { Text, ColorValue, Pressable, PressableProps } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

type TypeProps = {
  title: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  color: ColorValue;
  selected: boolean;
};

type TransactionTypeProps = PressableProps & {
  type: TypeProps;
};

export function TransactionType({ type, ...rest }: TransactionTypeProps) {
  return (
    <Pressable
      testID="transaction-type-button"
      className="px-4 py-2 bg-blue-500 rounded-sm flex-row items-center gap-2"
      style={{ opacity: type.selected ? 1 : 0.5 }}
      {...rest}
    >
      <MaterialIcons name={type.icon} color={type.color} size={16} />
      <Text className="text-white font-semiBold text-sm">{type.title}</Text>
    </Pressable>
  );
}

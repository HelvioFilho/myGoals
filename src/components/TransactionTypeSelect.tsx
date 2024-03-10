import { View } from "react-native";

import { TransactionType } from "@/components/TransactionType";

import { colors } from "@/theme/colors";

type TransactionType = "up" | "down";

type TransactionTypeSelectProps = {
  selected: TransactionType;
  onChange: (type: TransactionType) => void;
};

export function TransactionTypeSelect({
  selected,
  onChange,
}: TransactionTypeSelectProps) {
  return (
    <View className="flex-row gap-4">
      <TransactionType
        type={{
          icon: "add",
          title: "Depósito",
          color: colors.green[500],
          selected: selected === "up",
        }}
        onPress={() => onChange("up")}
      />

      <TransactionType
        type={{
          icon: "remove",
          title: "Saque",
          color: colors.red[500],
          selected: selected === "down",
        }}
        onPress={() => onChange("down")}
      />
    </View>
  );
}

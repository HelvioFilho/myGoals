import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import { Goal } from "./Goal";

import { colors } from "@/theme/colors";

export type GoalsProps = {
  id: string;
  name: string;
  current: number;
  total: number;
}[];

type Props = {
  goals: GoalsProps;
  onPress: (id: string) => void;
  onAdd: () => void;
};

export function Goals({ goals, onPress, onAdd }: Props) {
  return (
    <ScrollView
      className="w-full max-h-44"
      horizontal
      contentContainerClassName="gap-4"
      showsHorizontalScrollIndicator={false}
    >
      <TouchableOpacity
        className="bg-green-600 w-16 h-44 max-h-44 items-center justify-center rounded-lg"
        activeOpacity={0.8}
        onPress={onAdd}
        testID="add-button"
      >
        <MaterialIcons name="add" size={36} color={colors.white} />
      </TouchableOpacity>

      {goals.length > 0 ? (
        goals.map(({ id, name, current, total }) => (
          <Goal
            key={id}
            goal={{ name, current, total }}
            onPress={() => onPress(id)}
          />
        ))
      ) : (
        <View className="h-44 max-h-44 items-center justify-center">
          <Text className="text-white font-semiBold text-lg text-center">
            Adicione uma nova {"\n"} meta para começar!
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

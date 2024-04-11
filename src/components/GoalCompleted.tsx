import { currencyFormat } from "@/utils/currencyFormat";
import { formatDate } from "@/utils/formatDate";
import { Text, TouchableOpacity, TouchableOpacityProps } from "react-native";
import { Progress } from "./Progress";

export type GoalProps = {
  name: string;
  current: number;
  total: number;
  completed_in: number | null;
};

type Props = TouchableOpacityProps & {
  goal: GoalProps;
};

export function GoalCompleted({ goal, ...rest }: Props) {
  const percentage = (goal.current / goal.total) * 100;
  const date = goal.completed_in && formatDate(goal.completed_in);

  return (
    <TouchableOpacity
      className="w-full bg-gray-500 rounded-lg p-4 my-2"
      activeOpacity={0.7}
      {...rest}
    >
      <Text className="text-white font-bold text-lg mb-3">{goal.name}</Text>

      <Text className="text-white font-semiBold text-sm">
        Arrecadado: {currencyFormat(goal.current)}
      </Text>

      <Text className="text-gray-300 font-regular text-sm flex-1">
        Meta: {currencyFormat(goal.total)}
      </Text>
      <Text className="text-gray-300 font-semiBold text-sm flex-1 mb-8 mt-2">
        Concluída em: {date}
      </Text>
      <Progress percentage={percentage} />
    </TouchableOpacity>
  );
}

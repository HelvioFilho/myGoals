import { Pressable, PressableProps, Text } from "react-native";

import { currencyFormat } from "@/utils/currencyFormat";
import { colors } from "@/theme/colors";

export type TransactionProps = {
  date: string;
  amount: number;
};

type Props = PressableProps & {
  transaction: TransactionProps;
};

export function Transaction({ transaction, ...rest }: Props) {
  return (
    <Pressable
      className={`
        w-full 
        h-16 
        bg-gray-100 
        rounded-xl 
        border 
        p-4 
        flex-row 
        items-center 
        justify-between
        ${transaction.amount < 0 ? "border-red-400" : "border-customGreen-100"}
      `}
      {...rest}
    >
      <Text
        className={`
          font-regular 
          text-sm
          ${transaction.amount < 0 ? "text-red-700" : "text-green-600"}`}
      >
        {transaction.amount < 0 ? "- " : "+ "}
        {currencyFormat(transaction.amount).replace("-", "")}
      </Text>

      <Text className="text-black font-regular text-sm tracking-widest">
        {transaction.date}
      </Text>
    </Pressable>
  );
}

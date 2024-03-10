import { useEffect, useRef, useState } from "react";
import { Alert, Keyboard, View } from "react-native";
import Bottom from "@gorhom/bottom-sheet";
import { useLocalSearchParams, useRouter } from "expo-router";

import { useGoalRepository } from "@/storage/useGoalRepository";

import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { Header } from "@/components/Header";
import { Loading } from "@/components/Loading";
import { Progress } from "@/components/Progress";
import { BackButton } from "@/components/BackButton";
import { BottomSheet } from "@/components/BottomSheet";
import { Transactions } from "@/components/Transactions";
import { TransactionProps } from "@/components/Transaction";
import { TransactionTypeSelect } from "@/components/TransactionTypeSelect";

import { currencyFormat } from "@/utils/currencyFormat";
import dayjs from "dayjs";
import { mocks } from "@/utils/mocks";

type DetailsProps = {
  name: string;
  total: string;
  current: string;
  percentage: number;
  transactions: TransactionProps[];
};
export default function Details() {
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [type, setType] = useState<"up" | "down">("up");
  const [goal, setGoal] = useState<DetailsProps>({} as DetailsProps);

  const useGoal = useGoalRepository();

  const routeParams = useLocalSearchParams();
  const goalId = Number(routeParams.id);
  const { back } = useRouter();

  const bottomSheetRef = useRef<Bottom>(null);
  const handleBottomSheetOpen = () => bottomSheetRef.current?.expand();
  const handleBottomSheetClose = () => bottomSheetRef.current?.snapToIndex(0);

  function fetchDetails() {
    try {
      if (goalId) {
        const goal = useGoal.show(goalId);
        const transactions = mocks.transactions;

        if (!goal || !transactions) {
          return back();
        }

        setGoal({
          name: goal.name,
          current: currencyFormat(goal.current),
          total: currencyFormat(goal.total),
          percentage: (goal.current / goal.total) * 100,
          transactions: transactions.map((item) => ({
            ...item,
            date: dayjs(item.created_at).format("DD/MM/YYYY [às] HH:mm"),
          })),
        });

        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function handleNewTransaction() {
    try {
      let amountAsNumber = Number(amount.replace(",", "."));

      if (isNaN(amountAsNumber)) {
        return Alert.alert("Erro", "Valor inválido.");
      }

      if (type === "down") {
        amountAsNumber = amountAsNumber * -1;
      }

      console.log({ goalId, amount: amountAsNumber });

      Alert.alert("Sucesso", "Transação registrada!");

      handleBottomSheetClose();
      Keyboard.dismiss();

      setAmount("");
      setType("up");
    } catch (error) {
      console.log(error);
    }
  }

  if (isLoading) {
    return <Loading />;
  }

  useEffect(() => {
    fetchDetails();
  }, []);

  return (
    <View className="flex-1 p-8 pt-12">
      <BackButton />

      <Header title={goal.name} subtitle={`${goal.current} de ${goal.total}`} />

      <Progress percentage={goal.percentage} />

      <Transactions transactions={goal.transactions} />

      <Button title="Nova transação" onPress={handleBottomSheetOpen} />

      <BottomSheet
        ref={bottomSheetRef}
        title="Nova transação"
        snapPoints={[0.01, 284]}
        onClose={handleBottomSheetClose}
      >
        <TransactionTypeSelect onChange={setType} selected={type} />

        <Input
          placeholder="Valor"
          keyboardType="numeric"
          onChangeText={setAmount}
          value={amount}
        />

        <Button title="Confirmar" onPress={handleNewTransaction} />
      </BottomSheet>
    </View>
  );
}

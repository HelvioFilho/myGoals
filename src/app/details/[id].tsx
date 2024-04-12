import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Bottom from "@gorhom/bottom-sheet";
import { Ionicons } from "@expo/vector-icons";

import { useGoalRepository } from "@/storage/useGoalRepository";
import { useTransactionRepository } from "@/storage/useTransactionRepository";

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

type DetailsProps = {
  name: string;
  total: string;
  current: string;
  percentage: number;
  transactions: TransactionProps[];
};

export default function Details() {
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [type, setType] = useState<"up" | "down">("up");
  const [goal, setGoal] = useState<DetailsProps>({} as DetailsProps);
  const [name, setName] = useState("");
  const [total, setTotal] = useState("");

  const useGoal = useGoalRepository();
  const useTransaction = useTransactionRepository();

  const routeParams = useLocalSearchParams();
  const goalId = Number(routeParams.id);
  const { back } = useRouter();

  const bottomSheetRef = useRef<Bottom>(null);
  const settingsBottomSheetRef = useRef<Bottom>(null);
  const inputBottomSheetRef = useRef<Bottom>(null);

  const handleBottomSheetOpen = () => bottomSheetRef.current?.expand();
  const handleBottomSheetClose = () => bottomSheetRef.current?.snapToIndex(0);

  const handleSettingsBottomSheetOpen = () =>
    settingsBottomSheetRef.current?.expand();
  const handleSettingsBottomSheetClose = () =>
    settingsBottomSheetRef.current?.snapToIndex(0);

  const handleInputBottomSheetOpen = () => {
    inputBottomSheetRef.current?.expand();
  };
  const handleInputBottomSheetClose = () => {
    inputBottomSheetRef.current?.snapToIndex(0);
  };

  function fetchDetails() {
    try {
      const goal = useGoal.show(goalId);
      const transactions = useTransaction.findByGoal(goalId);

      if (!goal || !transactions) {
        return back();
      }
      const percentage = (goal.current / goal.total) * 100;

      if (percentage >= 100 && goal.completed_in === null) {
        useGoal.markGoalAsCompleted(goalId, Math.floor(Date.now() / 1000));
      }

      if (percentage < 100 && goal.completed_in !== null) {
        useGoal.markGoalAsCompleted(goalId, null);
      }

      setGoal({
        name: goal.name,
        current: currencyFormat(goal.current),
        total: currencyFormat(goal.total),
        percentage,
        transactions: transactions.map((item) => ({
          ...item,
          date: dayjs(item.created_at).format("DD/MM/YYYY [às] HH:mm"),
        })),
      });
      setName(goal.name);
      setTotal(goal.total.toFixed(2).replace(".", ",").toString());
      setIsLoading(false);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar as transações.");
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

      useTransaction.create({ goalId, amount: amountAsNumber });

      Alert.alert("Sucesso", "Transação registrada!");

      handleBottomSheetClose();

      setAmount("");
      setType("up");

      fetchDetails();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível registrar a transação.");
    }
  }

  function handleGoalChange() {
    try {
      const totalAsNumber = Number(total.toString().replace(",", "."));

      if (isNaN(totalAsNumber)) {
        const newTotal = parseFloat(
          goal.total.replace(/[^\d,]/g, "").replace(",", ".")
        )
          .toFixed(2)
          .replace(".", ",")
          .toString();
        setTotal(newTotal);
        return Alert.alert("Erro", "Valor da meta deve ser um número válido.");
      }

      if (name === "" || totalAsNumber === 0) {
        setName(goal.name);
        return Alert.alert(
          "Erro",
          "Nome e valor da meta devem ser informados."
        );
      }

      useGoal.update({
        id: goalId,
        name,
        total: Number(total.replace(",", ".")),
      });

      fetchDetails();
      handleInputBottomSheetClose();
      Alert.alert("Sucesso", "Meta Alterada com sucesso!");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível editar a meta.");
    }
  }

  function handleGoalDelete() {
    Alert.alert(
      "Remover Meta",
      "Tem certeza que deseja remover esta meta? Essa ação não pode ser desfeita!",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Remover",
          onPress: () => {
            useGoal.deleteGoal(goalId);
            back();
          },
        },
      ]
    );
  }

  useEffect(() => {
    fetchDetails();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <View className="flex-1 pt-12">
      <View className="px-8">
        <View className="mt-8 flex-row items-center justify-between">
          <BackButton />
          <TouchableOpacity
            className="p-2 rounded-full items-center justify-center"
            activeOpacity={0.7}
            onPress={handleSettingsBottomSheetOpen}
          >
            <Ionicons name="settings" size={32} color="white" />
          </TouchableOpacity>
        </View>

        <Header
          title={goal.name}
          subtitle={`${goal.current} de ${goal.total}`}
        />

        <Progress percentage={goal.percentage} />
      </View>

      <View className="flex-1 bg-slate-200 rounded-t-3xl px-8 mt-10 pt-4 pb-8">
        <Transactions transactions={goal.transactions} />

        <Button
          testID="add-transaction-button"
          title="Adicionar nova transação"
          onPress={handleBottomSheetOpen}
        />
      </View>
      <BottomSheet
        ref={inputBottomSheetRef}
        title="Editar Meta"
        snapPoints={[0.01, 580]}
        onClose={handleInputBottomSheetClose}
      >
        <Text className="font-semiBold text-lg text-gray-100">
          Nome da Meta
        </Text>
        <Input
          testID="name-input"
          placeholder="Nome da meta"
          onChangeText={setName}
          value={name}
        />
        <Text className="font-semiBold text-lg text-gray-100 mt-3">
          Valor total que deseja arrecadar
        </Text>
        <Input
          testID="total-input"
          placeholder="Valor"
          keyboardType="numeric"
          onChangeText={setTotal}
          value={total}
        />
        <Button
          testID="change-button"
          title="Alterar"
          onPress={handleGoalChange}
        />
      </BottomSheet>
      <BottomSheet
        ref={settingsBottomSheetRef}
        title="Configurações"
        snapPoints={[0.01, 284]}
        onClose={handleSettingsBottomSheetClose}
      >
        <View className="flex-row gap-4 justify-around mt-8">
          <Button
            className="w-28 h-12 bg-blue-500 items-center justify-center rounded-sm"
            title="Editar"
            onPress={() => {
              handleSettingsBottomSheetClose();
              handleInputBottomSheetOpen();
            }}
          />
          <Button
            className="w-28 h-12 bg-red-500 items-center justify-center rounded-sm"
            title="Excluir"
            onPress={handleGoalDelete}
          />
        </View>
      </BottomSheet>
      <BottomSheet
        ref={bottomSheetRef}
        title="Nova transação"
        snapPoints={[0.01, 284]}
        onClose={handleBottomSheetClose}
      >
        <TransactionTypeSelect onChange={setType} selected={type} />

        <Input
          testID="amount-input"
          placeholder="Valor"
          keyboardType="numeric"
          onChangeText={setAmount}
          value={amount}
        />

        <Button
          testID="register-transaction-button"
          title="Confirmar"
          onPress={handleNewTransaction}
        />
      </BottomSheet>
    </View>
  );
}

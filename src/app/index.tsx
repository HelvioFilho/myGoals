import { useEffect, useRef, useState } from "react";
import { Alert, Keyboard, View } from "react-native";
import Bottom from "@gorhom/bottom-sheet";
import { useRouter } from "expo-router";
import dayjs from "dayjs";

import { useGoalRepository } from "@/storage/useGoalRepository";
import { useTransactionRepository } from "@/storage/useTransactionRepository";

import { Input } from "@/components/Input";
import { Header } from "@/components/Header";
import { Button } from "@/components/Button";
import { BottomSheet } from "@/components/BottomSheet";
import { Goals, GoalsProps } from "@/components/Goals";
import { Transactions, TransactionsProps } from "@/components/Transactions";

export default function Home() {
  const [name, setName] = useState("");
  const [total, setTotal] = useState("");
  const [transactions, setTransactions] = useState<TransactionsProps>([]);
  const [goals, setGoals] = useState<GoalsProps>([]);

  const useGoal = useGoalRepository();
  const useTransaction = useTransactionRepository();

  const { navigate } = useRouter();

  const bottomSheetRef = useRef<Bottom>(null);
  const handleBottomSheetOpen = () => bottomSheetRef.current?.expand();
  const handleBottomSheetClose = () => bottomSheetRef.current?.snapToIndex(0);

  async function handleCreate() {
    try {
      const totalAsNumber = Number(total.toString().replace(",", "."));

      if (isNaN(totalAsNumber)) {
        return Alert.alert("Erro", "Valor inválido.");
      }

      useGoal.create({ name, total: totalAsNumber });

      console.log({ name, total: totalAsNumber });

      Keyboard.dismiss();
      handleBottomSheetClose();
      Alert.alert("Sucesso", "Meta cadastrada!");

      setName("");
      setTotal("");
      fetchGoals();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível cadastrar.");
      console.log(error);
    }
  }

  function handleDetails(id: string) {
    navigate("/details/" + id);
  }

  async function fetchGoals() {
    try {
      const response = useGoal.all();
      setGoals(response);
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchTransactions() {
    try {
      const response = useTransaction.findLatest();

      setTransactions(
        response.map((item) => ({
          ...item,
          date: dayjs(item.created_at).format("DD/MM/YYYY [às] HH:mm"),
        }))
      );
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchGoals();
    fetchTransactions();
  }, []);

  return (
    <View className="flex-1 p-8">
      <Header
        title="Suas metas"
        subtitle="Poupe hoje para colher os frutos amanhã."
      />
      <Goals
        goals={goals}
        onAdd={handleBottomSheetOpen}
        onPress={handleDetails}
      />

      <Transactions transactions={transactions} />

      <BottomSheet
        ref={bottomSheetRef}
        title="Nova meta"
        snapPoints={[0.01, 284]}
        onClose={handleBottomSheetClose}
      >
        <Input
          testID="name-input"
          placeholder="Nome da meta"
          onChangeText={setName}
          value={name}
        />

        <Input
          testID="total-input"
          placeholder="Valor"
          keyboardType="numeric"
          onChangeText={setTotal}
          value={total}
        />

        <Button testID="create-button" title="Criar" onPress={handleCreate} />
      </BottomSheet>
    </View>
  );
}

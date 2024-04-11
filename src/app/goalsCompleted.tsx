import { BackButton } from "@/components/BackButton";
import { GoalCompleted } from "@/components/GoalCompleted";
import { Header } from "@/components/Header";
import { useGoalRepository } from "@/storage/useGoalRepository";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, FlatList, Text, View } from "react-native";

export type GoalsProps = {
  id: string;
  name: string;
  current: number;
  total: number;
  completed_in: number | null;
}[];
export default function GoalsCompleted() {
  const [goals, setGoals] = useState<GoalsProps>([]);

  const useGoal = useGoalRepository();
  const { navigate } = useRouter();

  async function fetchGoals() {
    try {
      const response = useGoal.all(true);
      setGoals(response);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar as metas.");
    }
  }

  function handleDetails(id: string) {
    navigate("/details/" + id);
  }

  useEffect(() => {
    fetchGoals();
  }, []);

  return (
    <View className="flex-1 p-8 pt-12">
      <View className="mt-8">
        <BackButton />
      </View>
      <Header
        title="Metas concluídas"
        subtitle="Parabéns, seu esforço valeu a pena."
      />

      <FlatList
        data={goals}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <GoalCompleted goal={item} onPress={() => handleDetails(item.id)} />
        )}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <Text className="text-center text-white font-semiBold text-sm">
            Ainda não há metas concluídas.
          </Text>
        )}
      />
    </View>
  );
}

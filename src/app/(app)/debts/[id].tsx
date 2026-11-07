import { DebtDetailScreen } from "@/features/debts";
import { useLocalSearchParams } from "expo-router";

export default function DebtDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <DebtDetailScreen id={id} />;
}

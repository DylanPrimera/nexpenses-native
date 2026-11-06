import { ExpenseCardSkeleton } from "@/features/expenses";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { View } from "react-native";

export function DashboardSkeleton() {
  return (
    <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" className="gap-4">
      <View className="flex-row items-center justify-between">
        <View className="gap-2">
          <Skeleton className="h-5 w-36 rounded-md" />
          <Skeleton className="h-3 w-24 rounded-md" />
        </View>
        <Skeleton className="h-6 w-28 rounded-md" />
      </View>
      <Skeleton className="h-44 w-full rounded-[0.875rem]" />
      <View className="flex-row gap-2">
        <Skeleton className="h-24 flex-[1.2] rounded-[0.875rem]" />
        <Skeleton className="h-24 flex-1 rounded-[0.875rem]" />
      </View>
      <Skeleton className="h-20 w-full rounded-[0.875rem]" />
      <View className="gap-2.5">
        <ExpenseCardSkeleton />
        <ExpenseCardSkeleton />
      </View>
    </View>
  );
}

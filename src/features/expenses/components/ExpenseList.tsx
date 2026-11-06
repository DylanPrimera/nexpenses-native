import { View } from "react-native";
import type { Expense } from "../interfaces";
import { ExpenseActions } from "./ExpenseActions";
import { ExpenseCard } from "./ExpenseCard";

export function ExpenseList({ expenses }: { expenses: Expense[] }) {
  return (
    <ExpenseActions>
      {(openers) => (
        <View className="gap-2.5">
          {expenses.map((expense) => (
            <ExpenseCard key={expense.id} expense={expense} {...openers} />
          ))}
        </View>
      )}
    </ExpenseActions>
  );
}

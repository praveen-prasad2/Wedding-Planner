import { auth } from "@/lib/auth";
import { getCategoriesForUser, getExpensesForUser } from "@/lib/data";
import { AppShell } from "@/components/AppShell";
import { AllExpensesView } from "@/components/AllExpensesView";

export default async function ExpensesPage() {
  const session = await auth();
  const userId = session!.user.id;

  const [expenses, categories] = await Promise.all([
    getExpensesForUser(userId),
    getCategoriesForUser(userId),
  ]);

  return (
    <AppShell>
      <AllExpensesView initialExpenses={expenses} categories={categories} />
    </AppShell>
  );
}

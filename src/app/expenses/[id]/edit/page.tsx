import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { getCategoriesForUser, getExpenseById } from "@/lib/data";
import { ExpenseForm } from "@/components/ExpenseForm";

export default async function EditExpensePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  const userId = session!.user.id;

  const [expense, categories] = await Promise.all([
    getExpenseById(userId, id),
    getCategoriesForUser(userId),
  ]);

  if (!expense) notFound();

  return <ExpenseForm categories={categories} initialExpense={expense} />;
}

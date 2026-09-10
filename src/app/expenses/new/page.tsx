import { auth } from "@/lib/auth";
import { getCategoriesForUser } from "@/lib/data";
import { ExpenseForm } from "@/components/ExpenseForm";

export default async function NewExpensePage({
  searchParams,
}: {
  searchParams: Promise<{ categoryId?: string }>;
}) {
  const { categoryId } = await searchParams;
  const session = await auth();
  const userId = session!.user.id;

  const categories = await getCategoriesForUser(userId);

  if (categories.length === 0) {
    return (
      <div className="px-4 pt-10 text-center text-sm text-muted">
        Create a category first from Settings before adding an expense.
      </div>
    );
  }

  return <ExpenseForm categories={categories} defaultCategoryId={categoryId} />;
}

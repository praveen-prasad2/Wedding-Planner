import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Plus } from "lucide-react";
import { auth } from "@/lib/auth";
import { getCategoryById, getExpensesForCategory } from "@/lib/data";
import { AppShell } from "@/components/AppShell";
import { CategoryIcon } from "@/components/CategoryIcon";
import { CategoryExpenseList } from "@/components/CategoryExpenseList";
import { formatCurrency } from "@/lib/utils";

export default async function CategoryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  const userId = session!.user.id;

  const category = await getCategoryById(userId, id);
  if (!category) notFound();

  const expenses = await getExpensesForCategory(userId, id);
  const spent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const pendingCount = expenses.filter((e) => e.status === "pending").length;

  return (
    <AppShell>
      <div className="px-4 pt-6">
        <Link href="/" className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-muted">
          <ChevronLeft size={16} /> Back
        </Link>

        <div className="mb-5 flex items-center gap-3">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-xl"
            style={{ backgroundColor: `${category.color}20`, color: category.color }}
          >
            <CategoryIcon name={category.icon} size={24} />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground">{category.name}</h1>
            <p className="text-sm text-muted">
              {pendingCount > 0 ? `${pendingCount} pending item${pendingCount > 1 ? "s" : ""}` : "All items done"}
            </p>
          </div>
        </div>

        <div className="mb-5 rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted">Spent</span>
            <span className="font-semibold text-foreground">{formatCurrency(spent)}</span>
          </div>
          {category.budgetAmount > 0 && (
            <>
              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="text-muted">Budget</span>
                <span className="font-semibold text-foreground">{formatCurrency(category.budgetAmount)}</span>
              </div>
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-border">
                <div
                  className="h-full rounded-full bg-maroon"
                  style={{ width: `${Math.min(100, Math.round((spent / category.budgetAmount) * 100))}%` }}
                />
              </div>
            </>
          )}
        </div>

        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">Items</h2>
          <Link
            href={`/expenses/new?categoryId=${category._id}`}
            className="flex items-center gap-1 rounded-full bg-maroon px-3 py-1.5 text-xs font-semibold text-white active:scale-95 transition-transform"
          >
            <Plus size={14} /> Add Item
          </Link>
        </div>

        <CategoryExpenseList initialExpenses={expenses} />
      </div>
    </AppShell>
  );
}

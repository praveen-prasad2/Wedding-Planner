import Link from "next/link";
import { auth } from "@/lib/auth";
import { getCategoriesForUser, getExpensesForUser, getUserBudget } from "@/lib/data";
import { AppShell } from "@/components/AppShell";
import { SummaryCard } from "@/components/SummaryCard";
import { CategoryCard } from "@/components/CategoryCard";
import { Heart, Plus } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();
  const userId = session!.user.id;

  const [categories, expenses, budget] = await Promise.all([
    getCategoriesForUser(userId),
    getExpensesForUser(userId),
    getUserBudget(userId),
  ]);

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);

  const categoryStats = categories.map((category) => {
    const catExpenses = expenses.filter((e) => e.categoryId === category._id);
    const spent = catExpenses.reduce((sum, e) => sum + e.amount, 0);
    const pendingCount = catExpenses.filter((e) => e.status === "pending").length;
    return { category, spent, pendingCount };
  });

  return (
    <AppShell>
      <div className="px-4 pt-6">
        <div className="mb-5 flex items-center gap-2">
          <Heart size={20} className="text-blush-dark" fill="currentColor" />
          <h1 className="text-xl font-semibold text-foreground">Wedding Planner</h1>
        </div>

        <SummaryCard budget={budget} spent={totalSpent} />

        <div className="mb-3 mt-6 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">Categories</h2>
          <Link
            href="/category/new"
            className="flex items-center gap-1 text-xs font-semibold text-maroon"
          >
            <Plus size={14} /> Add category
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {categoryStats.map(({ category, spent, pendingCount }) => (
            <CategoryCard key={category._id} category={category} spent={spent} pendingCount={pendingCount} />
          ))}
          <Link
            href="/category/new"
            className="flex flex-col items-center justify-center gap-1.5 rounded-2xl border border-dashed border-border bg-card p-4 text-muted active:scale-[0.98] transition-transform"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blush text-blush-dark">
              <Plus size={20} />
            </span>
            <span className="text-sm font-medium">Add Category</span>
          </Link>
        </div>
      </div>
    </AppShell>
  );
}

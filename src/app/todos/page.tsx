import Link from "next/link";
import { ListChecks, Plus } from "lucide-react";
import { auth } from "@/lib/auth";
import { getTodoCategoriesForUser, getTodosForUser } from "@/lib/data";
import { AppShell } from "@/components/AppShell";
import { TodoCategoryCard } from "@/components/TodoCategoryCard";

export default async function TodosPage() {
  const session = await auth();
  const userId = session!.user.id;

  const [categories, todos] = await Promise.all([
    getTodoCategoriesForUser(userId),
    getTodosForUser(userId),
  ]);

  const totalTasks = todos.length;
  const completedTasks = todos.filter((t) => t.status === "completed").length;

  const categoryStats = categories.map((category) => {
    const items = todos.filter((t) => t.todoCategoryId === category._id);
    return {
      category,
      total: items.length,
      completedCount: items.filter((t) => t.status === "completed").length,
    };
  });

  return (
    <AppShell>
      <div className="px-4 pt-6">
        <div className="mb-5 flex items-center gap-2">
          <ListChecks size={20} className="text-blush-dark" />
          <h1 className="text-xl font-semibold text-foreground">To Do</h1>
        </div>

        {totalTasks > 0 && (
          <div className="mb-6 rounded-2xl bg-gradient-to-br from-maroon to-maroon-dark p-5 text-white shadow-md">
            <p className="text-sm font-medium text-white/70">Tasks Completed</p>
            <p className="mt-1 text-3xl font-bold tracking-tight">
              {completedTasks}/{totalTasks}
            </p>
            <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-white/20">
              <div
                className="h-full rounded-full bg-gold transition-all"
                style={{ width: `${Math.round((completedTasks / totalTasks) * 100)}%` }}
              />
            </div>
          </div>
        )}

        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">Categories</h2>
          <Link
            href="/todos/category/new"
            className="flex items-center gap-1 text-xs font-semibold text-maroon"
          >
            <Plus size={14} /> Add category
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {categoryStats.map(({ category, total, completedCount }) => (
            <TodoCategoryCard
              key={category._id}
              category={category}
              total={total}
              completedCount={completedCount}
            />
          ))}
          <Link
            href="/todos/category/new"
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

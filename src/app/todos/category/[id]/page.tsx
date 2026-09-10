import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Plus } from "lucide-react";
import { auth } from "@/lib/auth";
import { getTodoCategoryById, getTodosForCategory } from "@/lib/data";
import { AppShell } from "@/components/AppShell";
import { CategoryIcon } from "@/components/CategoryIcon";
import { TodoList } from "@/components/TodoList";

export default async function TodoCategoryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  const userId = session!.user.id;

  const category = await getTodoCategoryById(userId, id);
  if (!category) notFound();

  const todos = await getTodosForCategory(userId, id);
  const completedCount = todos.filter((t) => t.status === "completed").length;

  return (
    <AppShell>
      <div className="px-4 pt-6">
        <Link href="/todos" className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-muted">
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
              {todos.length > 0 ? `${completedCount}/${todos.length} tasks done` : "No tasks yet"}
            </p>
          </div>
        </div>

        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">Tasks</h2>
          <Link
            href={`/todos/item/new?todoCategoryId=${category._id}`}
            className="flex items-center gap-1 rounded-full bg-maroon px-3 py-1.5 text-xs font-semibold text-white active:scale-95 transition-transform"
          >
            <Plus size={14} /> Add Task
          </Link>
        </div>

        <TodoList initialTodos={todos} />
      </div>
    </AppShell>
  );
}

import Link from "next/link";
import { CategoryIcon } from "@/components/CategoryIcon";
import type { TodoCategoryDTO } from "@/lib/types";

export function TodoCategoryCard({
  category,
  total,
  completedCount,
}: {
  category: TodoCategoryDTO;
  total: number;
  completedCount: number;
}) {
  return (
    <Link
      href={`/todos/category/${category._id}`}
      className="flex flex-col rounded-2xl border border-border bg-card p-4 shadow-sm active:scale-[0.98] transition-transform"
    >
      <div
        className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl"
        style={{ backgroundColor: `${category.color}20`, color: category.color }}
      >
        <CategoryIcon name={category.icon} size={20} />
      </div>
      <p className="text-sm font-semibold text-foreground leading-tight">{category.name}</p>
      {total === 0 ? (
        <p className="mt-1 text-xs text-muted">No tasks yet</p>
      ) : (
        <>
          <p className="mt-1 text-base font-bold text-foreground">
            {completedCount}/{total} done
          </p>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-border">
            <div
              className="h-full rounded-full bg-success"
              style={{ width: `${Math.round((completedCount / total) * 100)}%` }}
            />
          </div>
        </>
      )}
    </Link>
  );
}

import Link from "next/link";
import { CategoryIcon } from "@/components/CategoryIcon";
import { formatCurrency } from "@/lib/utils";
import type { CategoryDTO } from "@/lib/types";

export function CategoryCard({
  category,
  spent,
  pendingCount,
}: {
  category: CategoryDTO;
  spent: number;
  pendingCount: number;
}) {
  return (
    <Link
      href={`/category/${category._id}`}
      className="flex flex-col rounded-2xl border border-border bg-card p-4 shadow-sm active:scale-[0.98] transition-transform"
    >
      <div
        className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl"
        style={{ backgroundColor: `${category.color}20`, color: category.color }}
      >
        <CategoryIcon name={category.icon} size={20} />
      </div>
      <p className="text-sm font-semibold text-foreground leading-tight">{category.name}</p>
      <p className="mt-1 text-base font-bold text-foreground">{formatCurrency(spent)}</p>
      {pendingCount > 0 ? (
        <p className="mt-1 text-xs font-medium text-pending">{pendingCount} pending</p>
      ) : (
        <p className="mt-1 text-xs text-muted">All done</p>
      )}
    </Link>
  );
}

import { formatCurrency } from "@/lib/utils";

export function SummaryCard({ budget, spent }: { budget: number; spent: number }) {
  const remaining = budget - spent;
  const percent = budget > 0 ? Math.min(100, Math.round((spent / budget) * 100)) : 0;
  const overBudget = budget > 0 && spent > budget;

  return (
    <div className="rounded-2xl bg-gradient-to-br from-maroon to-maroon-dark p-5 text-white shadow-md">
      <p className="text-sm font-medium text-white/70">Total Spent</p>
      <p className="mt-1 text-3xl font-bold tracking-tight">{formatCurrency(spent)}</p>

      <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-white/20">
        <div
          className={`h-full rounded-full transition-all ${overBudget ? "bg-red-300" : "bg-gold"}`}
          style={{ width: `${budget > 0 ? percent : spent > 0 ? 100 : 0}%` }}
        />
      </div>

      <div className="mt-4 flex items-center justify-between text-sm">
        <div>
          <p className="text-white/70">Budget</p>
          <p className="font-semibold">{budget > 0 ? formatCurrency(budget) : "Not set"}</p>
        </div>
        <div className="text-right">
          <p className="text-white/70">{overBudget ? "Over budget" : "Remaining"}</p>
          <p className={`font-semibold ${overBudget ? "text-red-200" : ""}`}>
            {budget > 0 ? formatCurrency(Math.abs(remaining)) : "—"}
          </p>
        </div>
      </div>
    </div>
  );
}

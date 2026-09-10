import { auth } from "@/lib/auth";
import { getCategoriesForUser, getUserBudget } from "@/lib/data";
import { AppShell } from "@/components/AppShell";
import { SettingsView } from "@/components/SettingsView";

export default async function SettingsPage() {
  const session = await auth();
  const userId = session!.user.id;

  const [budget, categories] = await Promise.all([
    getUserBudget(userId),
    getCategoriesForUser(userId),
  ]);

  return (
    <AppShell>
      <SettingsView initialBudget={budget} initialCategories={categories} />
    </AppShell>
  );
}

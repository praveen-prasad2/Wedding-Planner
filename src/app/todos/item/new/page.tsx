import { auth } from "@/lib/auth";
import { getTodoCategoriesForUser } from "@/lib/data";
import { TodoForm } from "@/components/TodoForm";

export default async function NewTodoItemPage({
  searchParams,
}: {
  searchParams: Promise<{ todoCategoryId?: string }>;
}) {
  const { todoCategoryId } = await searchParams;
  const session = await auth();
  const userId = session!.user.id;

  const categories = await getTodoCategoriesForUser(userId);

  if (categories.length === 0) {
    return (
      <div className="px-4 pt-10 text-center text-sm text-muted">
        Create a To Do category first before adding a task.
      </div>
    );
  }

  return <TodoForm categories={categories} defaultCategoryId={todoCategoryId} />;
}

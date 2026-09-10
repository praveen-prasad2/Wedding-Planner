import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { getTodoCategoriesForUser, getTodoById } from "@/lib/data";
import { TodoForm } from "@/components/TodoForm";

export default async function EditTodoItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  const userId = session!.user.id;

  const [todo, categories] = await Promise.all([
    getTodoById(userId, id),
    getTodoCategoriesForUser(userId),
  ]);

  if (!todo) notFound();

  return <TodoForm categories={categories} initialTodo={todo} />;
}

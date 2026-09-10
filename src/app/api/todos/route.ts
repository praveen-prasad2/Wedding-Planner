import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { TodoItem } from "@/models/TodoItem";
import { serialize } from "@/lib/serialize";

const createSchema = z.object({
  todoCategoryId: z.string().trim().min(1, "Category is required"),
  title: z.string().trim().min(1, "Title is required").max(120),
  notes: z.string().trim().max(2000).optional().or(z.literal("")),
  status: z.enum(["completed", "pending"]).default("pending"),
  dueDate: z.string().trim().optional().or(z.literal("")),
});

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const todoCategoryId = searchParams.get("todoCategoryId");
  const status = searchParams.get("status");

  const query: Record<string, unknown> = { userId: session.user.id };
  if (todoCategoryId) query.todoCategoryId = todoCategoryId;
  if (status === "completed" || status === "pending") query.status = status;

  await connectToDatabase();
  const todos = await TodoItem.find(query).sort({ createdAt: -1 }).lean();
  return NextResponse.json(serialize(todos));
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  const { dueDate, notes, ...rest } = parsed.data;

  await connectToDatabase();
  const todo = await TodoItem.create({
    ...rest,
    notes: notes || undefined,
    dueDate: dueDate ? new Date(dueDate) : undefined,
    userId: session.user.id,
  });

  return NextResponse.json(serialize(todo), { status: 201 });
}

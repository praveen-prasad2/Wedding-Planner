import { NextResponse } from "next/server";
import { z } from "zod";
import { isValidObjectId } from "mongoose";
import { auth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { TodoItem } from "@/models/TodoItem";
import { serialize } from "@/lib/serialize";

const updateSchema = z.object({
  todoCategoryId: z.string().trim().min(1).optional(),
  title: z.string().trim().min(1).max(120).optional(),
  notes: z.string().trim().max(2000).optional().or(z.literal("")),
  status: z.enum(["completed", "pending"]).optional(),
  dueDate: z.string().trim().optional().or(z.literal("")),
});

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  if (!isValidObjectId(id)) return NextResponse.json({ error: "Todo not found" }, { status: 404 });

  await connectToDatabase();
  const todo = await TodoItem.findOne({ _id: id, userId: session.user.id }).lean();
  if (!todo) return NextResponse.json({ error: "Todo not found" }, { status: 404 });
  return NextResponse.json(serialize(todo));
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  if (!isValidObjectId(id)) return NextResponse.json({ error: "Todo not found" }, { status: 404 });

  const body = await request.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  const { dueDate, notes, ...rest } = parsed.data;
  const update: Record<string, unknown> = { ...rest };
  if (notes !== undefined) update.notes = notes || undefined;
  if (dueDate !== undefined) update.dueDate = dueDate ? new Date(dueDate) : undefined;

  await connectToDatabase();
  const todo = await TodoItem.findOneAndUpdate(
    { _id: id, userId: session.user.id },
    { $set: update },
    { new: true }
  ).lean();

  if (!todo) return NextResponse.json({ error: "Todo not found" }, { status: 404 });
  return NextResponse.json(serialize(todo));
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  if (!isValidObjectId(id)) return NextResponse.json({ error: "Todo not found" }, { status: 404 });

  await connectToDatabase();
  const todo = await TodoItem.findOneAndDelete({ _id: id, userId: session.user.id });
  if (!todo) return NextResponse.json({ error: "Todo not found" }, { status: 404 });

  return NextResponse.json({ ok: true });
}

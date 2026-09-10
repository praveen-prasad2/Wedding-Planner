import { NextResponse } from "next/server";
import { z } from "zod";
import { isValidObjectId } from "mongoose";
import { auth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { TodoCategory } from "@/models/TodoCategory";
import { TodoItem } from "@/models/TodoItem";
import { serialize } from "@/lib/serialize";

const updateSchema = z.object({
  name: z.string().trim().min(1).max(60).optional(),
  icon: z.string().trim().min(1).max(40).optional(),
  color: z.string().trim().min(1).max(20).optional(),
});

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  if (!isValidObjectId(id)) return NextResponse.json({ error: "Category not found" }, { status: 404 });

  const body = await request.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  await connectToDatabase();
  const category = await TodoCategory.findOneAndUpdate(
    { _id: id, userId: session.user.id },
    { $set: parsed.data },
    { new: true }
  ).lean();

  if (!category) return NextResponse.json({ error: "Category not found" }, { status: 404 });
  return NextResponse.json(serialize(category));
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  if (!isValidObjectId(id)) return NextResponse.json({ error: "Category not found" }, { status: 404 });

  await connectToDatabase();

  const category = await TodoCategory.findOneAndDelete({ _id: id, userId: session.user.id });
  if (!category) return NextResponse.json({ error: "Category not found" }, { status: 404 });

  await TodoItem.deleteMany({ todoCategoryId: id, userId: session.user.id });

  return NextResponse.json({ ok: true });
}

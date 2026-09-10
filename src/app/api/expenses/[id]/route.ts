import { NextResponse } from "next/server";
import { z } from "zod";
import { isValidObjectId } from "mongoose";
import { auth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { Expense } from "@/models/Expense";
import { serialize } from "@/lib/serialize";

const updateSchema = z.object({
  categoryId: z.string().trim().min(1).optional(),
  title: z.string().trim().min(1).max(120).optional(),
  amount: z.coerce.number().min(0).optional(),
  vendorName: z.string().trim().max(120).optional().or(z.literal("")),
  notes: z.string().trim().max(2000).optional().or(z.literal("")),
  status: z.enum(["completed", "pending"]).optional(),
  dueDate: z.string().trim().optional().or(z.literal("")),
});

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  if (!isValidObjectId(id)) return NextResponse.json({ error: "Expense not found" }, { status: 404 });

  await connectToDatabase();
  const expense = await Expense.findOne({ _id: id, userId: session.user.id }).lean();
  if (!expense) return NextResponse.json({ error: "Expense not found" }, { status: 404 });
  return NextResponse.json(serialize(expense));
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  if (!isValidObjectId(id)) return NextResponse.json({ error: "Expense not found" }, { status: 404 });

  const body = await request.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  const { dueDate, vendorName, notes, ...rest } = parsed.data;
  const update: Record<string, unknown> = { ...rest };
  if (vendorName !== undefined) update.vendorName = vendorName || undefined;
  if (notes !== undefined) update.notes = notes || undefined;
  if (dueDate !== undefined) update.dueDate = dueDate ? new Date(dueDate) : undefined;

  await connectToDatabase();
  const expense = await Expense.findOneAndUpdate(
    { _id: id, userId: session.user.id },
    { $set: update },
    { new: true }
  ).lean();

  if (!expense) return NextResponse.json({ error: "Expense not found" }, { status: 404 });
  return NextResponse.json(serialize(expense));
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  if (!isValidObjectId(id)) return NextResponse.json({ error: "Expense not found" }, { status: 404 });

  await connectToDatabase();
  const expense = await Expense.findOneAndDelete({ _id: id, userId: session.user.id });
  if (!expense) return NextResponse.json({ error: "Expense not found" }, { status: 404 });

  return NextResponse.json({ ok: true });
}

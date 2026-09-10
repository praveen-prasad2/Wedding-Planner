import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { Expense } from "@/models/Expense";
import { serialize } from "@/lib/serialize";

const createSchema = z.object({
  categoryId: z.string().trim().min(1, "Category is required"),
  title: z.string().trim().min(1, "Title is required").max(120),
  amount: z.coerce.number().min(0, "Amount must be positive"),
  vendorName: z.string().trim().max(120).optional().or(z.literal("")),
  notes: z.string().trim().max(2000).optional().or(z.literal("")),
  status: z.enum(["completed", "pending"]).default("pending"),
  dueDate: z.string().trim().optional().or(z.literal("")),
});

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const categoryId = searchParams.get("categoryId");
  const status = searchParams.get("status");
  const search = searchParams.get("search");

  const query: Record<string, unknown> = { userId: session.user.id };
  if (categoryId) query.categoryId = categoryId;
  if (status === "completed" || status === "pending") query.status = status;
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { notes: { $regex: search, $options: "i" } },
      { vendorName: { $regex: search, $options: "i" } },
    ];
  }

  await connectToDatabase();
  const expenses = await Expense.find(query).sort({ createdAt: -1 }).lean();
  return NextResponse.json(serialize(expenses));
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  const { dueDate, vendorName, notes, ...rest } = parsed.data;

  await connectToDatabase();
  const expense = await Expense.create({
    ...rest,
    vendorName: vendorName || undefined,
    notes: notes || undefined,
    dueDate: dueDate ? new Date(dueDate) : undefined,
    userId: session.user.id,
  });

  return NextResponse.json(serialize(expense), { status: 201 });
}

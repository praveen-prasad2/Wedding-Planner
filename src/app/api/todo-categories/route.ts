import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { TodoCategory } from "@/models/TodoCategory";
import { serialize } from "@/lib/serialize";

const createSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(60),
  icon: z.string().trim().min(1).max(40).default("ListChecks"),
  color: z.string().trim().min(1).max(20).default("#B76E79"),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectToDatabase();
  const categories = await TodoCategory.find({ userId: session.user.id }).sort({ createdAt: 1 }).lean();
  return NextResponse.json(serialize(categories));
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  await connectToDatabase();
  const category = await TodoCategory.create({ ...parsed.data, userId: session.user.id });
  return NextResponse.json(serialize(category), { status: 201 });
}

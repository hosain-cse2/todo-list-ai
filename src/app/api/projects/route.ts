import { NextResponse } from "next/server";
import { getDbClient } from "@/src/server/db";

export async function GET() {
  const db = await getDbClient();

  // Placeholder: return an empty array for now.
  // Replace with a real query once your Prisma schema is defined.
  const projects: Array<{ id: string; name: string }> = [];

  return NextResponse.json({ projects });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));

  // In a real app, validate `body` with a schema in `services/validators`.
  // For now, just echo back.
  return NextResponse.json(
    {
      message: "Project creation not yet implemented",
      data: body,
    },
    { status: 501 },
  );
}


import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/server/auth";
import { prisma } from "@/server/db";

export const runtime = "nodejs";

const intentSchema = z.object({
  intent: z.enum(["teacher", "student"]),
});

type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Invalid JSON body" },
      { status: 400 },
    );
  }

  const parsed = intentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Invalid intent" },
      { status: 400 },
    );
  }

  const role = parsed.data.intent === "teacher" ? "TEACHER" : "STUDENT";

  await prisma.user.update({
    where: { id: session.user.id },
    data: { role },
  });

  const redirect = role === "TEACHER" ? "/teacher" : "/home";
  return NextResponse.json<ApiResponse<{ redirect: string }>>(
    { success: true, data: { redirect } },
    { status: 200 },
  );
}

import { NextResponse } from "next/server";
import { auth } from "@/server/auth";
import { prisma } from "@/server/db";

export const runtime = "nodejs";

type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  const { id } = await ctx.params;

  const membership = await prisma.classMembership.findFirst({
    where: {
      userId: session.user.id,
      classId: id,
      role: "TEACHER",
      status: "ACTIVE",
    },
  });
  if (!membership) {
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Not found" },
      { status: 404 },
    );
  }

  const klass = await prisma.class.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      description: true,
      inviteCode: true,
      inviteCodeEnabled: true,
      createdAt: true,
      _count: {
        select: {
          memberships: { where: { role: "STUDENT", status: "ACTIVE" } },
        },
      },
    },
  });
  if (!klass) {
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Not found" },
      { status: 404 },
    );
  }

  return NextResponse.json<ApiResponse<typeof klass>>(
    { success: true, data: klass },
    { status: 200 },
  );
}

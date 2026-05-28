import { NextResponse } from "next/server";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { auth } from "@/server/auth";
import { prisma } from "@/server/db";
import { generateInviteCode } from "@/lib/inviteCode";

export const runtime = "nodejs";

type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string };

const MAX_COLLISION_RETRIES = 8;

async function requireTeacherOwnership(userId: string, classId: string) {
  return prisma.classMembership.findFirst({
    where: { userId, classId, role: "TEACHER", status: "ACTIVE" },
  });
}

// Generate or rotate the invite code for a class. Always enables joining.
export async function POST(
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
  const membership = await requireTeacherOwnership(session.user.id, id);
  if (!membership) {
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Not found" },
      { status: 404 },
    );
  }

  for (let attempt = 0; attempt < MAX_COLLISION_RETRIES; attempt++) {
    const inviteCode = generateInviteCode();
    try {
      const updated = await prisma.class.update({
        where: { id },
        data: { inviteCode, inviteCodeEnabled: true },
        select: { inviteCode: true, inviteCodeEnabled: true },
      });
      return NextResponse.json<ApiResponse<typeof updated>>(
        { success: true, data: updated },
        { status: 200 },
      );
    } catch (err) {
      // P2002 = unique constraint violation; retry with a fresh code.
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2002"
      ) {
        continue;
      }
      throw err;
    }
  }

  return NextResponse.json<ApiResponse<never>>(
    { success: false, error: "Could not allocate invite code" },
    { status: 500 },
  );
}

const patchSchema = z.object({
  enabled: z.boolean(),
});

// Toggle invite-code joining on or off without rotating the code itself.
export async function PATCH(
  req: Request,
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
  const membership = await requireTeacherOwnership(session.user.id, id);
  if (!membership) {
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Not found" },
      { status: 404 },
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

  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Invalid payload" },
      { status: 400 },
    );
  }

  const klass = await prisma.class.findUnique({
    where: { id },
    select: { inviteCode: true },
  });
  if (parsed.data.enabled && !klass?.inviteCode) {
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Generate a code before enabling joining" },
      { status: 400 },
    );
  }

  const updated = await prisma.class.update({
    where: { id },
    data: { inviteCodeEnabled: parsed.data.enabled },
    select: { inviteCode: true, inviteCodeEnabled: true },
  });

  return NextResponse.json<ApiResponse<typeof updated>>(
    { success: true, data: updated },
    { status: 200 },
  );
}

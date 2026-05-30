import { z } from "zod";
import { prisma } from "@/server/db";
import { ok, fail, requireUser, readJson } from "@/server/api";
import { onJoinRequested } from "@/server/events";

export const runtime = "nodejs";

const schema = z.object({
  code: z.string().trim().min(4).max(16),
});

/**
 * Student submits an invite code to request to join a class (§1.3).
 * Creates a PENDING membership — the teacher must approve before the student
 * appears in the roster. Idempotent-ish: re-requesting is surfaced clearly.
 */
export async function POST(req: Request) {
  const gate = await requireUser();
  if (!gate.ok) return gate.response;

  const body = await readJson(req);
  if (body === undefined) return fail("Invalid JSON body");

  const parsed = schema.safeParse(body);
  if (!parsed.success) return fail("Invalid code");

  const code = parsed.data.code.toUpperCase();

  const klass = await prisma.class.findUnique({
    where: { inviteCode: code },
    select: {
      id: true,
      name: true,
      inviteCodeEnabled: true,
      owner: { select: { id: true, email: true } },
    },
  });

  if (!klass) return fail("No class found for that code", 404);
  if (!klass.inviteCodeEnabled) {
    return fail("This class is not accepting new students right now");
  }

  // Owner can't join their own class as a student.
  if (klass.owner.id === gate.userId) {
    return fail("You already own this class");
  }

  const existing = await prisma.classMembership.findUnique({
    where: { userId_classId: { userId: gate.userId, classId: klass.id } },
    select: { status: true },
  });

  if (existing) {
    if (existing.status === "ACTIVE") return fail("You're already in this class");
    if (existing.status === "PENDING") {
      return fail("Your request is already pending approval");
    }
    // REMOVED → allow re-request by flipping back to PENDING.
    await prisma.classMembership.update({
      where: { userId_classId: { userId: gate.userId, classId: klass.id } },
      data: { status: "PENDING", role: "STUDENT" },
    });
  } else {
    await prisma.classMembership.create({
      data: {
        userId: gate.userId,
        classId: klass.id,
        role: "STUDENT",
        status: "PENDING",
      },
    });
  }

  const me = await prisma.user.findUnique({
    where: { id: gate.userId },
    select: { name: true, email: true },
  });

  await onJoinRequested({
    classId: klass.id,
    className: klass.name,
    teacher: { id: klass.owner.id, email: klass.owner.email },
    student: { name: me?.name ?? null, email: me?.email ?? "" },
  });

  return ok({ className: klass.name, status: "PENDING" }, 201);
}

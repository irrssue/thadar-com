import { z } from "zod";
import { prisma } from "@/server/db";
import { ok, fail, requireUser, readJson } from "@/server/api";
import { isClassTeacher } from "@/server/access";
import { onMembershipDecided, writeAudit } from "@/server/events";

export const runtime = "nodejs";

const patchSchema = z.object({
  action: z.enum(["approve", "deny"]),
});

async function loadContext(userId: string, classId: string, membershipId: string) {
  if (!(await isClassTeacher(userId, classId))) return null;
  const membership = await prisma.classMembership.findFirst({
    where: { id: membershipId, classId, role: "STUDENT" },
    select: {
      id: true,
      status: true,
      user: { select: { id: true, email: true } },
      class: { select: { id: true, name: true, owner: { select: { id: true, email: true } } } },
    },
  });
  return membership;
}

/** Approve or deny a pending student (§1.3). */
export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string; mid: string }> },
) {
  const gate = await requireUser();
  if (!gate.ok) return gate.response;

  const { id, mid } = await ctx.params;
  const membership = await loadContext(gate.userId, id, mid);
  if (!membership) return fail("Not found", 404);

  const body = await readJson(req);
  if (body === undefined) return fail("Invalid JSON body");
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return fail("Invalid action");

  if (membership.status !== "PENDING") {
    return fail("This request has already been handled");
  }

  const approved = parsed.data.action === "approve";
  await prisma.classMembership.update({
    where: { id: mid },
    data: { status: approved ? "ACTIVE" : "REMOVED" },
  });

  await onMembershipDecided({
    approved,
    classId: membership.class.id,
    className: membership.class.name,
    teacher: { id: membership.class.owner.id, email: membership.class.owner.email },
    student: { id: membership.user.id, email: membership.user.email },
  });

  return ok({ id: mid, status: approved ? "ACTIVE" : "REMOVED" });
}

/** Remove an active student from the class roster. */
export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ id: string; mid: string }> },
) {
  const gate = await requireUser();
  if (!gate.ok) return gate.response;

  const { id, mid } = await ctx.params;
  const membership = await loadContext(gate.userId, id, mid);
  if (!membership) return fail("Not found", 404);

  await prisma.classMembership.update({
    where: { id: mid },
    data: { status: "REMOVED" },
  });

  await writeAudit({
    actorId: gate.userId,
    action: "membership.removed",
    target: id,
    metadata: { student: membership.user.email },
  });

  return ok({ id: mid, status: "REMOVED" });
}

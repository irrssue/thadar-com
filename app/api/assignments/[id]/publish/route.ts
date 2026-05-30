import { prisma } from "@/server/db";
import { ok, fail, requireUser } from "@/server/api";
import { isClassTeacher } from "@/server/access";
import { onAssignmentPosted } from "@/server/events";

export const runtime = "nodejs";

/**
 * Publish a draft assignment. Transitions DRAFT → PUBLISHED and notifies every
 * active student in the class (in-app + email). Idempotent: publishing an
 * already-published assignment is a no-op success.
 */
export async function POST(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const gate = await requireUser();
  if (!gate.ok) return gate.response;

  const { id } = await ctx.params;
  const a = await prisma.assignment.findUnique({
    where: { id },
    select: {
      id: true,
      classId: true,
      title: true,
      status: true,
      class: { select: { name: true, owner: { select: { email: true } } } },
    },
  });
  if (!a) return fail("Not found", 404);
  if (!(await isClassTeacher(gate.userId, a.classId))) return fail("Not found", 404);

  if (a.status === "PUBLISHED") {
    return ok({ id: a.id, status: "PUBLISHED" });
  }

  await prisma.assignment.update({
    where: { id },
    data: { status: "PUBLISHED" },
  });

  await onAssignmentPosted({
    classId: a.classId,
    className: a.class.name,
    assignmentId: a.id,
    title: a.title,
    teacherEmail: a.class.owner.email,
  });

  return ok({ id: a.id, status: "PUBLISHED" });
}

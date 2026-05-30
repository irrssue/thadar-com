import { prisma } from "@/server/db";
import { ok, requireUser } from "@/server/api";

export const runtime = "nodejs";

/**
 * Student's assignment feed across every class they're actively enrolled in.
 * Powers the student home "what's due" view. Includes the student's own
 * submission state so the UI can show not-submitted / submitted / graded.
 */
export async function GET() {
  const gate = await requireUser();
  if (!gate.ok) return gate.response;

  const memberships = await prisma.classMembership.findMany({
    where: { userId: gate.userId, role: "STUDENT", status: "ACTIVE" },
    select: { classId: true },
  });
  const classIds = memberships.map((m) => m.classId);
  if (classIds.length === 0) return ok([]);

  const assignments = await prisma.assignment.findMany({
    where: { classId: { in: classIds }, status: "PUBLISHED" },
    orderBy: [{ dueAt: "asc" }, { createdAt: "desc" }],
    select: {
      id: true,
      title: true,
      instructions: true,
      dueAt: true,
      class: { select: { id: true, name: true } },
      submissions: {
        where: { studentId: gate.userId },
        select: { id: true, status: true, grade: true, submittedAt: true },
      },
    },
  });

  const shaped = assignments.map((a) => ({
    id: a.id,
    title: a.title,
    instructions: a.instructions,
    dueAt: a.dueAt,
    class: a.class,
    submission: a.submissions[0] ?? null,
  }));

  return ok(shaped);
}

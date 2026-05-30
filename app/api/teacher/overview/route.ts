import { prisma } from "@/server/db";
import { ok, requireUser } from "@/server/api";

export const runtime = "nodejs";

/**
 * Aggregate for the teacher's cross-class pages (home, assignments, students).
 * Returns every class the user owns with its assignments, active student count,
 * and pending-request count — one round trip instead of N client fetches.
 */
export async function GET() {
  const gate = await requireUser();
  if (!gate.ok) return gate.response;

  const classes = await prisma.class.findMany({
    where: { ownerId: gate.userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      assignments: {
        orderBy: [{ status: "asc" }, { createdAt: "desc" }],
        select: {
          id: true,
          title: true,
          status: true,
          dueAt: true,
          _count: { select: { submissions: true } },
        },
      },
      memberships: {
        where: { role: "STUDENT", status: { in: ["ACTIVE", "PENDING"] } },
        select: {
          id: true,
          status: true,
          user: { select: { id: true, name: true, email: true } },
        },
      },
    },
  });

  const shaped = classes.map((c) => {
    const active = c.memberships.filter((m) => m.status === "ACTIVE");
    const pending = c.memberships.filter((m) => m.status === "PENDING");
    return {
      id: c.id,
      name: c.name,
      assignments: c.assignments,
      students: active,
      pending,
      activeCount: active.length,
      pendingCount: pending.length,
    };
  });

  const totals = {
    classes: shaped.length,
    students: shaped.reduce((n, c) => n + c.activeCount, 0),
    pending: shaped.reduce((n, c) => n + c.pendingCount, 0),
    assignments: shaped.reduce((n, c) => n + c.assignments.length, 0),
    needsGrading: shaped.reduce(
      (n, c) => n + c.assignments.filter((a) => a.status === "PUBLISHED" && a._count.submissions > 0).length,
      0,
    ),
  };

  return ok({ totals, classes: shaped });
}

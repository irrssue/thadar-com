import { prisma } from "@/server/db";
import { ok, fail, requireUser } from "@/server/api";
import { isClassTeacher } from "@/server/access";

export const runtime = "nodejs";

/**
 * Class roster for the owning teacher: active students + pending requests.
 * Pending requests power the approval queue (§1.3). Emails are returned only
 * to the teacher of the class, never across class boundaries.
 */
export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const gate = await requireUser();
  if (!gate.ok) return gate.response;

  const { id } = await ctx.params;
  if (!(await isClassTeacher(gate.userId, id))) return fail("Not found", 404);

  const members = await prisma.classMembership.findMany({
    where: { classId: id, role: "STUDENT", status: { in: ["ACTIVE", "PENDING"] } },
    orderBy: [{ status: "asc" }, { joinedAt: "asc" }],
    select: {
      id: true,
      status: true,
      joinedAt: true,
      user: { select: { id: true, name: true, email: true } },
    },
  });

  const active = members.filter((m) => m.status === "ACTIVE");
  const pending = members.filter((m) => m.status === "PENDING");

  return ok({ active, pending });
}

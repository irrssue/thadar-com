import { prisma } from "@/server/db";
import { ok, fail, requireUser } from "@/server/api";
import { isClassMember } from "@/server/access";

export const runtime = "nodejs";

/**
 * Mark a published lesson as viewed by the current student (§3 progress
 * tracking). Idempotent — re-viewing does not create duplicate rows.
 */
export async function POST(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const gate = await requireUser();
  if (!gate.ok) return gate.response;

  const { id } = await ctx.params;
  const lesson = await prisma.lesson.findUnique({
    where: { id },
    select: { id: true, classId: true, published: true },
  });
  if (!lesson || !lesson.published) return fail("Not found", 404);
  if (!(await isClassMember(gate.userId, lesson.classId))) return fail("Not found", 404);

  await prisma.lessonView.upsert({
    where: { lessonId_userId: { lessonId: id, userId: gate.userId } },
    create: { lessonId: id, userId: gate.userId },
    update: {},
  });

  return ok({ lessonId: id, viewed: true });
}

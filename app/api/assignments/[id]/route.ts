import { z } from "zod";
import { prisma } from "@/server/db";
import { ok, fail, requireUser, readJson } from "@/server/api";
import { isClassTeacher, isClassMember } from "@/server/access";

export const runtime = "nodejs";

async function loadAssignment(assignmentId: string) {
  return prisma.assignment.findUnique({
    where: { id: assignmentId },
    select: {
      id: true,
      classId: true,
      title: true,
      instructions: true,
      dueAt: true,
      status: true,
      lessonId: true,
      createdAt: true,
    },
  });
}

/** Assignment detail. Teacher sees all submissions; student sees only their own. */
export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const gate = await requireUser();
  if (!gate.ok) return gate.response;

  const { id } = await ctx.params;
  const a = await loadAssignment(id);
  if (!a) return fail("Not found", 404);

  const teacher = await isClassTeacher(gate.userId, a.classId);
  if (!teacher) {
    if (a.status !== "PUBLISHED" || !(await isClassMember(gate.userId, a.classId))) {
      return fail("Not found", 404);
    }
    const mine = await prisma.submission.findUnique({
      where: { assignmentId_studentId: { assignmentId: id, studentId: gate.userId } },
      select: { id: true, content: true, status: true, grade: true, feedback: true, submittedAt: true },
    });
    return ok({ ...a, submission: mine });
  }

  const submissions = await prisma.submission.findMany({
    where: { assignmentId: id },
    orderBy: { submittedAt: "desc" },
    select: {
      id: true,
      content: true,
      status: true,
      grade: true,
      feedback: true,
      submittedAt: true,
      student: { select: { id: true, name: true, email: true } },
    },
  });
  return ok({ ...a, submissions });
}

const patchSchema = z.object({
  title: z.string().trim().min(1).max(160).optional(),
  instructions: z.string().trim().max(8000).optional(),
  dueAt: z.string().datetime().nullish(),
});

/** Edit a draft/published assignment. Teacher-owner only. */
export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const gate = await requireUser();
  if (!gate.ok) return gate.response;

  const { id } = await ctx.params;
  const a = await loadAssignment(id);
  if (!a) return fail("Not found", 404);
  if (!(await isClassTeacher(gate.userId, a.classId))) return fail("Not found", 404);

  const body = await readJson(req);
  if (body === undefined) return fail("Invalid JSON body");
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return fail("Invalid assignment data");

  const updated = await prisma.assignment.update({
    where: { id },
    data: {
      ...(parsed.data.title !== undefined ? { title: parsed.data.title } : {}),
      ...(parsed.data.instructions !== undefined
        ? { instructions: parsed.data.instructions }
        : {}),
      ...(parsed.data.dueAt !== undefined
        ? { dueAt: parsed.data.dueAt ? new Date(parsed.data.dueAt) : null }
        : {}),
    },
    select: { id: true, title: true, instructions: true, dueAt: true, status: true },
  });
  return ok(updated);
}

/** Delete an assignment (cascades submissions). Teacher-owner only. */
export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const gate = await requireUser();
  if (!gate.ok) return gate.response;

  const { id } = await ctx.params;
  const a = await loadAssignment(id);
  if (!a) return fail("Not found", 404);
  if (!(await isClassTeacher(gate.userId, a.classId))) return fail("Not found", 404);

  await prisma.assignment.delete({ where: { id } });
  return ok({ id });
}

import { z } from "zod";
import { prisma } from "@/server/db";
import { ok, fail, requireUser, readJson } from "@/server/api";
import { isClassTeacher } from "@/server/access";
import { onGradeReturned } from "@/server/events";

export const runtime = "nodejs";

const schema = z.object({
  grade: z.string().trim().min(1).max(20),
  feedback: z.string().trim().max(8000).optional(),
});

/**
 * Teacher grades a submission. Sets grade + optional feedback, marks GRADED,
 * and notifies the student (in-app + email). Teacher-owner of the class only.
 */
export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const gate = await requireUser();
  if (!gate.ok) return gate.response;

  const { id } = await ctx.params;
  const submission = await prisma.submission.findUnique({
    where: { id },
    select: {
      id: true,
      assignment: {
        select: {
          title: true,
          classId: true,
          class: { select: { owner: { select: { email: true } } } },
        },
      },
      student: { select: { id: true, email: true } },
    },
  });
  if (!submission) return fail("Not found", 404);
  if (!(await isClassTeacher(gate.userId, submission.assignment.classId))) {
    return fail("Not found", 404);
  }

  const body = await readJson(req);
  if (body === undefined) return fail("Invalid JSON body");
  const parsed = schema.safeParse(body);
  if (!parsed.success) return fail("Invalid grade");

  const updated = await prisma.submission.update({
    where: { id },
    data: {
      grade: parsed.data.grade,
      feedback: parsed.data.feedback ?? null,
      status: "GRADED",
      gradedAt: new Date(),
    },
    select: { id: true, grade: true, feedback: true, status: true, gradedAt: true },
  });

  await onGradeReturned({
    assignmentTitle: submission.assignment.title,
    grade: parsed.data.grade,
    teacher: { email: submission.assignment.class.owner.email },
    student: { id: submission.student.id, email: submission.student.email },
  });

  return ok(updated);
}

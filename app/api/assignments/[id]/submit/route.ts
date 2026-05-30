import { z } from "zod";
import { prisma } from "@/server/db";
import { ok, fail, requireUser, readJson } from "@/server/api";
import { isClassStudent } from "@/server/access";
import { onSubmissionReceived } from "@/server/events";

export const runtime = "nodejs";

const schema = z.object({
  content: z.string().trim().min(1).max(20000),
});

/**
 * Student submits (or re-submits) an assignment. Upserts the submission so a
 * resubmission overwrites the prior text and resets status to SUBMITTED. The
 * class teacher is notified on each submission.
 */
export async function POST(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const gate = await requireUser();
  if (!gate.ok) return gate.response;

  const { id } = await ctx.params;
  const assignment = await prisma.assignment.findUnique({
    where: { id },
    select: {
      id: true,
      classId: true,
      title: true,
      status: true,
      class: { select: { name: true, owner: { select: { id: true, email: true } } } },
    },
  });
  if (!assignment) return fail("Not found", 404);
  if (assignment.status !== "PUBLISHED") return fail("Assignment is not open", 400);
  if (!(await isClassStudent(gate.userId, assignment.classId))) {
    return fail("Not found", 404);
  }

  const body = await readJson(req);
  if (body === undefined) return fail("Invalid JSON body");
  const parsed = schema.safeParse(body);
  if (!parsed.success) return fail("Submission cannot be empty");

  const submission = await prisma.submission.upsert({
    where: { assignmentId_studentId: { assignmentId: id, studentId: gate.userId } },
    create: {
      assignmentId: id,
      studentId: gate.userId,
      content: parsed.data.content,
      status: "SUBMITTED",
    },
    update: {
      content: parsed.data.content,
      status: "SUBMITTED",
      grade: null,
      feedback: null,
      gradedAt: null,
      submittedAt: new Date(),
    },
    select: { id: true, status: true, submittedAt: true },
  });

  const me = await prisma.user.findUnique({
    where: { id: gate.userId },
    select: { name: true, email: true },
  });

  await onSubmissionReceived({
    classId: assignment.classId,
    className: assignment.class.name,
    assignmentTitle: assignment.title,
    teacher: { id: assignment.class.owner.id, email: assignment.class.owner.email },
    student: { name: me?.name ?? null, email: me?.email ?? "" },
  });

  return ok(submission, 201);
}

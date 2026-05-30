import "server-only";
import { prisma } from "./db";

/**
 * Authorization helpers. Per THADAR_PLAN.md §1.4 all authz is checked
 * server-side, per request, against class_memberships — never default_view.
 */

/** True if the user is the active teacher (owner) of the class. */
export async function isClassTeacher(userId: string, classId: string) {
  const m = await prisma.classMembership.findFirst({
    where: { userId, classId, role: "TEACHER", status: "ACTIVE" },
    select: { id: true },
  });
  return !!m;
}

/** True if the user is an active student in the class. */
export async function isClassStudent(userId: string, classId: string) {
  const m = await prisma.classMembership.findFirst({
    where: { userId, classId, role: "STUDENT", status: "ACTIVE" },
    select: { id: true },
  });
  return !!m;
}

/** True if the user is any active member (teacher or student) of the class. */
export async function isClassMember(userId: string, classId: string) {
  const m = await prisma.classMembership.findFirst({
    where: { userId, classId, status: "ACTIVE" },
    select: { id: true },
  });
  return !!m;
}

/**
 * True if two users share at least one class where both are active members.
 * Gates the email Reply-To exposure rule (§6) — never leak emails across
 * class boundaries.
 */
export async function shareAClass(userA: string, userB: string) {
  const a = await prisma.classMembership.findMany({
    where: { userId: userA, status: "ACTIVE" },
    select: { classId: true },
  });
  if (a.length === 0) return false;
  const classIds = a.map((m) => m.classId);
  const b = await prisma.classMembership.findFirst({
    where: { userId: userB, status: "ACTIVE", classId: { in: classIds } },
    select: { id: true },
  });
  return !!b;
}

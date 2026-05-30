import { z } from "zod";
import { prisma } from "@/server/db";
import { ok, fail, requireUser, readJson } from "@/server/api";

export const runtime = "nodejs";

/** Current user's profile + lightweight counts for the profile page. */
export async function GET() {
  const gate = await requireUser();
  if (!gate.ok) return gate.response;

  const user = await prisma.user.findUnique({
    where: { id: gate.userId },
    select: {
      id: true,
      name: true,
      email: true,
      defaultView: true,
      emailVerified: true,
      createdAt: true,
    },
  });
  if (!user) return fail("Not found", 404);

  const [teaching, enrolled, submissions] = await Promise.all([
    prisma.classMembership.count({
      where: { userId: user.id, role: "TEACHER", status: "ACTIVE" },
    }),
    prisma.classMembership.count({
      where: { userId: user.id, role: "STUDENT", status: "ACTIVE" },
    }),
    prisma.submission.count({ where: { studentId: user.id } }),
  ]);

  return ok({ ...user, counts: { teaching, enrolled, submissions } });
}

const patchSchema = z.object({
  name: z.string().trim().min(1).max(80),
});

/** Update editable profile fields (name only for now). */
export async function PATCH(req: Request) {
  const gate = await requireUser();
  if (!gate.ok) return gate.response;

  const body = await readJson(req);
  if (body === undefined) return fail("Invalid JSON body");

  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return fail("Invalid profile data");

  const user = await prisma.user.update({
    where: { id: gate.userId },
    data: { name: parsed.data.name },
    select: { id: true, name: true, email: true, defaultView: true },
  });

  return ok(user);
}

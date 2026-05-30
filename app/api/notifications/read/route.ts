import { z } from "zod";
import { prisma } from "@/server/db";
import { ok, fail, requireUser, readJson } from "@/server/api";

export const runtime = "nodejs";

const schema = z.object({
  // Optional: mark a single notification read. Omit to mark all read.
  id: z.string().cuid().optional(),
});

/** Mark one or all of the user's notifications as read. */
export async function POST(req: Request) {
  const gate = await requireUser();
  if (!gate.ok) return gate.response;

  const raw = await readJson(req);
  const parsed = schema.safeParse(raw ?? {});
  if (!parsed.success) return fail("Invalid payload");

  const now = new Date();
  if (parsed.data.id) {
    await prisma.notification.updateMany({
      where: { id: parsed.data.id, userId: gate.userId, readAt: null },
      data: { readAt: now },
    });
  } else {
    await prisma.notification.updateMany({
      where: { userId: gate.userId, readAt: null },
      data: { readAt: now },
    });
  }

  return ok({ ok: true });
}

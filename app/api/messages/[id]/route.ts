import { z } from "zod";
import { prisma } from "@/server/db";
import { ok, fail, requireUser, readJson } from "@/server/api";

export const runtime = "nodejs";

const schema = z.object({
  read: z.boolean().optional(),
  starred: z.boolean().optional(),
});

/** Mark a received message read/unread or toggle its star. Recipient only. */
export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const gate = await requireUser();
  if (!gate.ok) return gate.response;

  const { id } = await ctx.params;
  const msg = await prisma.message.findFirst({
    where: { id, recipientId: gate.userId },
    select: { id: true },
  });
  if (!msg) return fail("Not found", 404);

  const body = await readJson(req);
  if (body === undefined) return fail("Invalid JSON body");
  const parsed = schema.safeParse(body);
  if (!parsed.success) return fail("Invalid payload");

  const updated = await prisma.message.update({
    where: { id },
    data: {
      ...(parsed.data.read !== undefined
        ? { readAt: parsed.data.read ? new Date() : null }
        : {}),
      ...(parsed.data.starred !== undefined ? { starred: parsed.data.starred } : {}),
    },
    select: { id: true, readAt: true, starred: true },
  });
  return ok(updated);
}

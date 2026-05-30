import { z } from "zod";
import { prisma } from "@/server/db";
import { ok, fail, requireUser, readJson } from "@/server/api";

export const runtime = "nodejs";

const schema = z.object({
  view: z.enum(["TEACHER", "STUDENT"]),
});

/**
 * Persist the user's default_view. This is UI preference only (§1.4) — it is
 * never used for authorization. The client refreshes its JWT via
 * useSession().update({ defaultView }) and redirects to the matching surface.
 */
export async function POST(req: Request) {
  const gate = await requireUser();
  if (!gate.ok) return gate.response;

  const body = await readJson(req);
  if (body === undefined) return fail("Invalid JSON body");

  const parsed = schema.safeParse(body);
  if (!parsed.success) return fail("Invalid view");

  await prisma.user.update({
    where: { id: gate.userId },
    data: { defaultView: parsed.data.view },
  });

  const redirect = parsed.data.view === "TEACHER" ? "/teacher" : "/home";
  return ok({ defaultView: parsed.data.view, redirect });
}

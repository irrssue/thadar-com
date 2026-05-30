import { prisma } from "@/server/db";
import { ok, requireUser } from "@/server/api";

export const runtime = "nodejs";

/** Current user's notifications (newest first) + unread count for nav badges. */
export async function GET() {
  const gate = await requireUser();
  if (!gate.ok) return gate.response;

  const [notifications, unread] = await Promise.all([
    prisma.notification.findMany({
      where: { userId: gate.userId },
      orderBy: { createdAt: "desc" },
      take: 50,
      select: {
        id: true,
        type: true,
        title: true,
        body: true,
        link: true,
        readAt: true,
        createdAt: true,
      },
    }),
    prisma.notification.count({ where: { userId: gate.userId, readAt: null } }),
  ]);

  return ok({ unread, notifications });
}

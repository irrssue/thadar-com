import { z } from "zod";
import { prisma } from "@/server/db";
import { ok, fail, requireUser, readJson } from "@/server/api";
import { shareAClass } from "@/server/access";
import { onMessageReceived } from "@/server/events";

export const runtime = "nodejs";

/**
 * List the current user's messages. `box` query selects the view:
 *   inbox (default) — received, starred — received & starred, sent — sent.
 * Counterparty name/email is exposed only because both share a class (the send
 * path enforces that), consistent with the privacy rule in §6.
 */
export async function GET(req: Request) {
  const gate = await requireUser();
  if (!gate.ok) return gate.response;

  const box = new URL(req.url).searchParams.get("box") ?? "inbox";

  const baseSelect = {
    id: true,
    subject: true,
    body: true,
    readAt: true,
    starred: true,
    createdAt: true,
    classId: true,
    sender: { select: { id: true, name: true, email: true } },
    recipient: { select: { id: true, name: true, email: true } },
  } as const;

  let messages;
  if (box === "sent") {
    messages = await prisma.message.findMany({
      where: { senderId: gate.userId },
      orderBy: { createdAt: "desc" },
      select: baseSelect,
    });
  } else if (box === "starred") {
    messages = await prisma.message.findMany({
      where: { recipientId: gate.userId, starred: true },
      orderBy: { createdAt: "desc" },
      select: baseSelect,
    });
  } else {
    messages = await prisma.message.findMany({
      where: { recipientId: gate.userId },
      orderBy: { createdAt: "desc" },
      select: baseSelect,
    });
  }

  const unread = await prisma.message.count({
    where: { recipientId: gate.userId, readAt: null },
  });

  return ok({ box, unread, messages });
}

const sendSchema = z.object({
  to: z.string().email().toLowerCase(),
  subject: z.string().trim().min(1).max(200),
  body: z.string().trim().min(1).max(20000),
});

/**
 * Send an in-app message. Recipient is addressed by email but is only
 * deliverable if sender and recipient share an active class (§6) — this avoids
 * leaking whether arbitrary emails are registered and keeps comms class-scoped.
 */
export async function POST(req: Request) {
  const gate = await requireUser();
  if (!gate.ok) return gate.response;

  const body = await readJson(req);
  if (body === undefined) return fail("Invalid JSON body");
  const parsed = sendSchema.safeParse(body);
  if (!parsed.success) return fail("Invalid message");

  const recipient = await prisma.user.findUnique({
    where: { email: parsed.data.to },
    select: { id: true },
  });

  // Same generic error whether the user is missing or not a classmate, so the
  // endpoint can't be used to probe which emails are registered.
  const notDeliverable = fail("No classmate found with that email", 404);
  if (!recipient || recipient.id === gate.userId) return notDeliverable;
  if (!(await shareAClass(gate.userId, recipient.id))) return notDeliverable;

  const created = await prisma.message.create({
    data: {
      senderId: gate.userId,
      recipientId: recipient.id,
      subject: parsed.data.subject,
      body: parsed.data.body,
    },
    select: { id: true, subject: true, createdAt: true },
  });

  const me = await prisma.user.findUnique({
    where: { id: gate.userId },
    select: { name: true, email: true },
  });

  await onMessageReceived({
    recipientId: recipient.id,
    senderName: me?.name ?? null,
    senderEmail: me?.email ?? "",
    subject: parsed.data.subject,
    sharedClass: true,
  });

  return ok(created, 201);
}

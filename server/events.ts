import "server-only";
import { prisma } from "./db";
import { sendEmail, emailLayout } from "./email";
import type { NotificationType } from "@prisma/client";

/**
 * Domain events: one call writes the in-app Notification, optionally fires the
 * transactional email, and (for sensitive actions) appends an AuditLog row.
 *
 * Email Reply-To rules (THADAR_PLAN.md §6) are applied here — replyTo is only
 * ever the counterparty's signup email and only within a shared class, which is
 * always true for these class-scoped events.
 */

const APP_URL = process.env.AUTH_URL ?? "http://localhost:3000";

function link(path: string) {
  return `${APP_URL}${path}`;
}

export async function writeNotification(params: {
  userId: string;
  type: NotificationType;
  title: string;
  body?: string;
  link?: string;
}) {
  await prisma.notification.create({
    data: {
      userId: params.userId,
      type: params.type,
      title: params.title,
      body: params.body ?? "",
      link: params.link,
    },
  });
}

export async function writeAudit(params: {
  actorId?: string | null;
  action: string;
  target?: string;
  metadata?: Record<string, unknown>;
}) {
  await prisma.auditLog.create({
    data: {
      actorId: params.actorId ?? null,
      action: params.action,
      target: params.target,
      metadata: params.metadata ? JSON.stringify(params.metadata) : undefined,
    },
  });
}

/* ---- High-level class events ---- */

/** Student requested to join → notify the class owner (teacher). */
export async function onJoinRequested(params: {
  classId: string;
  className: string;
  teacher: { id: string; email: string };
  student: { name: string | null; email: string };
}) {
  const who = params.student.name ?? params.student.email;
  await writeNotification({
    userId: params.teacher.id,
    type: "MEMBERSHIP_REQUEST",
    title: `${who} wants to join ${params.className}`,
    body: "Review the request in your class roster.",
    link: `/teacher/classes/${params.classId}`,
  });
  await writeAudit({
    action: "membership.requested",
    target: params.classId,
    metadata: { student: params.student.email },
  });
  await sendEmail({
    to: params.teacher.email,
    replyTo: params.student.email,
    subject: `New join request for ${params.className}`,
    html: emailLayout({
      heading: "New join request",
      body: `<strong>${who}</strong> has requested to join <strong>${params.className}</strong>. Approve or decline from your class roster.`,
      cta: { label: "Review request", url: link(`/teacher/classes/${params.classId}`) },
    }),
  });
}

/** Teacher approved or denied a pending student → notify the student. */
export async function onMembershipDecided(params: {
  approved: boolean;
  classId: string;
  className: string;
  teacher: { id: string; email: string };
  student: { id: string; email: string };
}) {
  if (params.approved) {
    await writeNotification({
      userId: params.student.id,
      type: "MEMBERSHIP_APPROVED",
      title: `You're in — ${params.className}`,
      body: "Your request was approved. Open the class to get started.",
      link: `/classes`,
    });
    await sendEmail({
      to: params.student.email,
      replyTo: params.teacher.email,
      subject: `Approved: ${params.className}`,
      html: emailLayout({
        heading: "You're in!",
        body: `Your request to join <strong>${params.className}</strong> was approved.`,
        cta: { label: "Open Thadar", url: link("/classes") },
      }),
    });
  } else {
    await writeNotification({
      userId: params.student.id,
      type: "MEMBERSHIP_DENIED",
      title: `Request declined — ${params.className}`,
      body: "Your request to join was not approved.",
    });
    await sendEmail({
      to: params.student.email,
      replyTo: params.teacher.email,
      subject: `Update on your request to join ${params.className}`,
      html: emailLayout({
        heading: "Request not approved",
        body: `Your request to join <strong>${params.className}</strong> was declined. Reach out to your teacher if you think this is a mistake.`,
      }),
    });
  }
  await writeAudit({
    actorId: params.teacher.id,
    action: params.approved ? "membership.approved" : "membership.denied",
    target: params.classId,
    metadata: { student: params.student.email },
  });
}

/** Teacher published an assignment → notify every active student in the class. */
export async function onAssignmentPosted(params: {
  classId: string;
  className: string;
  assignmentId: string;
  title: string;
  teacherEmail: string;
}) {
  const students = await prisma.classMembership.findMany({
    where: { classId: params.classId, role: "STUDENT", status: "ACTIVE" },
    select: { user: { select: { id: true, email: true } } },
  });

  await Promise.all(
    students.map(async ({ user }) => {
      await writeNotification({
        userId: user.id,
        type: "ASSIGNMENT_POSTED",
        title: `New assignment: ${params.title}`,
        body: `Posted in ${params.className}.`,
        link: `/classes`,
      });
      await sendEmail({
        to: user.email,
        replyTo: params.teacherEmail,
        subject: `New assignment in ${params.className}: ${params.title}`,
        html: emailLayout({
          heading: params.title,
          body: `A new assignment was posted in <strong>${params.className}</strong>.`,
          cta: { label: "View assignment", url: link("/classes") },
        }),
      });
    }),
  );
  await writeAudit({
    action: "assignment.posted",
    target: params.assignmentId,
    metadata: { classId: params.classId },
  });
}

/** Student submitted → notify the teacher who owns the class. */
export async function onSubmissionReceived(params: {
  classId: string;
  className: string;
  assignmentTitle: string;
  teacher: { id: string; email: string };
  student: { name: string | null; email: string };
}) {
  const who = params.student.name ?? params.student.email;
  await writeNotification({
    userId: params.teacher.id,
    type: "SUBMISSION_RECEIVED",
    title: `${who} submitted ${params.assignmentTitle}`,
    body: `In ${params.className}.`,
    link: `/teacher/assignments`,
  });
  await sendEmail({
    to: params.teacher.email,
    replyTo: params.student.email,
    subject: `New submission: ${params.assignmentTitle}`,
    html: emailLayout({
      heading: "New submission",
      body: `<strong>${who}</strong> submitted <strong>${params.assignmentTitle}</strong> in ${params.className}.`,
      cta: { label: "Review submission", url: link("/teacher/assignments") },
    }),
  });
}

/** Teacher returned a grade → notify the student who submitted. */
export async function onGradeReturned(params: {
  assignmentTitle: string;
  grade: string;
  teacher: { email: string };
  student: { id: string; email: string };
}) {
  await writeNotification({
    userId: params.student.id,
    type: "GRADE_RETURNED",
    title: `Graded: ${params.assignmentTitle}`,
    body: `You received ${params.grade}.`,
    link: `/home`,
  });
  await sendEmail({
    to: params.student.email,
    replyTo: params.teacher.email,
    subject: `Your grade for ${params.assignmentTitle}`,
    html: emailLayout({
      heading: `Grade: ${params.grade}`,
      body: `Your submission for <strong>${params.assignmentTitle}</strong> has been graded.`,
      cta: { label: "View feedback", url: link("/home") },
    }),
  });
}

/** In-app message sent → notify the recipient (email is opt-in noise, skip). */
export async function onMessageReceived(params: {
  recipientId: string;
  senderName: string | null;
  senderEmail: string;
  subject: string;
  sharedClass: boolean;
}) {
  await writeNotification({
    userId: params.recipientId,
    type: "MESSAGE_RECEIVED",
    title: `New message from ${params.senderName ?? params.senderEmail}`,
    body: params.subject,
    link: `/inbox`,
  });
}

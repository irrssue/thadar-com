import "server-only";
import { Resend } from "resend";

/**
 * Thin Resend wrapper. All outbound mail goes through here so the From/Reply-To
 * rules in THADAR_PLAN.md §6 live in exactly one place.
 *
 * - From is always a Thadar-controlled address (never a user's personal email).
 * - Reply-To is set per-message and is only ever the *other party's* signup
 *   email, and only when both share a class. Callers are responsible for
 *   enforcing the shared-class check before passing replyTo.
 * - If RESEND_API_KEY is unset (local dev), every send becomes a logged no-op so
 *   the rest of the app keeps working without a provider configured.
 */

const apiKey = process.env.RESEND_API_KEY;
const resend = apiKey ? new Resend(apiKey) : null;

const FROM_NOREPLY =
  process.env.EMAIL_FROM_NOREPLY ?? "Thadar <noreply@thadar.com>";
const FROM_HELLO =
  process.env.EMAIL_FROM_HELLO ?? "Thadar <hello@thadar.com>";

export type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
  text?: string;
  /** Reply-To — only the other party's email within a shared class. */
  replyTo?: string;
  /** Which Thadar identity sends this. System mail uses noreply. */
  from?: "noreply" | "hello";
};

export async function sendEmail(input: SendEmailInput): Promise<boolean> {
  const from = input.from === "hello" ? FROM_HELLO : FROM_NOREPLY;

  if (!resend) {
    // Dev / unconfigured: don't throw, just record intent.
    console.info(
      `[email:noop] to=${input.to} subject=${JSON.stringify(input.subject)}` +
        (input.replyTo ? ` replyTo=${input.replyTo}` : ""),
    );
    return false;
  }

  try {
    await resend.emails.send({
      from,
      to: input.to,
      subject: input.subject,
      html: input.html,
      ...(input.text ? { text: input.text } : {}),
      ...(input.replyTo ? { replyTo: input.replyTo } : {}),
    });
    return true;
  } catch (err) {
    // Email must never break the request that triggered it.
    console.error("[email:error]", err);
    return false;
  }
}

/** Minimal branded HTML shell so every email looks consistent. */
export function emailLayout(opts: {
  heading: string;
  body: string;
  cta?: { label: string; url: string };
}): string {
  const cta = opts.cta
    ? `<p style="margin:28px 0 0"><a href="${opts.cta.url}" style="display:inline-block;background:#e0b97a;color:#1a1814;text-decoration:none;padding:11px 22px;border-radius:10px;font-weight:600;font-size:14px">${opts.cta.label}</a></p>`
    : "";
  return `<!doctype html><html><body style="margin:0;background:#0e0e10;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#e8e6e1">
  <div style="max-width:480px;margin:0 auto;padding:40px 28px">
    <div style="font-size:18px;font-weight:700;letter-spacing:-0.4px;margin-bottom:28px;color:#e8e6e1">Thadar</div>
    <h1 style="font-size:22px;font-weight:600;letter-spacing:-0.4px;margin:0 0 14px;color:#e8e6e1">${opts.heading}</h1>
    <div style="font-size:15px;line-height:1.6;color:#b7b4ad">${opts.body}</div>
    ${cta}
    <p style="margin:36px 0 0;font-size:12px;color:#6f6c66">Thadar — သဒ္ဒါ — generous, giving.</p>
  </div>
</body></html>`;
}

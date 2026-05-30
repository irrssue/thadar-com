"use client";

import { useCallback, useEffect, useState } from "react";
import Icon from "../../components/Icon";
import { WfBox, PillStub, Avatar, Btn, CommandBar } from "../components/primitives";

type Person = { id: string; name: string | null; email: string };
type Mail = {
  id: string;
  subject: string;
  body: string;
  readAt: string | null;
  starred: boolean;
  createdAt: string;
  sender: Person;
  recipient: Person;
};
type Box = "inbox" | "sent" | "starred";
type ApiResponse<T> = { success: true; data: T } | { success: false; error: string };

const BOXES: { id: Box; label: string }[] = [
  { id: "inbox", label: "Inbox" },
  { id: "sent", label: "Sent" },
  { id: "starred", label: "Starred" },
];

export default function TeacherInbox() {
  const [box, setBox] = useState<Box>("inbox");
  const [mail, setMail] = useState<Mail[] | null>(null);
  const [unread, setUnread] = useState(0);
  const [open, setOpen] = useState<Mail | null>(null);
  const [compose, setCompose] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch(`/api/messages?box=${box}`, { cache: "no-store" });
    const json: ApiResponse<{ unread: number; messages: Mail[] }> = await res.json();
    if (json.success) { setMail(json.data.messages); setUnread(json.data.unread); }
  }, [box]);

  useEffect(() => { load(); }, [load]);

  async function openMessage(m: Mail) {
    setOpen(m);
    if (box === "inbox" && !m.readAt) {
      await fetch(`/api/messages/${m.id}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ read: true }) });
      load();
    }
  }
  async function toggleStar(m: Mail) {
    await fetch(`/api/messages/${m.id}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ starred: !m.starred }) });
    load();
  }

  return (
    <>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <h1 style={{ fontWeight: 700, fontSize: 52, margin: "16px 0 4px", letterSpacing: "-0.5px" }}>
          Your <span style={{ color: "var(--accent)" }}>inbox</span>
        </h1>
        <Btn variant="primary" onClick={() => setCompose(true)}><Icon name="pencil" size={14} /> Compose</Btn>
      </div>
      <p style={{ color: "var(--ink-dim)", fontSize: 18, margin: "0 0 28px", fontWeight: 300 }}>
        {mail === null ? "Loading…" : unread > 0 ? `${unread} unread` : "No unread messages."}
      </p>

      <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
        {BOXES.map((b) => (
          <PillStub key={b.id} variant={box === b.id ? "active" : "default"} onClick={() => setBox(b.id)}>{b.label}</PillStub>
        ))}
      </div>

      <WfBox>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {mail !== null && mail.length === 0 && <Muted>Nothing here yet.</Muted>}
          {(mail ?? []).map((m) => {
            const other = box === "sent" ? m.recipient : m.sender;
            const isUnread = box === "inbox" && !m.readAt;
            return (
              <div
                key={m.id}
                onClick={() => openMessage(m)}
                style={{ display: "grid", gridTemplateColumns: "32px 32px 180px 1fr 80px", gap: 14, alignItems: "center", padding: "12px 14px", border: isUnread ? "1.2px dashed var(--accent)" : "1.2px dashed var(--ink-faint)", borderRadius: 10, cursor: "pointer" }}
                className="mail-row"
              >
                <button onClick={(e) => { e.stopPropagation(); toggleStar(m); }} aria-label="Star" style={{ background: "transparent", border: "none", cursor: "pointer", color: m.starred ? "var(--accent)" : "var(--ink-faint)", display: "inline-flex" }}>
                  <Icon name={m.starred ? "star-fill" : "star"} size={16} />
                </button>
                <Avatar name={other.name ?? other.email} size={32} />
                <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  <div style={{ fontSize: 16, fontWeight: isUnread ? 600 : 400 }}>{other.name ?? other.email}</div>
                  <div style={{ fontSize: 11, color: "var(--ink-dim)", fontFamily: "var(--font-mono)" }}>{other.email}</div>
                </div>
                <div style={{ fontSize: 14, color: "var(--ink-dim)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} className="mail-preview">
                  <span style={{ color: "var(--ink)" }}>{m.subject}</span> — {m.body}
                </div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-faint)", textAlign: "right" }}>{new Date(m.createdAt).toLocaleDateString()}</div>
              </div>
            );
          })}
        </div>
      </WfBox>

      {open && <ReadModal mail={open} box={box} onClose={() => setOpen(null)} />}
      {compose && <ComposeModal onClose={() => setCompose(false)} onSent={() => { setCompose(false); if (box === "sent") load(); }} />}

      <CommandBar />

      <style>{`
        @media (max-width: 880px) {
          .mail-row { grid-template-columns: 28px 28px 1fr 60px !important; }
          .mail-preview { display: none !important; }
        }
      `}</style>
    </>
  );
}

function ReadModal({ mail, box, onClose }: { mail: Mail; box: Box; onClose: () => void }) {
  const other = box === "sent" ? mail.recipient : mail.sender;
  return (
    <div onClick={onClose} style={overlayStyle}>
      <div onClick={(e) => e.stopPropagation()} style={{ ...modalStyle, width: "min(560px, 94vw)" }}>
        <div style={{ fontSize: 20, fontWeight: 700 }}>{mail.subject}</div>
        <div style={{ fontSize: 13, color: "var(--ink-dim)", fontFamily: "var(--font-mono)" }}>
          {box === "sent" ? "To" : "From"}: {other.name ?? other.email} · {new Date(mail.createdAt).toLocaleString()}
        </div>
        <div style={{ fontSize: 15, color: "var(--ink)", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{mail.body}</div>
        <div style={{ display: "flex", justifyContent: "flex-end" }}><button onClick={onClose} style={ghostBtn}>Close</button></div>
      </div>
    </div>
  );
}

function ComposeModal({ onClose, onSent }: { onClose: () => void; onSent: () => void }) {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (saving) return;
    setSaving(true); setErr(null);
    try {
      const res = await fetch("/api/messages", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ to: to.trim(), subject: subject.trim(), body: body.trim() }) });
      const json: ApiResponse<unknown> = await res.json();
      if (!json.success) { setErr(json.error); return; }
      onSent();
    } finally { setSaving(false); }
  }

  return (
    <div onClick={onClose} style={overlayStyle}>
      <form onClick={(e) => e.stopPropagation()} onSubmit={submit} style={{ ...modalStyle, width: "min(560px, 94vw)" }}>
        <div style={{ fontSize: 20, fontWeight: 700 }}>New message</div>
        <p style={{ fontSize: 13, color: "var(--ink-dim)", margin: 0 }}>You can only message people in your classes.</p>
        <input value={to} onChange={(e) => setTo(e.target.value)} placeholder="Recipient email" type="email" required style={inputStyle} autoFocus />
        <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject" required maxLength={200} style={inputStyle} />
        <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Message…" required rows={6} style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit" }} />
        {err && <div style={{ color: "var(--danger)", fontSize: 14 }}>{err}</div>}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button type="button" onClick={onClose} style={ghostBtn}>Cancel</button>
          <button type="submit" disabled={saving} style={{ ...primaryBtn, opacity: saving ? 0.5 : 1 }}>{saving ? "Sending…" : "Send"}</button>
        </div>
      </form>
    </div>
  );
}

function Muted({ children }: { children: React.ReactNode }) {
  return <div style={{ color: "var(--ink-dim)", fontSize: 14, padding: "20px 0", textAlign: "center" }}>{children}</div>;
}
const overlayStyle: React.CSSProperties = { position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 20 };
const modalStyle: React.CSSProperties = { background: "var(--surface)", border: "1.5px solid var(--stroke)", borderRadius: 14, padding: 24, display: "flex", flexDirection: "column", gap: 12 };
const inputStyle: React.CSSProperties = { padding: "10px 12px", borderRadius: 10, border: "1.4px solid var(--stroke)", background: "var(--bg)", color: "var(--ink)", fontSize: 15, outline: "none" };
const ghostBtn: React.CSSProperties = { padding: "8px 14px", borderRadius: 999, border: "1.4px solid var(--stroke)", background: "transparent", color: "var(--ink)", fontSize: 14, cursor: "pointer" };
const primaryBtn: React.CSSProperties = { padding: "8px 16px", borderRadius: 999, border: "1.4px solid var(--accent)", background: "var(--accent-soft)", color: "var(--accent)", fontSize: 14, cursor: "pointer" };

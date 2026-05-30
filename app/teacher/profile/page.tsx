"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { WfBox, CornerTag, CommandBar } from "../components/primitives";

type Me = {
  id: string;
  name: string | null;
  email: string;
  emailVerified: boolean;
  counts: { teaching: number; enrolled: number; submissions: number };
};
type ApiResponse<T> = { success: true; data: T } | { success: false; error: string };

export default function TeacherProfile() {
  const { data: session, update } = useSession();
  const [me, setMe] = useState<Me | null>(null);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    const res = await fetch("/api/me", { cache: "no-store" });
    const json: ApiResponse<Me> = await res.json();
    if (json.success) { setMe(json.data); setName(json.data.name ?? ""); }
  }
  useEffect(() => { load(); }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || saving) return;
    setSaving(true); setErr(null);
    try {
      const res = await fetch("/api/me", { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ name: name.trim() }) });
      const json: ApiResponse<{ name: string }> = await res.json();
      if (!json.success) { setErr(json.error); return; }
      await update({ name: json.data.name });
      setEditing(false); load();
    } finally { setSaving(false); }
  }

  const displayName = me?.name ?? session?.user?.name ?? "Teacher";
  const email = me?.email ?? session?.user?.email ?? "";
  const initials = displayName.split(" ").map((s) => s[0]).join("").slice(0, 2).toUpperCase();

  const stats = me
    ? [
        { label: "classes teaching", value: String(me.counts.teaching) },
        { label: "classes enrolled", value: String(me.counts.enrolled) },
        { label: "submissions made", value: String(me.counts.submissions) },
      ]
    : [];

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 24, flexWrap: "wrap" }}>
        <div style={{ width: 64, height: 64, borderRadius: 999, background: "var(--accent-soft)", color: "var(--accent)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-mono)", fontSize: 22, fontWeight: 600 }}>
          {initials}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 style={{ fontWeight: 700, fontSize: 52, margin: 0, letterSpacing: "-0.5px" }}>{displayName}</h1>
          <div style={{ color: "var(--ink-dim)", fontFamily: "var(--font-mono)", fontSize: 13 }}>{email}</div>
        </div>
        <button onClick={() => setEditing(true)} style={editBtn}>Edit profile</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20, marginTop: 30 }} className="teacher-stats-grid">
        {stats.map((s) => (
          <WfBox key={s.label} style={{ padding: 18 }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--ink-faint)", textTransform: "uppercase", letterSpacing: 1 }}>{s.label}</div>
            <div style={{ fontSize: 28, fontWeight: 700, marginTop: 6 }}>{s.value}</div>
          </WfBox>
        ))}
      </div>

      <WfBox style={{ marginTop: 24 }}>
        <CornerTag label="account" />
        <div style={{ color: "var(--ink-dim)", fontSize: 14, marginTop: 4 }}>
          {me?.emailVerified ? "Your email is verified." : "Your email isn't verified yet."}
        </div>
      </WfBox>

      {editing && (
        <div onClick={() => setEditing(false)} style={overlayStyle}>
          <form onClick={(e) => e.stopPropagation()} onSubmit={save} style={modalStyle}>
            <div style={{ fontSize: 20, fontWeight: 700 }}>Edit profile</div>
            <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={{ fontSize: 13, color: "var(--ink-dim)" }}>Name</span>
              <input value={name} onChange={(e) => setName(e.target.value)} maxLength={80} required autoFocus style={inputStyle} />
            </label>
            <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={{ fontSize: 13, color: "var(--ink-dim)" }}>Email</span>
              <input value={email} disabled style={{ ...inputStyle, opacity: 0.6 }} />
            </label>
            {err && <div style={{ color: "var(--danger)", fontSize: 14 }}>{err}</div>}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <button type="button" onClick={() => setEditing(false)} style={ghostBtn}>Cancel</button>
              <button type="submit" disabled={saving || !name.trim()} style={{ ...primaryBtn, opacity: saving || !name.trim() ? 0.5 : 1 }}>{saving ? "Saving…" : "Save"}</button>
            </div>
          </form>
        </div>
      )}

      <CommandBar />

      <style>{`
        @media (max-width: 880px) { .teacher-stats-grid { grid-template-columns: 1fr 1fr !important; } }
      `}</style>
    </>
  );
}

const editBtn: React.CSSProperties = { padding: "8px 14px", borderRadius: 999, border: "1.2px solid var(--ink-faint)", background: "transparent", color: "var(--ink)", fontSize: 13, cursor: "pointer" };
const overlayStyle: React.CSSProperties = { position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 20 };
const modalStyle: React.CSSProperties = { background: "var(--surface)", border: "1.5px solid var(--stroke)", borderRadius: 14, padding: 24, width: "min(440px, 92vw)", display: "flex", flexDirection: "column", gap: 14 };
const inputStyle: React.CSSProperties = { padding: "10px 12px", borderRadius: 10, border: "1.4px solid var(--stroke)", background: "var(--bg)", color: "var(--ink)", fontSize: 15, outline: "none" };
const ghostBtn: React.CSSProperties = { padding: "8px 14px", borderRadius: 999, border: "1.4px solid var(--stroke)", background: "transparent", color: "var(--ink)", fontSize: 14, cursor: "pointer" };
const primaryBtn: React.CSSProperties = { padding: "8px 16px", borderRadius: 999, border: "1.4px solid var(--accent)", background: "var(--accent-soft)", color: "var(--accent)", fontSize: 14, cursor: "pointer" };

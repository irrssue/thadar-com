"use client";

import { useCallback, useEffect, useState } from "react";
import { WfBox, PillStub, Avatar, CommandBar } from "../components/primitives";

type Person = { id: string; name: string | null; email: string };
type Member = { id: string; status: string; user: Person };
type OverviewClass = { id: string; name: string; students: Member[]; pending: Member[]; activeCount: number; pendingCount: number };
type Overview = {
  totals: { classes: number; students: number; pending: number };
  classes: OverviewClass[];
};
type ApiResponse<T> = { success: true; data: T } | { success: false; error: string };

export default function TeacherStudents() {
  const [data, setData] = useState<Overview | null>(null);
  const [classFilter, setClassFilter] = useState<string>("all");
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/teacher/overview", { cache: "no-store" });
    const json: ApiResponse<Overview> = await res.json();
    if (json.success) setData(json.data);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function decide(classId: string, mid: string, action: "approve" | "deny") {
    setBusy(mid);
    try {
      await fetch(`/api/classes/${classId}/members/${mid}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action }),
      });
      await load();
    } finally { setBusy(null); }
  }
  async function remove(classId: string, mid: string) {
    setBusy(mid);
    try {
      await fetch(`/api/classes/${classId}/members/${mid}`, { method: "DELETE" });
      await load();
    } finally { setBusy(null); }
  }

  const classes = (data?.classes ?? []).filter((c) => classFilter === "all" || c.id === classFilter);
  const allPending = (data?.classes ?? []).flatMap((c) => c.pending.map((p) => ({ ...p, classId: c.id, className: c.name })));

  return (
    <>
      <h1 style={{ fontWeight: 700, fontSize: 52, margin: "16px 0 4px", letterSpacing: "-0.5px" }}>
        Your <span style={{ color: "var(--accent)" }}>students</span>
      </h1>
      <p style={{ color: "var(--ink-dim)", fontSize: 18, margin: "0 0 28px", fontWeight: 300 }}>
        {data ? `${data.totals.students} across ${data.totals.classes} ${data.totals.classes === 1 ? "class" : "classes"} · ${data.totals.pending} pending` : "Loading…"}
      </p>

      {allPending.length > 0 && (
        <WfBox style={{ marginBottom: 22 }}>
          <div style={{ fontSize: 13, color: "var(--ink-dim)", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>
            Pending approvals ({allPending.length})
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {allPending.map((p) => (
              <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", border: "1.2px dashed var(--accent)", borderRadius: 10 }}>
                <Avatar name={p.user.name ?? p.user.email} size={32} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 16 }}>{p.user.name ?? p.user.email}</div>
                  <div style={{ fontSize: 11, color: "var(--ink-faint)", fontFamily: "var(--font-mono)" }}>{p.className} · {p.user.email}</div>
                </div>
                <button onClick={() => decide(p.classId, p.id, "approve")} disabled={busy === p.id} style={approveBtn}>Approve</button>
                <button onClick={() => decide(p.classId, p.id, "deny")} disabled={busy === p.id} style={denyBtn}>Deny</button>
              </div>
            ))}
          </div>
        </WfBox>
      )}

      <div style={{ display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap" }}>
        <PillStub variant={classFilter === "all" ? "active" : "default"} onClick={() => setClassFilter("all")}>All classes</PillStub>
        {(data?.classes ?? []).map((c) => (
          <PillStub key={c.id} variant={classFilter === c.id ? "active" : "default"} onClick={() => setClassFilter(c.id)}>{c.name}</PillStub>
        ))}
      </div>

      {!data && <Muted>Loading…</Muted>}
      {data && data.totals.students === 0 && <Muted>No students yet. Share an invite code from a class to get started.</Muted>}

      {classes.map((c) => c.students.length > 0 && (
        <WfBox key={c.id} style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>{c.name}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {c.students.map((m) => (
              <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 12px", border: "1.2px dashed var(--ink-faint)", borderRadius: 10 }}>
                <Avatar name={m.user.name ?? m.user.email} size={32} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 16 }}>{m.user.name ?? m.user.email}</div>
                  <div style={{ fontSize: 11, color: "var(--ink-faint)", fontFamily: "var(--font-mono)" }}>{m.user.email}</div>
                </div>
                <button onClick={() => remove(c.id, m.id)} disabled={busy === m.id} style={denyBtn}>Remove</button>
              </div>
            ))}
          </div>
        </WfBox>
      ))}

      <CommandBar />
    </>
  );
}

function Muted({ children }: { children: React.ReactNode }) {
  return <div style={{ color: "var(--ink-dim)", fontSize: 14, padding: "8px 0" }}>{children}</div>;
}
const approveBtn: React.CSSProperties = { padding: "6px 14px", borderRadius: 999, border: "1.4px solid var(--accent)", background: "var(--accent-soft)", color: "var(--accent)", fontSize: 13, cursor: "pointer" };
const denyBtn: React.CSSProperties = { padding: "6px 14px", borderRadius: 999, border: "1.2px solid var(--danger)", background: "transparent", color: "var(--danger)", fontSize: 13, cursor: "pointer" };

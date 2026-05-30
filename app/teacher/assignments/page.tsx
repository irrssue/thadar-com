"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { WfBox, CornerTag, PillStub, Row, Btn, CommandBar } from "../components/primitives";

type OverviewAssignment = { id: string; title: string; status: string; dueAt: string | null; _count: { submissions: number } };
type OverviewClass = { id: string; name: string; assignments: OverviewAssignment[]; activeCount: number };
type Overview = {
  totals: { classes: number; students: number; pending: number; assignments: number; needsGrading: number };
  classes: OverviewClass[];
};
type ApiResponse<T> = { success: true; data: T } | { success: false; error: string };

type Filter = "All" | "Active" | "Draft";

export default function TeacherAssignments() {
  const [data, setData] = useState<Overview | null>(null);
  const [filter, setFilter] = useState<Filter>("All");
  const [composeClass, setComposeClass] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/teacher/overview", { cache: "no-store" });
    const json: ApiResponse<Overview> = await res.json();
    if (json.success) setData(json.data);
  }, []);

  useEffect(() => { load(); }, [load]);

  const flat = (data?.classes ?? []).flatMap((c) =>
    c.assignments
      .filter((a) => (filter === "Active" ? a.status === "PUBLISHED" : filter === "Draft" ? a.status === "DRAFT" : true))
      .map((a) => ({ ...a, className: c.name, classId: c.id })),
  );

  return (
    <>
      <h1 style={{ fontWeight: 700, fontSize: 52, margin: "16px 0 4px", letterSpacing: "-0.5px" }}>
        Your <span style={{ color: "var(--accent)" }}>assignments</span>
      </h1>
      <p style={{ color: "var(--ink-dim)", fontSize: 18, margin: "0 0 28px", fontWeight: 300 }}>
        {data
          ? `${data.totals.assignments} total · ${data.totals.needsGrading} with submissions`
          : "Loading…"}
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 28 }} className="teacher-split">
        <WfBox>
          <CornerTag label="all classes" />
          <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
            {(["All", "Active", "Draft"] as Filter[]).map((f) => (
              <PillStub key={f} variant={filter === f ? "active" : "default"} onClick={() => setFilter(f)}>{f}</PillStub>
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {!data && <Muted>Loading…</Muted>}
            {data && flat.length === 0 && <Muted>No assignments. Create one from a class on the right.</Muted>}
            {flat.map((a) => (
              <Link key={a.id} href={`/teacher/classes/${a.classId}`} style={{ textDecoration: "none", color: "inherit" }}>
                <Row>
                  <div style={{ display: "flex", flexDirection: "column", gap: 2, flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 17 }}>{a.title}</div>
                    <div style={{ fontSize: 12, color: "var(--ink-dim)", fontFamily: "var(--font-mono)" }}>
                      {a.className} · {a._count.submissions} submissions
                    </div>
                  </div>
                  <PillStub variant={a.status === "PUBLISHED" ? "active" : "default"}>{a.status.toLowerCase()}</PillStub>
                  {a.dueAt && (
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-faint)", marginLeft: 4 }}>
                      {new Date(a.dueAt).toLocaleDateString()}
                    </div>
                  )}
                </Row>
              </Link>
            ))}
          </div>
        </WfBox>

        <div style={{ position: "relative", border: "1.5px dashed var(--stroke)", borderRadius: 14, padding: "18px 20px" }}>
          <CornerTag label="new assignment" />
          <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>Create assignment</div>
          {!data || data.classes.length === 0 ? (
            <Muted>Create a class first, then add assignments to it.</Muted>
          ) : (
            <>
              <p style={{ color: "var(--ink-dim)", fontSize: 14, marginTop: 0 }}>Pick a class to add an assignment to:</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {data.classes.map((c) => (
                  <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", border: "1.2px dashed var(--ink-faint)", borderRadius: 10 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 16 }}>{c.name}</div>
                      <div style={{ fontSize: 12, color: "var(--ink-dim)", fontFamily: "var(--font-mono)" }}>{c.activeCount} students · {c.assignments.length} assignments</div>
                    </div>
                    <Btn variant="primary" onClick={() => setComposeClass(c.id)}>＋ Add</Btn>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {composeClass && (
        <ComposeAssignment classId={composeClass} onClose={() => setComposeClass(null)} onSaved={() => { setComposeClass(null); load(); }} />
      )}

      <CommandBar />
    </>
  );
}

function ComposeAssignment({ classId, onClose, onSaved }: { classId: string; onClose: () => void; onSaved: () => void }) {
  const [title, setTitle] = useState("");
  const [instructions, setInstructions] = useState("");
  const [due, setDue] = useState("");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function save(publish: boolean) {
    if (!title.trim() || saving) return;
    setSaving(true); setErr(null);
    try {
      const res = await fetch(`/api/classes/${classId}/assignments`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          instructions: instructions.trim() || undefined,
          dueAt: due ? new Date(due).toISOString() : undefined,
          status: publish ? "PUBLISHED" : "DRAFT",
        }),
      });
      const json: ApiResponse<unknown> = await res.json();
      if (!json.success) { setErr(json.error); return; }
      onSaved();
    } finally { setSaving(false); }
  }

  return (
    <div onClick={onClose} style={overlayStyle}>
      <div onClick={(e) => e.stopPropagation()} style={{ ...modalStyle, width: "min(640px, 94vw)" }}>
        <div style={{ fontSize: 20, fontWeight: 700 }}>New assignment</div>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required maxLength={160} autoFocus style={inputStyle} />
        <textarea value={instructions} onChange={(e) => setInstructions(e.target.value)} placeholder="Instructions…" rows={6} style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit" }} />
        <input type="datetime-local" value={due} onChange={(e) => setDue(e.target.value)} style={inputStyle} />
        {err && <div style={{ color: "var(--danger)", fontSize: 14 }}>{err}</div>}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button type="button" onClick={onClose} style={ghostBtn}>Cancel</button>
          <button type="button" onClick={() => save(false)} disabled={saving || !title.trim()} style={{ ...ghostBtn, opacity: saving || !title.trim() ? 0.5 : 1 }}>Save draft</button>
          <button type="button" onClick={() => save(true)} disabled={saving || !title.trim()} style={{ ...primaryBtn, opacity: saving || !title.trim() ? 0.5 : 1 }}>Publish</button>
        </div>
      </div>
    </div>
  );
}

function Muted({ children }: { children: React.ReactNode }) {
  return <div style={{ color: "var(--ink-dim)", fontSize: 14, padding: "8px 0" }}>{children}</div>;
}
const overlayStyle: React.CSSProperties = { position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 20 };
const modalStyle: React.CSSProperties = { background: "var(--surface)", border: "1.5px solid var(--stroke)", borderRadius: 14, padding: 24, display: "flex", flexDirection: "column", gap: 12 };
const inputStyle: React.CSSProperties = { padding: "10px 12px", borderRadius: 10, border: "1.4px solid var(--stroke)", background: "var(--bg)", color: "var(--ink)", fontSize: 15, outline: "none" };
const ghostBtn: React.CSSProperties = { padding: "8px 14px", borderRadius: 999, border: "1.4px solid var(--stroke)", background: "transparent", color: "var(--ink)", fontSize: 14, cursor: "pointer" };
const primaryBtn: React.CSSProperties = { padding: "8px 16px", borderRadius: 999, border: "1.4px solid var(--accent)", background: "var(--accent-soft)", color: "var(--accent)", fontSize: 14, cursor: "pointer" };

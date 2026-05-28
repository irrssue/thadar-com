"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Icon from "../../components/Icon";
import { PillStub, Btn, CommandBar } from "../components/primitives";

type ClassRow = {
  id: string;
  name: string;
  description: string | null;
  inviteCode: string | null;
  inviteCodeEnabled: boolean;
  createdAt: string;
  _count: { memberships: number };
};

type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export default function TeacherClasses() {
  const [classes, setClasses] = useState<ClassRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  async function load() {
    setError(null);
    const res = await fetch("/api/classes", { cache: "no-store" });
    const json: ApiResponse<ClassRow[]> = await res.json();
    if (!json.success) {
      setError(json.error);
      return;
    }
    setClasses(json.data);
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <>
      <h1 style={{ fontWeight: 700, fontSize: 52, margin: "16px 0 4px", letterSpacing: "-0.5px" }}>
        Your <span style={{ color: "var(--accent)" }}>classes</span>
      </h1>
      <p style={{ color: "var(--ink-dim)", fontSize: 18, margin: "0 0 28px", fontWeight: 300 }}>
        {classes ? `${classes.length} ${classes.length === 1 ? "class" : "classes"}` : "Loading…"}
      </p>

      <div style={{ display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap", alignItems: "center" }}>
        <PillStub variant="active">All</PillStub>
        <Btn variant="primary" style={{ marginLeft: "auto" }} onClick={() => setShowModal(true)}>
          <Icon name="plus" size={14} /> New class
        </Btn>
      </div>

      {error && (
        <div style={{ color: "var(--danger)", marginBottom: 16 }}>{error}</div>
      )}

      {classes && classes.length === 0 && <EmptyState onCreate={() => setShowModal(true)} />}

      {classes && classes.length > 0 && (
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}
          className="teacher-two-col"
        >
          {classes.map((c) => (
            <Link
              key={c.id}
              href={`/teacher/classes/${c.id}`}
              style={{
                position: "relative",
                border: "1.5px dashed var(--stroke)",
                borderRadius: 14,
                background: "var(--surface)",
                padding: "18px 20px",
                display: "flex",
                flexDirection: "column",
                gap: 10,
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
                <div style={{ fontSize: 22, fontWeight: 700 }}>{c.name}</div>
                <div style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  color: "var(--ink-dim)",
                  letterSpacing: 1,
                  textTransform: "uppercase",
                }}>
                  {c.inviteCode && c.inviteCodeEnabled ? c.inviteCode : "No code"}
                </div>
              </div>
              {c.description && (
                <div style={{ color: "var(--ink-dim)", fontSize: 14, fontWeight: 300 }}>
                  {c.description}
                </div>
              )}
              <div style={{ display: "flex", gap: 14, color: "var(--ink-dim)", fontSize: 14, fontWeight: 300 }}>
                <span><strong style={{ color: "var(--ink)", fontWeight: 700 }}>{c._count.memberships}</strong> students</span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {showModal && (
        <NewClassModal
          onClose={() => setShowModal(false)}
          onCreated={() => {
            setShowModal(false);
            load();
          }}
        />
      )}

      <CommandBar />
    </>
  );
}

function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div style={{
      border: "1.5px dashed var(--stroke)",
      borderRadius: 14,
      padding: "48px 24px",
      textAlign: "center",
      background: "var(--surface)",
    }}>
      <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>No classes yet</div>
      <div style={{ color: "var(--ink-dim)", marginBottom: 20 }}>
        Create your first class to get started.
      </div>
      <Btn variant="primary" onClick={onCreate}>
        <Icon name="plus" size={14} /> New class
      </Btn>
    </div>
  );
}

function NewClassModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    setErr(null);
    try {
      const res = await fetch("/api/classes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || undefined,
        }),
      });
      const json: ApiResponse<unknown> = await res.json();
      if (!json.success) {
        setErr(json.error);
        return;
      }
      onCreated();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.55)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
      }}
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={submit}
        style={{
          background: "var(--surface)",
          border: "1.5px solid var(--stroke)",
          borderRadius: 14,
          padding: 24,
          width: "min(480px, 92vw)",
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        <div style={{ fontSize: 22, fontWeight: 700 }}>New class</div>

        <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span style={{ fontSize: 13, color: "var(--ink-dim)" }}>Name</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            required
            maxLength={120}
            placeholder="e.g. Math 10 — Algebra II"
            style={inputStyle}
          />
        </label>

        <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span style={{ fontSize: 13, color: "var(--ink-dim)" }}>Description (optional)</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={2000}
            rows={3}
            style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit" }}
          />
        </label>

        {err && <div style={{ color: "var(--danger)", fontSize: 14 }}>{err}</div>}

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <Btn onClick={onClose}>Cancel</Btn>
          <button
            type="submit"
            disabled={submitting || !name.trim()}
            style={{
              padding: "8px 14px",
              borderRadius: 999,
              border: "1.4px solid var(--accent)",
              background: "var(--accent-soft)",
              color: "var(--accent)",
              fontSize: 15,
              cursor: submitting ? "default" : "pointer",
              opacity: submitting || !name.trim() ? 0.5 : 1,
            }}
          >
            {submitting ? "Creating…" : "Create class"}
          </button>
        </div>
      </form>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  padding: "10px 12px",
  borderRadius: 10,
  border: "1.4px solid var(--stroke)",
  background: "var(--bg)",
  color: "var(--ink)",
  fontSize: 15,
  outline: "none",
};

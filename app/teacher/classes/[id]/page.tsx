"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { Btn, CommandBar } from "../../components/primitives";

type ClassDetail = {
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

export default function ClassDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [klass, setKlass] = useState<ClassDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [working, setWorking] = useState(false);
  const [copied, setCopied] = useState(false);

  async function load() {
    setError(null);
    const res = await fetch(`/api/classes/${id}`, { cache: "no-store" });
    const json: ApiResponse<ClassDetail> = await res.json();
    if (!json.success) {
      setError(json.error);
      return;
    }
    setKlass(json.data);
  }

  useEffect(() => {
    load();
  }, [id]);

  async function generateCode() {
    setWorking(true);
    setError(null);
    try {
      const res = await fetch(`/api/classes/${id}/invite-code`, {
        method: "POST",
      });
      const json: ApiResponse<{ inviteCode: string; inviteCodeEnabled: boolean }> = await res.json();
      if (!json.success) {
        setError(json.error);
        return;
      }
      setKlass((prev) => prev ? { ...prev, ...json.data } : prev);
    } finally {
      setWorking(false);
    }
  }

  async function toggleEnabled(enabled: boolean) {
    setWorking(true);
    setError(null);
    try {
      const res = await fetch(`/api/classes/${id}/invite-code`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled }),
      });
      const json: ApiResponse<{ inviteCode: string | null; inviteCodeEnabled: boolean }> = await res.json();
      if (!json.success) {
        setError(json.error);
        return;
      }
      setKlass((prev) => prev ? { ...prev, ...json.data } : prev);
    } finally {
      setWorking(false);
    }
  }

  async function copyCode() {
    if (!klass?.inviteCode) return;
    await navigator.clipboard.writeText(klass.inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  if (error && !klass) {
    return (
      <div style={{ padding: "32px 0" }}>
        <div style={{ color: "var(--danger)", marginBottom: 16 }}>{error}</div>
        <Link href="/teacher/classes" style={{ color: "var(--accent)" }}>
          ← Back to classes
        </Link>
      </div>
    );
  }

  if (!klass) {
    return <div style={{ padding: "32px 0", color: "var(--ink-dim)" }}>Loading…</div>;
  }

  return (
    <>
      <Link
        href="/teacher/classes"
        style={{ color: "var(--ink-dim)", fontSize: 14, textDecoration: "none" }}
      >
        ← Classes
      </Link>

      <h1 style={{ fontWeight: 700, fontSize: 44, margin: "12px 0 4px", letterSpacing: "-0.5px" }}>
        {klass.name}
      </h1>
      {klass.description && (
        <p style={{ color: "var(--ink-dim)", fontSize: 17, margin: "0 0 24px", fontWeight: 300 }}>
          {klass.description}
        </p>
      )}

      <div style={{ display: "flex", gap: 14, color: "var(--ink-dim)", fontSize: 14, marginBottom: 28 }}>
        <span>
          <strong style={{ color: "var(--ink)", fontWeight: 700 }}>{klass._count.memberships}</strong> students
        </span>
      </div>

      {/* Invite-code panel */}
      <div style={{
        border: "1.5px dashed var(--stroke)",
        borderRadius: 14,
        background: "var(--surface)",
        padding: "22px 24px",
        marginBottom: 24,
        display: "flex",
        flexDirection: "column",
        gap: 14,
      }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
          <div style={{ fontSize: 20, fontWeight: 700 }}>Invite code</div>
          <div style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: "var(--ink-dim)",
            letterSpacing: 1,
            textTransform: "uppercase",
          }}>
            {klass.inviteCode
              ? klass.inviteCodeEnabled ? "Joining enabled" : "Joining disabled"
              : "Not generated"}
          </div>
        </div>

        {klass.inviteCode ? (
          <>
            <div style={{
              fontFamily: "var(--font-mono)",
              fontSize: 36,
              fontWeight: 700,
              letterSpacing: 4,
              padding: "16px 20px",
              borderRadius: 10,
              background: "var(--bg)",
              border: "1.4px solid var(--stroke)",
              textAlign: "center",
            }}>
              {klass.inviteCode}
            </div>
            <p style={{ color: "var(--ink-dim)", fontSize: 14, margin: 0 }}>
              Share this code with students. They enter it on their dashboard to request to join.
              You approve each request before they appear in the roster.
            </p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <Btn onClick={copyCode}>{copied ? "Copied!" : "Copy code"}</Btn>
              <Btn onClick={generateCode} style={{ opacity: working ? 0.5 : 1 }}>
                {working ? "Working…" : "Regenerate"}
              </Btn>
              <Btn
                onClick={() => toggleEnabled(!klass.inviteCodeEnabled)}
                style={{ marginLeft: "auto", opacity: working ? 0.5 : 1 }}
              >
                {klass.inviteCodeEnabled ? "Disable joining" : "Enable joining"}
              </Btn>
            </div>
          </>
        ) : (
          <>
            <p style={{ color: "var(--ink-dim)", fontSize: 14, margin: 0 }}>
              Generate an invite code so students can request to join this class.
            </p>
            <div>
              <Btn variant="primary" onClick={generateCode} style={{ opacity: working ? 0.5 : 1 }}>
                {working ? "Generating…" : "Generate invite code"}
              </Btn>
            </div>
          </>
        )}

        {error && <div style={{ color: "var(--danger)", fontSize: 14 }}>{error}</div>}
      </div>

      <CommandBar />
    </>
  );
}

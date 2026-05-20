"use client";

interface StatCardProps {
  label: string;
  value: string | number;
  hint?: string;
  accent?: boolean;
}

export default function StatCard({ label, value, hint, accent }: StatCardProps) {
  return (
    <div
      style={{
        border: "1px solid var(--ink-faint)",
        borderRadius: 14,
        background: "rgba(255,255,255,0.012)",
        padding: "18px 20px",
        display: "flex",
        flexDirection: "column",
        gap: 6,
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          color: "var(--ink-dim)",
          letterSpacing: "0.5px",
          textTransform: "lowercase",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 32,
          fontWeight: 600,
          letterSpacing: "-0.5px",
          color: accent ? "var(--accent)" : "var(--ink)",
          lineHeight: 1.1,
        }}
      >
        {value}
      </div>
      {hint && (
        <div style={{ fontSize: 12, color: "var(--ink-dim)" }}>{hint}</div>
      )}
    </div>
  );
}

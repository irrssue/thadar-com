"use client";

import { useState } from "react";
import FloatingNav from "../components/FloatingNav";
import CommandBar from "../components/CommandBar";

const FILTERS = ["All", "In progress", "Has work due", "Archived"];

const tabStyle = {
  border: "1.2px solid var(--ink-faint)",
  borderRadius: 999,
  padding: "4px 10px",
  color: "var(--ink-dim)",
  fontSize: 13,
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  background: "transparent",
  cursor: "pointer",
};

export default function ClassesPage() {
  const [activeTab, setActiveTab] = useState("classes");
  const [filter, setFilter] = useState("All");

  return (
    <>
      <div
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          padding: "40px 56px 160px",
        }}
      >
        <h1
          style={{
            fontWeight: 600,
            fontSize: 48,
            margin: "0 0 4px",
            letterSpacing: "-0.5px",
          }}
        >
          Your <span style={{ color: "var(--accent)" }}>classes</span>
        </h1>

        <p
          style={{
            color: "var(--ink-dim)",
            fontSize: 16,
            margin: "0 0 28px",
            fontWeight: 400,
          }}
        >
          No classes enrolled yet.
        </p>

        <div style={{ display: "flex", gap: 8, marginBottom: 22, flexWrap: "wrap" }}>
          {FILTERS.map((f) => {
            const active = f === filter;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  ...tabStyle,
                  borderColor: active ? "var(--accent)" : "var(--ink-faint)",
                  color: active ? "var(--accent)" : "var(--ink-dim)",
                }}
              >
                {f}
              </button>
            );
          })}
        </div>

        <div
          style={{
            border: "1px solid var(--ink-faint)",
            borderRadius: 14,
            background: "var(--surface)",
            padding: "48px 24px",
            textAlign: "center",
            color: "var(--ink-dim)",
            fontSize: 14,
          }}
        >
          Your teacher hasn&apos;t added any classes yet. Check back later.
        </div>

        <CommandBar />
      </div>

      <FloatingNav active={activeTab} onChange={setActiveTab} />

      <style>{`
        @media (max-width: 1080px) {
          .classes-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 720px) {
          .classes-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
}

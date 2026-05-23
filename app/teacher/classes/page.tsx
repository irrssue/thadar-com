"use client";

import Icon from "../../components/Icon";
import { WfBox, CornerTag, PillStub, Btn, CommandBar } from "../components/primitives";

const CLASSES = [
  {
    name: "Math 10 — Algebra II",
    period: "Period 3 · MWF",
    students: 24, due: 3, missing: 4,
    strip: [1,1,1,1,2,1,1,1,3,1,1,1,2,1,1,1,1,1,1,3,1,1,1,1],
  },
  {
    name: "Math 10 — Algebra II",
    period: "Period 5 · MWF",
    students: 22, due: 1, missing: 2,
    strip: [1,1,1,2,1,1,1,1,1,3,1,1,1,1,1,2,1,1,1,1,1,1],
  },
  {
    name: "Math 9 — Foundations",
    period: "Period 1 · TTh",
    students: 28, due: 2, missing: 7,
    strip: [1,3,1,1,2,1,1,3,1,1,1,1,1,2,1,1,3,1,1,3,1,1,1,1,1,2,1,1],
  },
  {
    name: "Math Club",
    period: "Wed · After school",
    students: 12, due: 0, missing: 0,
    strip: [1,1,1,1,1,1,1,1,1,1,1,1],
  },
];

function StripCell({ v }: { v: number }) {
  const bg =
    v === 1 ? "var(--accent-2)" :
    v === 2 ? "var(--danger)" :
    "rgba(255,255,255,0.08)";
  const opacity = v === 1 ? 0.55 : v === 2 ? 0.5 : 1;
  const border = v === 3 ? "1px dashed var(--ink-faint)" : "none";
  return (
    <div style={{ flex: 1, height: 22, borderRadius: 3, background: bg, opacity, border }} />
  );
}

export default function TeacherClasses() {
  return (
    <>
      <h1 style={{ fontWeight: 700, fontSize: 52, margin: "16px 0 4px", letterSpacing: "-0.5px" }}>
        Your <span style={{ color: "var(--accent)" }}>classes</span>
      </h1>
      <p style={{ color: "var(--ink-dim)", fontSize: 18, margin: "0 0 28px", fontWeight: 300 }}>
        4 sections · 86 students · spring term
      </p>

      <div style={{ display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap", alignItems: "center" }}>
        <PillStub variant="active">All</PillStub>
        <PillStub>In session</PillStub>
        <PillStub>Has work to grade</PillStub>
        <PillStub>Archived</PillStub>
        <Btn variant="primary" style={{ marginLeft: "auto" }}>
          <Icon name="plus" size={14} /> New class
        </Btn>
      </div>

      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}
        className="teacher-two-col"
      >
        {CLASSES.map((c, i) => (
          <div key={i} style={{
            position: "relative",
            border: "1.5px dashed var(--stroke)",
            borderRadius: 14,
            background: "var(--surface)",
            padding: "18px 20px",
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
              <div style={{ fontSize: 22, fontWeight: 700 }}>{c.name}</div>
              <div style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                color: "var(--ink-dim)",
                letterSpacing: 1,
                textTransform: "uppercase",
              }}>
                {c.period}
              </div>
            </div>

            <div style={{ display: "flex", gap: 14, color: "var(--ink-dim)", fontSize: 14, fontWeight: 300 }}>
              <span><strong style={{ color: "var(--ink)", fontWeight: 700 }}>{c.students}</strong> students</span>
              <span><strong style={{ color: "var(--ink)", fontWeight: 700 }}>{c.due}</strong> to grade</span>
              <span style={{ color: c.missing > 0 ? "var(--danger)" : "var(--ink-dim)" }}>
                <strong style={{ fontWeight: 700 }}>{c.missing}</strong> missing
              </span>
            </div>

            {/* Status strip */}
            <div style={{ display: "flex", gap: 2, marginTop: 4 }} aria-label="Assignment status across students">
              {c.strip.map((v, j) => <StripCell key={j} v={v} />)}
            </div>

            <div style={{ display: "flex", gap: 8, marginTop: 6, flexWrap: "wrap" }}>
              <PillStub>Roster</PillStub>
              <PillStub>Gradebook</PillStub>
              <PillStub>Materials</PillStub>
              <PillStub style={{ marginLeft: "auto" }}>＋ Assign</PillStub>
            </div>
          </div>
        ))}
      </div>

      <CommandBar />
    </>
  );
}

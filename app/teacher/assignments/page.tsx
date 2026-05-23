"use client";

import { WfBox, CornerTag, PillStub, CheckBox, Row, Btn, CommandBar } from "../components/primitives";

const ASSIGNMENTS = [
  { title: "Worksheet 4.3 — Factoring",  cls: "Math 10 · P3", state: "18 / 24 submitted",          due: "Today 5p", tag: "active" },
  { title: "Quiz: Linear Equations",     cls: "Math 9 · P1",  state: "22 / 22 submitted",          due: "Closed",   tag: "active" },
  { title: "Exit ticket · Factoring",    cls: "Math 10 · P3", state: "Draft · co-teacher v1",      due: "Fri",      tag: "draft"  },
  { title: "Geometry proof homework",    cls: "Math 10 · P5", state: "9 / 24 submitted",           due: "Thu",      tag: "active" },
  { title: "Project — group rubric",     cls: "Math 9 · P1",  state: "6 groups · 4 pending grade", due: "Next Wed", tag: "active" },
  { title: "Practice set · review",      cls: "Math 10 · P3", state: "Scheduled · publishes Mon 8a", due: "Mon",    tag: "sched"  },
];

function tagVariant(tag: string) {
  if (tag === "draft") return "default" as const;
  if (tag === "sched") return "sage" as const;
  return "active" as const;
}

export default function TeacherAssignments() {
  return (
    <>
      <h1 style={{ fontWeight: 700, fontSize: 52, margin: "16px 0 4px", letterSpacing: "-0.5px" }}>
        Your <span style={{ color: "var(--accent)" }}>assignments</span>
      </h1>
      <p style={{ color: "var(--ink-dim)", fontSize: 18, margin: "0 0 28px", fontWeight: 300 }}>
        12 active · 6 need grading · 3 scheduled
      </p>

      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 28 }}
        className="teacher-split"
      >
        {/* Assignment list */}
        <WfBox>
          <CornerTag label="scheduled & active" />
          <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
            <PillStub variant="active">All</PillStub>
            <PillStub>Active</PillStub>
            <PillStub>Scheduled</PillStub>
            <PillStub>Drafts</PillStub>
            <PillStub>Closed</PillStub>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {ASSIGNMENTS.map((a, i) => (
              <Row key={i}>
                <CheckBox />
                <div style={{ display: "flex", flexDirection: "column", gap: 2, flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 17 }}>{a.title}</div>
                  <div style={{ fontSize: 12, color: "var(--ink-dim)", fontFamily: "var(--font-mono)" }}>
                    {a.cls} · {a.state}
                  </div>
                </div>
                <PillStub variant={tagVariant(a.tag)}>{a.tag}</PillStub>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-faint)", marginLeft: 4 }}>
                  {a.due}
                </div>
              </Row>
            ))}
          </div>
        </WfBox>

        {/* Composer */}
        <div style={{
          position: "relative",
          border: "1.5px dashed var(--stroke)",
          borderRadius: 14,
          padding: "18px 20px",
        }}>
          <CornerTag label="new assignment" />
          <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 10 }}>Create assignment</div>

          <Field placeholder='Title — e.g. "Worksheet 4.4 — Quadratics"' />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
            <Field placeholder="Class · Math 10 · P3" />
            <Field placeholder="Due · pick a date" />
          </div>

          <Field placeholder="Instructions for students…" style={{ marginTop: 12, minHeight: 90 }} />

          <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
            <PillStub>＋ Attach worksheet</PillStub>
            <PillStub>＋ Rubric</PillStub>
            <PillStub>＋ Allow AI tutor</PillStub>
            <PillStub variant="sage">✦ Co-teacher draft</PillStub>
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <Btn variant="solid">Publish</Btn>
            <Btn>Save draft</Btn>
            <Btn style={{ marginLeft: "auto" }}>Schedule</Btn>
          </div>
        </div>
      </div>

      <CommandBar />
    </>
  );
}

function Field({ placeholder, style }: { placeholder: string; style?: React.CSSProperties }) {
  return (
    <div style={{
      border: "1.2px solid var(--stroke)",
      borderRadius: 10,
      padding: "10px 12px",
      background: "var(--surface-2)",
      color: "var(--ink-faint)",
      fontFamily: "var(--font-sans)",
      fontSize: 16,
      ...style,
    }}>
      {placeholder}
    </div>
  );
}

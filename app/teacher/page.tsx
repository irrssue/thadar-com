"use client";

import { useSession } from "next-auth/react";
import Icon from "../components/Icon";
import {
  WfBox, CornerTag, PillStub, CheckBox, Row, Btn, AiInput, Bubble, CommandBar, Avatar,
} from "./components/primitives";

const GRADING_QUEUE = [
  { title: "Algebra II — Worksheet 4.3", from: "Math 10 · Period 3", count: "18 of 24", urgent: true },
  { title: "Quiz: Linear Equations",     from: "Math 9 · Period 1",  count: "22 of 22", urgent: false },
  { title: "Geometry proof — homework",  from: "Math 10 · Period 5", count: "9 of 24",  urgent: false },
  { title: "Re-submission: Sara R.",     from: "Math 10 · Period 3", count: "1",         urgent: false },
];

const PULSE = [
  { tag: "support", name: "Hassan K.", note: "4 late submissions · 41% mastery on factoring" },
  { tag: "support", name: "Noor A.",   note: "Missed 2 quizzes · low confidence in word problems" },
  { tag: "stretch", name: "Emma L.",   note: "96% mastery · ready for stretch problems" },
];

export default function TeacherHome() {
  const { data: session } = useSession();
  const firstName = session?.user?.name?.split(" ")[0] ?? "there";

  return (
    <>
      <h1 style={{ fontWeight: 700, fontSize: 52, margin: "16px 0 4px", letterSpacing: "-0.5px" }}>
        Welcome back, <span style={{ color: "var(--accent)" }}>{firstName}</span>
      </h1>
      <p style={{ color: "var(--ink-dim)", fontSize: 18, margin: "0 0 28px", fontWeight: 300 }}>
        Tuesday · 4 items to grade · 2 unread messages · next class in 14 min
      </p>

      {/* Main 2-col grid */}
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 28 }}
        className="teacher-split"
      >
        {/* Grading queue */}
        <WfBox>
          <CornerTag label="to grade" />
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
            <div style={{ fontSize: 22, fontWeight: 700 }}>To grade</div>
            <span style={{ color: "var(--ink-dim)", fontSize: 14, fontWeight: 300 }}>
              {GRADING_QUEUE.length} items · ~{GRADING_QUEUE.length * 8}m est.
            </span>
          </div>

          <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
            <PillStub variant="active">All</PillStub>
            <PillStub>Math 10 · P3</PillStub>
            <PillStub>Math 10 · P5</PillStub>
            <PillStub>Math 9</PillStub>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 14 }}>
            {GRADING_QUEUE.map((item, i) => (
              <Row key={i} urgent={item.urgent}>
                <CheckBox />
                <div style={{ display: "flex", flexDirection: "column", gap: 2, flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 17 }}>{item.title}</div>
                  <div style={{ fontSize: 12, color: "var(--ink-dim)", fontFamily: "var(--font-mono)" }}>
                    {item.from}
                  </div>
                </div>
                <div style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  color: item.urgent ? "var(--danger)" : "var(--ink-faint)",
                  marginLeft: "auto",
                }}>
                  {item.count}
                </div>
              </Row>
            ))}
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
            <Btn variant="primary">
              <Icon name="pencil" size={14} /> Grade in batch
            </Btn>
            <Btn>Auto-grade quizzes</Btn>
          </div>
        </WfBox>

        {/* Co-teacher AI */}
        <WfBox style={{ display: "flex", flexDirection: "column" }}>
          <CornerTag label="co-teacher" />
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
            <div style={{ fontSize: 22, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 8 }}>
              <Icon name="spark" /> Draft with co-teacher
            </div>
            <span style={{ color: "var(--ink-dim)", fontSize: 14, fontWeight: 300 }}>
              AI · context: your curriculum
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, margin: "10px 0 14px", minHeight: 180 }}>
            <Bubble>Want me to draft Friday's exit ticket on factoring? I can match the difficulty of 4.3.</Bubble>
            <Bubble me>yes — 4 questions, 2 word problems, no calculators</Bubble>
            <Bubble>
              Done. Draft saved as <em>"Exit ticket · Factoring · v1"</em>. I aligned it to{" "}
              <em>HSA-SSE.A.2</em> and flagged it for Math 10 · P3. Want me to also generate a rubric
              and an answer key?
            </Bubble>
          </div>

          <AiInput placeholder="Draft an assignment, rubric, lesson plan, or family update…" />

          <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
            <PillStub>＋ Lesson plan from standard</PillStub>
            <PillStub>＋ Worksheet from notes</PillStub>
            <PillStub>＋ Parent update (weekly)</PillStub>
            <PillStub>＋ Differentiate for IEP</PillStub>
          </div>
        </WfBox>
      </div>

      {/* Pulse row */}
      <div style={{ marginTop: 28 }}>
        <WfBox>
          <CornerTag label="class pulse" />
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
            <div style={{ fontSize: 22, fontWeight: 700 }}>Needs attention</div>
            <span style={{ color: "var(--ink-dim)", fontSize: 14, fontWeight: 300 }}>
              flagged by AI · auto-refreshed daily
            </span>
          </div>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginTop: 14 }}
            className="teacher-split"
          >
            {PULSE.map((p, i) => (
              <WfBox key={i} solid style={{ padding: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                  <Avatar name={p.name} />
                  <div>
                    <div style={{ fontSize: 16 }}>{p.name}</div>
                    <div style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 10,
                      color: p.tag === "support" ? "var(--danger)" : "var(--accent-2)",
                      textTransform: "uppercase",
                      letterSpacing: 1,
                    }}>
                      {p.tag}
                    </div>
                  </div>
                </div>
                <div style={{ color: "var(--ink-dim)", fontSize: 14, fontWeight: 300, lineHeight: 1.35 }}>
                  {p.note}
                </div>
              </WfBox>
            ))}
          </div>
        </WfBox>
      </div>

      <CommandBar />
    </>
  );
}

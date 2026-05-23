"use client";

import { useSession } from "next-auth/react";
import { WfBox, CornerTag, PillStub, CheckBox, Row, Avatar, CommandBar } from "../components/primitives";

const STATS = [
  { label: "students",                    value: "86"      },
  { label: "active assignments",          value: "12"      },
  { label: "avg. turnaround on grading",  value: "1.4 days"},
  { label: "this week",                   value: "32 graded"},
  { label: "parent messages",             value: "8 / mo"  },
  { label: "co-teacher drafts saved",     value: "14"      },
];

const PREFS = [
  "Grading scale · Standards-based",
  "Co-teacher AI · always-on for drafts",
  "Late policy · −10% per day, after 3 = zero",
  "Parent updates · weekly digest (Fri 4p)",
  "Office hours · Tue/Thu 3–4p",
];

export default function TeacherProfile() {
  const { data: session } = useSession();
  const name = session?.user?.name ?? "Ms. Liam";
  const email = session?.user?.email ?? "teacher@thadar.com";
  const initials = name.split(" ").map((s: string) => s[0]).join("").slice(0, 2).toUpperCase();

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 24 }}>
        <div style={{
          width: 64, height: 64,
          borderRadius: 999,
          background: "var(--accent-soft)",
          color: "var(--accent)",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "var(--font-mono)",
          fontSize: 22,
          fontWeight: 600,
        }}>
          {initials}
        </div>
        <div>
          <h1 style={{ fontWeight: 700, fontSize: 52, margin: 0, letterSpacing: "-0.5px" }}>
            {name}
          </h1>
          <div style={{ color: "var(--ink-dim)", fontFamily: "var(--font-mono)", fontSize: 13 }}>
            {email} · Math department · 7 yrs
          </div>
        </div>
      </div>

      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20, marginTop: 30 }}
        className="teacher-stats-grid"
      >
        {STATS.map((s, i) => (
          <WfBox key={i} style={{ padding: 18 }}>
            <div style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              color: "var(--ink-faint)",
              textTransform: "uppercase",
              letterSpacing: 1,
            }}>
              {s.label}
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, marginTop: 6 }}>{s.value}</div>
          </WfBox>
        ))}
      </div>

      <WfBox style={{ marginTop: 24 }}>
        <CornerTag label="preferences" />
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 4 }}>
          {PREFS.map((p, i) => (
            <Row key={i}>
              <CheckBox />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15 }}>{p}</div>
              </div>
              <PillStub>edit</PillStub>
            </Row>
          ))}
        </div>
      </WfBox>

      <CommandBar />

      <style>{`
        @media (max-width: 880px) {
          .teacher-stats-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </>
  );
}

"use client";

import { WfBox, PillStub, Avatar, ProgressBar, CommandBar } from "../components/primitives";

const ROSTER = [
  { name: "Aaliyah Banerjee", id: "ST-2210", progress: 92, late: 0, flag: null },
  { name: "Diego Alvarez",    id: "ST-2211", progress: 78, late: 1, flag: null },
  { name: "Emma Liu",         id: "ST-2212", progress: 96, late: 0, flag: "stretch" },
  { name: "Hassan Karim",     id: "ST-2213", progress: 41, late: 4, flag: "support" },
  { name: "Isla Romero",      id: "ST-2214", progress: 65, late: 2, flag: null },
  { name: "Jonah Park",       id: "ST-2215", progress: 88, late: 0, flag: null },
  { name: "Mei Tanaka",       id: "ST-2216", progress: 73, late: 1, flag: null },
  { name: "Noor Abadi",       id: "ST-2217", progress: 54, late: 3, flag: "support" },
  { name: "Saw Thura Zaw",    id: "ST-2218", progress: 81, late: 0, flag: null },
];

const supportCount = ROSTER.filter((r) => r.flag === "support").length;
const stretchCount = ROSTER.filter((r) => r.flag === "stretch").length;

export default function TeacherStudents() {
  return (
    <>
      <h1 style={{ fontWeight: 700, fontSize: 52, margin: "16px 0 4px", letterSpacing: "-0.5px" }}>
        Your <span style={{ color: "var(--accent)" }}>students</span>
      </h1>
      <p style={{ color: "var(--ink-dim)", fontSize: 18, margin: "0 0 28px", fontWeight: 300 }}>
        86 across 4 sections · {supportCount} need support · {stretchCount} ready for stretch
      </p>

      <div style={{ display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap" }}>
        <PillStub variant="active">All sections</PillStub>
        <PillStub>Math 10 · P3</PillStub>
        <PillStub>Math 10 · P5</PillStub>
        <PillStub>Math 9 · P1</PillStub>
        <PillStub style={{ marginLeft: "auto" }}>↑ name</PillStub>
        <PillStub>↑ progress</PillStub>
        <PillStub>↑ flags</PillStub>
      </div>

      <WfBox>
        {/* Header row */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "32px 1fr 130px 70px 90px",
          gap: 14,
          padding: "0 12px 10px",
          color: "var(--ink-faint)",
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          letterSpacing: 1,
          textTransform: "uppercase",
        }}
          className="roster-header"
        >
          <span />
          <span>Name</span>
          <span className="hide-mobile">Mastery</span>
          <span className="hide-mobile">Late</span>
          <span>Flag</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {ROSTER.map((s, i) => (
            <div key={i} style={{
              display: "grid",
              gridTemplateColumns: "32px 1fr 130px 70px 90px",
              gap: 14,
              alignItems: "center",
              padding: "10px 12px",
              border: "1.2px dashed var(--ink-faint)",
              borderRadius: 10,
            }}
              className="roster-row"
            >
              <Avatar name={s.name} size={32} />

              <div>
                <div style={{ fontSize: 16 }}>{s.name}</div>
                <div style={{ fontSize: 11, color: "var(--ink-faint)", fontFamily: "var(--font-mono)" }}>
                  {s.id}
                </div>
              </div>

              <div className="hide-mobile">
                <ProgressBar value={s.progress} />
              </div>

              <div
                className="hide-mobile"
                style={{
                  fontSize: 14,
                  color: s.late > 0 ? "var(--danger)" : "var(--ink-faint)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                {s.late > 0 ? `${s.late} late` : "—"}
              </div>

              <div>
                {s.flag === "support" && <PillStub variant="danger">support</PillStub>}
                {s.flag === "stretch" && <PillStub variant="sage">stretch</PillStub>}
                {!s.flag && <span style={{ color: "var(--ink-faint)" }}>—</span>}
              </div>
            </div>
          ))}
        </div>
      </WfBox>

      <CommandBar />

      <style>{`
        @media (max-width: 880px) {
          .roster-header, .roster-row {
            grid-template-columns: 28px 1fr 90px !important;
          }
        }
      `}</style>
    </>
  );
}

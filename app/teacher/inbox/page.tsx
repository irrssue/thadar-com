"use client";

import Icon from "../../components/Icon";
import { WfBox, PillStub, Avatar, Btn, CommandBar } from "../components/primitives";

const MAIL = [
  { from: "Hassan Karim",        preview: "Hi Ms. Patel — I won't be able to turn in 4.3 by today because…", when: "9:14a",  unread: true,  channel: "Student" },
  { from: "Parent · D. Alvarez", preview: "Just wanted to follow up on the parent–teacher conference slot…",  when: "8:02a",  unread: true,  channel: "Parent"  },
  { from: "Mr. Khan",            preview: "Are we still on for Friday's department meeting? Agenda attached.", when: "Yest.", unread: false, channel: "Staff"   },
  { from: "Emma Liu",            preview: "Can I attempt the bonus problem for extra credit?",                 when: "Mon",   unread: false, channel: "Student" },
  { from: "Admin · Front Desk",  preview: "Reminder: field trip permission slips due Thursday.",               when: "Mon",   unread: false, channel: "Staff"   },
];

const unreadCount = MAIL.filter((m) => m.unread).length;

export default function TeacherInbox() {
  return (
    <>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <h1 style={{ fontWeight: 700, fontSize: 52, margin: "16px 0 4px", letterSpacing: "-0.5px" }}>
          Your <span style={{ color: "var(--accent)" }}>inbox</span>
        </h1>
        <Btn variant="primary">
          <Icon name="pencil" size={14} /> Compose
        </Btn>
      </div>
      <p style={{ color: "var(--ink-dim)", fontSize: 18, margin: "0 0 28px", fontWeight: 300 }}>
        {unreadCount} unread · students, parents, staff
      </p>

      <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
        <PillStub variant="active">All</PillStub>
        <PillStub>Students</PillStub>
        <PillStub>Parents</PillStub>
        <PillStub>Staff</PillStub>
        <PillStub style={{ marginLeft: "auto" }}>Unread only</PillStub>
      </div>

      <WfBox>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {MAIL.map((m, i) => (
            <div key={i} style={{
              display: "grid",
              gridTemplateColumns: "32px 180px 1fr 80px",
              gap: 14,
              alignItems: "center",
              padding: "12px 14px",
              border: m.unread ? "1.2px dashed var(--accent)" : "1.2px dashed var(--ink-faint)",
              borderRadius: 10,
            }}
              className="mail-row"
            >
              <Avatar name={m.from} size={32} />

              <div>
                <div style={{ fontSize: 16 }}>
                  {m.unread && (
                    <span style={{
                      width: 6, height: 6,
                      borderRadius: 999,
                      background: "var(--accent)",
                      display: "inline-block",
                      marginRight: 6,
                    }} />
                  )}
                  {m.from}
                </div>
                <div style={{ fontSize: 11, color: "var(--ink-dim)", fontFamily: "var(--font-mono)" }}>
                  {m.channel.toLowerCase()}
                </div>
              </div>

              <div style={{
                fontSize: 14,
                color: "var(--ink-dim)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                fontWeight: 300,
              }}
                className="mail-preview"
              >
                {m.preview}
              </div>

              <div style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                color: "var(--ink-faint)",
                textAlign: "right",
              }}>
                {m.when}
              </div>
            </div>
          ))}
        </div>
      </WfBox>

      <CommandBar />

      <style>{`
        @media (max-width: 880px) {
          .mail-row { grid-template-columns: 28px 1fr 60px !important; }
          .mail-preview { display: none !important; }
        }
      `}</style>
    </>
  );
}

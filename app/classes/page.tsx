"use client";

import { useState } from "react";
import FloatingNav from "../components/FloatingNav";
import CommandBar from "../components/CommandBar";
import ClassCard, { ClassInfo } from "../components/ClassCard";

const CLASSES: ClassInfo[] = [
  {
    code: "MATH-10",
    title: "Algebra II",
    teacher: "Ms. Patel",
    schedule: "Mon · Wed · Fri",
    room: "Rm 204",
    progress: 62,
    nextItem: "Worksheet 4.3 — factoring trinomials",
    nextDue: "today",
    unread: 2,
    accent: "var(--accent)",
  },
  {
    code: "ENG-10",
    title: "English Literature",
    teacher: "Mr. Khan",
    schedule: "Tue · Thu",
    room: "Rm 117",
    progress: 48,
    nextItem: "Read Ch. 7 — The Outsiders",
    nextDue: "Tue",
    unread: 1,
  },
  {
    code: "BIO-10",
    title: "Biology",
    teacher: "Dr. Liu",
    schedule: "Mon · Wed",
    room: "Lab 3",
    progress: 71,
    nextItem: "Lab report draft — cell division",
    nextDue: "Thu",
    unread: 0,
  },
  {
    code: "ART-10",
    title: "Studio Art",
    teacher: "Ms. Ortiz",
    schedule: "Fri",
    room: "Studio A",
    progress: 55,
    nextItem: "3 thumbnail sketches",
    nextDue: "Fri",
    unread: 0,
  },
  {
    code: "SPN-10",
    title: "Spanish",
    teacher: "Sra. Romero",
    schedule: "Mon · Wed · Fri",
    room: "Rm 109",
    progress: 80,
    nextItem: "Vocab quiz — chapter 5",
    nextDue: "Mon",
    unread: 3,
  },
  {
    code: "HIST-10",
    title: "World History",
    teacher: "Mr. Davies",
    schedule: "Tue · Thu",
    room: "Rm 222",
    progress: 40,
    nextItem: "Essay outline — Cold War",
    nextDue: "next Wed",
    unread: 0,
  },
];

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

  const totalUnread = CLASSES.reduce((sum, c) => sum + c.unread, 0);
  const dueSoon = CLASSES.filter((c) => ["today", "Tue"].includes(c.nextDue)).length;

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
          {CLASSES.length} active · {dueSoon} with work due this week · {totalUnread} unread updates
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
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 22,
          }}
          className="classes-grid"
        >
          {CLASSES.map((c) => (
            <ClassCard key={c.code} data={c} />
          ))}
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

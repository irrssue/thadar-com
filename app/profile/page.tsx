"use client";

import { useState } from "react";
import FloatingNav from "../components/FloatingNav";
import CommandBar from "../components/CommandBar";
import StatCard from "../components/StatCard";
import SubjectBarChart, { SubjectScore } from "../components/SubjectBarChart";
import ActivityHeatmap from "../components/ActivityHeatmap";
import AchievementBadge, { Achievement } from "../components/AchievementBadge";
import Icon from "../components/Icon";

const SUBJECTS: SubjectScore[] = [
  { code: "SPN-10", title: "Spanish", score: 88, delta: 6 },
  { code: "BIO-10", title: "Biology", score: 82, delta: 3 },
  { code: "MATH-10", title: "Algebra II", score: 71, delta: 4 },
  { code: "ART-10", title: "Studio Art", score: 64, delta: -1 },
  { code: "ENG-10", title: "English Literature", score: 52, delta: 2 },
  { code: "HIST-10", title: "World History", score: 38, delta: -5 },
];

const ACHIEVEMENTS: Achievement[] = [
  { id: "streak7", icon: "flame", title: "Week streak", detail: "7 days in a row", earned: true },
  { id: "first100", icon: "trophy", title: "Perfect score", detail: "100% on a quiz", earned: true },
  { id: "earlybird", icon: "clock", title: "Early bird", detail: "Study before 8am", earned: true },
  { id: "bookworm", icon: "book", title: "Bookworm", detail: "Read 10 chapters", earned: false },
  { id: "sharp", icon: "target", title: "Sharpshooter", detail: "5 quizzes in a row 90%+", earned: false },
  { id: "trend", icon: "trend", title: "Climbing", detail: "Improve a subject 20+ pts", earned: true },
];

function genActivity(n: number) {
  const out: number[] = [];
  for (let i = 0; i < n; i++) {
    const seed = Math.sin(i * 1.7) * 50 + 50;
    const noise = Math.sin(i * 0.3) * 30;
    const v = Math.max(0, Math.min(100, seed + noise - 20));
    out.push(i % 7 === 6 ? Math.max(0, v - 40) : Math.round(v));
  }
  return out;
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("profile");
  const activity = genActivity(14 * 7);

  const acing = SUBJECTS.filter((s) => s.score >= 80);
  const needsWork = [...SUBJECTS].sort((a, b) => a.score - b.score).slice(0, 2);
  const avg = Math.round(SUBJECTS.reduce((a, s) => a + s.score, 0) / SUBJECTS.length);

  return (
    <>
      <div
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          padding: "40px 56px 160px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: 22,
            marginBottom: 8,
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              width: 92,
              height: 92,
              borderRadius: "50%",
              background: "linear-gradient(135deg, var(--avatar-grad-from), var(--avatar-grad-to))",
              border: "1px solid var(--accent)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 36,
              fontWeight: 600,
              color: "var(--accent)",
              letterSpacing: "-0.5px",
              flexShrink: 0,
            }}
          >
            T
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1
              style={{
                fontWeight: 600,
                fontSize: 48,
                margin: "0 0 4px",
                letterSpacing: "-0.5px",
              }}
            >
              <span style={{ color: "var(--accent)" }}>Thazin</span> Aung
            </h1>
            <p
              style={{
                color: "var(--ink-dim)",
                fontSize: 16,
                margin: 0,
                fontWeight: 400,
              }}
            >
              Grade 10 · joined Aug 2025 · 6 active classes
            </p>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 16,
            margin: "28px 0",
          }}
          className="profile-stats"
        >
          <StatCard label="overall avg" value={`${avg}%`} hint="across 6 subjects" accent />
          <StatCard label="day streak" value={12} hint="best · 23 days" />
          <StatCard label="hours studied" value={47} hint="this month" />
          <StatCard label="assignments" value="38 / 42" hint="on time" />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.4fr 1fr",
            gap: 22,
            marginBottom: 22,
          }}
          className="profile-grid"
        >
          <SubjectBarChart data={SUBJECTS} />

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <FocusCard
              title="Acing"
              accent="var(--accent)"
              icon="trend"
              items={acing.map((s) => ({ label: s.title, value: `${s.score}%` }))}
              empty="Keep pushing — nothing locked in yet."
            />
            <FocusCard
              title="Focus next"
              accent="var(--danger)"
              icon="target"
              items={needsWork.map((s) => ({ label: s.title, value: `${s.score}%` }))}
              empty="All clear."
            />
          </div>
        </div>

        <div style={{ marginBottom: 22 }}>
          <ActivityHeatmap weeks={14} data={activity} />
        </div>

        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              marginBottom: 14,
            }}
          >
            <h2
              style={{
                fontSize: 20,
                fontWeight: 600,
                letterSpacing: "-0.2px",
                margin: 0,
              }}
            >
              Achievements
            </h2>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                color: "var(--ink-dim)",
              }}
            >
              {ACHIEVEMENTS.filter((a) => a.earned).length} / {ACHIEVEMENTS.length}
            </span>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 14,
            }}
            className="achievements-grid"
          >
            {ACHIEVEMENTS.map((a) => (
              <AchievementBadge key={a.id} data={a} />
            ))}
          </div>
        </div>

        <CommandBar />
      </div>

      <FloatingNav active={activeTab} onChange={setActiveTab} />

      <style>{`
        @media (max-width: 1080px) {
          .profile-grid { grid-template-columns: 1fr !important; }
          .profile-stats { grid-template-columns: repeat(2, 1fr) !important; }
          .achievements-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 640px) {
          .profile-stats { grid-template-columns: 1fr 1fr !important; }
          .achievements-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}

interface FocusItem {
  label: string;
  value: string;
}

interface FocusCardProps {
  title: string;
  accent: string;
  icon: string;
  items: FocusItem[];
  empty: string;
}

function FocusCard({ title, accent, icon, items, empty }: FocusCardProps) {
  return (
    <div
      style={{
        border: "1px solid var(--ink-faint)",
        borderRadius: 14,
        background: "var(--surface)",
        padding: "18px 20px",
        flex: 1,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 12,
          color: accent,
        }}
      >
        <Icon name={icon} size={16} />
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: "0.5px",
            textTransform: "lowercase",
          }}
        >
          {title}
        </span>
      </div>
      {items.length === 0 ? (
        <div style={{ fontSize: 13, color: "var(--ink-dim)" }}>{empty}</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {items.map((it) => (
            <div
              key={it.label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                paddingBottom: 6,
                borderBottom: "1px solid var(--hairline)",
              }}
            >
              <span style={{ fontSize: 14, color: "var(--ink)" }}>{it.label}</span>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 13,
                  color: accent,
                }}
              >
                {it.value}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

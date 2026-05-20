"use client";

import Icon from "./Icon";

export interface Achievement {
  id: string;
  icon: string;
  title: string;
  detail: string;
  earned: boolean;
}

interface AchievementBadgeProps {
  data: Achievement;
}

export default function AchievementBadge({ data }: AchievementBadgeProps) {
  const earned = data.earned;
  return (
    <div
      style={{
        border: "1px solid var(--ink-faint)",
        borderRadius: 12,
        background: "rgba(255,255,255,0.012)",
        padding: "14px 16px",
        display: "flex",
        gap: 12,
        alignItems: "center",
        opacity: earned ? 1 : 0.45,
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 999,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          background: earned ? "rgba(224,185,122,0.12)" : "rgba(255,255,255,0.03)",
          color: earned ? "var(--accent)" : "var(--ink-dim)",
          border: `1px solid ${earned ? "var(--accent)" : "var(--ink-faint)"}`,
          flexShrink: 0,
        }}
      >
        <Icon name={data.icon} size={18} />
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: "var(--ink)" }}>
          {data.title}
        </div>
        <div style={{ fontSize: 12, color: "var(--ink-dim)" }}>{data.detail}</div>
      </div>
    </div>
  );
}

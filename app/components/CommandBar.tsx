"use client";

import Icon from "./Icon";

export default function CommandBar() {
  return (
    <div
      style={{
        marginTop: 28,
        border: "1.4px solid var(--stroke)",
        borderRadius: 14,
        padding: "14px 18px",
        display: "flex",
        alignItems: "center",
        gap: 14,
        background: "rgba(255,255,255,0.02)",
      }}
    >
      <Icon name="search" />
      <span
        style={{
          color: "var(--ink-faint)",
          fontSize: 15,
          flex: 1,
        }}
      >
        Jump to a class, assignment, or person…
      </span>
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          color: "var(--ink-dim)",
          border: "1px solid var(--ink-faint)",
          padding: "3px 6px",
          borderRadius: 5,
        }}
      >
        ⌘ K
      </span>
    </div>
  );
}

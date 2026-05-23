"use client";

import { useState } from "react";
import FloatingNav from "../components/FloatingNav";
import CommandBar from "../components/CommandBar";
import Icon from "../components/Icon";

type Category = "Inbox" | "Draft" | "Starred";

const CATEGORIES: Category[] = ["Inbox", "Draft", "Starred"];

export default function InboxPage() {
  const [activeTab, setActiveTab] = useState("inbox");
  const [category, setCategory] = useState<Category>("Inbox");

  return (
    <>
      <div
        style={{
          maxWidth: 1080,
          margin: "0 auto",
          padding: "40px 56px 160px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 16,
            marginBottom: 4,
          }}
        >
          <h1
            style={{
              fontWeight: 600,
              fontSize: 48,
              margin: 0,
              letterSpacing: "-0.5px",
            }}
          >
            Your <span style={{ color: "var(--accent)" }}>mail</span>
          </h1>

          <button
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 14px",
              borderRadius: 999,
              border: "1.2px solid var(--ink-faint)",
              background: "transparent",
              color: "var(--ink)",
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            <Icon name="edit" size={16} />
            Compose
          </button>
        </div>

        <p
          style={{
            color: "var(--ink-dim)",
            fontSize: 16,
            margin: "0 0 28px",
            fontWeight: 400,
          }}
        >
          No messages yet.
        </p>

        <div style={{ display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap" }}>
          {CATEGORIES.map((c) => {
            const active = c === category;
            return (
              <button
                key={c}
                onClick={() => setCategory(c)}
                style={{
                  border: "1.2px solid var(--ink-faint)",
                  borderRadius: 999,
                  padding: "5px 12px",
                  background: "transparent",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 13,
                  color: active ? "var(--accent)" : "var(--ink-dim)",
                  borderColor: active ? "var(--accent)" : "var(--ink-faint)",
                }}
              >
                {c}
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    color: active ? "var(--accent)" : "var(--ink-dim)",
                    opacity: 0.85,
                  }}
                >
                  0
                </span>
              </button>
            );
          })}
        </div>

        <ul
          style={{
            listStyle: "none",
            margin: 0,
            padding: 0,
            borderTop: "1px solid var(--ink-faint)",
          }}
        >
          <li
            style={{
              padding: "28px 6px",
              color: "var(--ink-dim)",
              fontSize: 14,
              textAlign: "center",
            }}
          >
            Nothing here yet.
          </li>
        </ul>

        <CommandBar />
      </div>

      <FloatingNav active={activeTab} onChange={setActiveTab} />

      <style>{`
        .mail-row:hover { background: var(--surface-hover); }
        @media (max-width: 820px) {
          .mail-row {
            grid-template-columns: 24px 110px 1fr 52px !important;
            gap: 10px !important;
          }
        }
      `}</style>
    </>
  );
}

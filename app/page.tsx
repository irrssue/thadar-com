"use client";

import { useState } from "react";
import FloatingNav from "./components/FloatingNav";
import TodoCard from "./components/TodoCard";
import AskCard from "./components/AskCard";
import CommandBar from "./components/CommandBar";

export default function Home() {
  const [activeTab, setActiveTab] = useState("home");

  return (
    <>
      <div
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          padding: "40px 56px 160px",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: "var(--ink-faint)",
            letterSpacing: 1,
            textTransform: "uppercase",
            border: "1px solid var(--ink-faint)",
            borderRadius: 4,
            padding: "4px 8px",
            display: "inline-block",
            transform: "rotate(-2deg)",
          }}
        >
          wireframe · v1 · dark
        </span>

        <h1
          style={{
            fontFamily: "var(--font-kalam)",
            fontWeight: 700,
            fontSize: 56,
            margin: "16px 0 4px",
            letterSpacing: "-0.5px",
          }}
        >
          Welcome,{" "}
          <span style={{ color: "var(--accent)" }}>Thazin</span>
        </h1>

        <p
          style={{
            color: "var(--ink-dim)",
            fontSize: 18,
            margin: "0 0 28px",
            fontWeight: 300,
            fontFamily: "var(--font-kalam)",
          }}
        >
          Tuesday · 3 things due today · 1 message from Ms. Patel
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.6fr",
            gap: 28,
          }}
          className="main-grid"
        >
          <TodoCard count={5} />
          <AskCard />
        </div>

        <CommandBar />

        <div
          style={{
            display: "flex",
            gap: 24,
            alignItems: "center",
            marginTop: 36,
            color: "var(--ink-faint)",
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: 1,
            textTransform: "uppercase",
          }}
        >
          <span>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: 999,
                background: "var(--accent)",
                display: "inline-block",
                marginRight: 6,
              }}
            />
            active nav
          </span>
          <span>— — dashed = placeholder area</span>
          <span>solid = real component (next iteration)</span>
        </div>
      </div>

      <FloatingNav active={activeTab} onChange={setActiveTab} />

      <style>{`
        @media (max-width: 880px) {
          .main-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
}

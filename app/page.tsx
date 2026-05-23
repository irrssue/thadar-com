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
        <h1
          style={{
            fontWeight: 600,
            fontSize: 48,
            margin: "0 0 4px",
            letterSpacing: "-0.5px",
          }}
        >
          Welcome,{" "}
          <span style={{ color: "var(--accent)" }}>Thazin</span>
        </h1>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            margin: "0 0 28px",
          }}
        >
          <p
            style={{
              color: "var(--ink-dim)",
              fontSize: 16,
              margin: 0,
              fontWeight: 400,
            }}
          >
            Tuesday · 3 things due today · 1 message from Ms. Patel
          </p>
          <span
            style={{
              color: "var(--accent)",
              fontSize: 16,
              fontWeight: 500,
            }}
          >
            Next Class in 2 Days
          </span>
        </div>

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

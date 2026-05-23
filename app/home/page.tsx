"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import FloatingNav from "../components/FloatingNav";
import AskCard from "../components/AskCard";
import CommandBar from "../components/CommandBar";

export default function Home() {
  const [activeTab, setActiveTab] = useState("home");
  const { data: session } = useSession();

  const firstName = session?.user?.name?.split(" ")[0] ?? "there";

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
          <span style={{ color: "var(--accent)" }}>{firstName}</span>
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
            Nothing due yet — check back when your teacher assigns work.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.6fr",
            gap: 28,
          }}
          className="main-grid"
        >
          <div
            style={{
              border: "1px solid var(--ink-faint)",
              borderRadius: 14,
              background: "var(--surface)",
              padding: "18px 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--ink-dim)",
              fontSize: 14,
            }}
          >
            No assignments yet.
          </div>
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

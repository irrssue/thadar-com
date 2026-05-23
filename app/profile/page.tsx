"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import FloatingNav from "../components/FloatingNav";
import CommandBar from "../components/CommandBar";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("profile");
  const { data: session } = useSession();

  const name = session?.user?.name ?? "Student";
  const email = session?.user?.email ?? "";
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      <div
        style={{
          maxWidth: 860,
          margin: "0 auto",
          padding: "24px 34px 100px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: 14,
            marginBottom: 24,
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: "linear-gradient(135deg, var(--avatar-grad-from), var(--avatar-grad-to))",
              border: "1px solid var(--accent)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              fontWeight: 600,
              color: "var(--accent)",
              letterSpacing: "-0.5px",
              flexShrink: 0,
            }}
          >
            {initials}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1
              style={{
                fontWeight: 600,
                fontSize: 28,
                margin: "0 0 2px",
                letterSpacing: "-0.5px",
              }}
            >
              <span style={{ color: "var(--accent)" }}>{name}</span>
            </h1>
            <p
              style={{
                color: "var(--ink-dim)",
                fontSize: 13,
                margin: 0,
                fontWeight: 400,
              }}
            >
              {email}
            </p>
          </div>
        </div>

        <div
          style={{
            border: "1px solid var(--ink-faint)",
            borderRadius: 14,
            background: "var(--surface)",
            padding: "32px 24px",
            color: "var(--ink-dim)",
            fontSize: 14,
            textAlign: "center",
          }}
        >
          Stats and progress will appear here once you start completing work.
        </div>

        <CommandBar />
      </div>

      <FloatingNav active={activeTab} onChange={setActiveTab} />
    </>
  );
}

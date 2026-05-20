"use client";

import { useMemo, useState } from "react";
import FloatingNav from "../components/FloatingNav";
import CommandBar from "../components/CommandBar";
import Icon from "../components/Icon";

type Category = "Inbox" | "Draft" | "Starred";

interface Mail {
  id: string;
  from: string;
  subject: string;
  preview: string;
  time: string;
  unread: boolean;
  starred: boolean;
  draft: boolean;
  tag?: string;
}

const MAILS: Mail[] = [
  {
    id: "m1",
    from: "Ms. Patel",
    subject: "Worksheet 4.3 feedback",
    preview: "Nice work on factoring. Review problems 7 and 9 — small sign errors.",
    time: "9:14a",
    unread: true,
    starred: true,
    draft: false,
    tag: "MATH-10",
  },
  {
    id: "m2",
    from: "Mr. Khan",
    subject: "The Outsiders — discussion questions",
    preview: "Please bring three questions to Thursday's class. Focus on chapters 6–7.",
    time: "Yest",
    unread: true,
    starred: false,
    draft: false,
    tag: "ENG-10",
  },
  {
    id: "m3",
    from: "Dr. Liu",
    subject: "Lab report draft check-in",
    preview: "Your draft looks solid. A few notes on the methods section attached.",
    time: "Yest",
    unread: false,
    starred: true,
    draft: false,
    tag: "BIO-10",
  },
  {
    id: "m4",
    from: "Sra. Romero",
    subject: "Quiz reminder — vocab ch. 5",
    preview: "Monday's quiz covers 40 words. Practice deck shared in class folder.",
    time: "Mon",
    unread: false,
    starred: false,
    draft: false,
    tag: "SPN-10",
  },
  {
    id: "m5",
    from: "Me",
    subject: "Re: Essay outline — Cold War",
    preview: "Here is the rough outline so far. Still need to add the second body...",
    time: "Sun",
    unread: false,
    starred: false,
    draft: true,
    tag: "HIST-10",
  },
  {
    id: "m6",
    from: "Ms. Ortiz",
    subject: "Thumbnail sketches due Friday",
    preview: "Three sketches, any medium. Bring them to studio at the start of class.",
    time: "Sun",
    unread: false,
    starred: false,
    draft: false,
    tag: "ART-10",
  },
  {
    id: "m7",
    from: "Mr. Davies",
    subject: "Cold War reading packet",
    preview: "Packet is shared. Skim sections 1–3 before next Wednesday's class.",
    time: "Fri",
    unread: false,
    starred: true,
    draft: false,
    tag: "HIST-10",
  },
  {
    id: "m8",
    from: "Me",
    subject: "Re: Lab report draft",
    preview: "Thanks for the notes — fixing methods section tonight and resending.",
    time: "Fri",
    unread: false,
    starred: false,
    draft: true,
    tag: "BIO-10",
  },
  {
    id: "m9",
    from: "Thadar",
    subject: "Weekly progress summary",
    preview: "5 lessons completed · 2 assignments turned in · streak holding at 9 days.",
    time: "Thu",
    unread: false,
    starred: false,
    draft: false,
  },
];

const CATEGORIES: Category[] = ["Inbox", "Draft", "Starred"];

export default function InboxPage() {
  const [activeTab, setActiveTab] = useState("inbox");
  const [category, setCategory] = useState<Category>("Inbox");
  const [starred, setStarred] = useState<Record<string, boolean>>(
    () => Object.fromEntries(MAILS.map((m) => [m.id, m.starred])),
  );

  const counts = useMemo(
    () => ({
      Inbox: MAILS.filter((m) => !m.draft).length,
      Draft: MAILS.filter((m) => m.draft).length,
      Starred: MAILS.filter((m) => starred[m.id]).length,
    }),
    [starred],
  );

  const visible = useMemo(() => {
    if (category === "Draft") return MAILS.filter((m) => m.draft);
    if (category === "Starred") return MAILS.filter((m) => starred[m.id]);
    return MAILS.filter((m) => !m.draft);
  }, [category, starred]);

  const unreadInbox = MAILS.filter((m) => !m.draft && m.unread).length;

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
          {counts.Inbox} in inbox · {unreadInbox} unread · {counts.Draft} draft
          {counts.Draft === 1 ? "" : "s"} · {counts.Starred} starred
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
                  {counts[c]}
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
          {visible.length === 0 && (
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
          )}

          {visible.map((m) => {
            const isStarred = !!starred[m.id];
            return (
              <li
                key={m.id}
                className="mail-row"
                style={{
                  display: "grid",
                  gridTemplateColumns: "28px 160px 1fr 64px",
                  alignItems: "center",
                  gap: 16,
                  padding: "14px 6px",
                  borderBottom: "1px solid var(--ink-faint)",
                  cursor: "pointer",
                  transition: "background 120ms",
                }}
              >
                <button
                  onClick={() =>
                    setStarred((s) => ({ ...s, [m.id]: !s[m.id] }))
                  }
                  aria-label={isStarred ? "Unstar" : "Star"}
                  style={{
                    background: "transparent",
                    border: "none",
                    padding: 2,
                    cursor: "pointer",
                    color: isStarred ? "var(--accent)" : "var(--ink-faint)",
                    display: "inline-flex",
                  }}
                >
                  <Icon name={isStarred ? "star-fill" : "star"} size={16} />
                </button>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    minWidth: 0,
                  }}
                >
                  {m.unread && !m.draft && (
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: 999,
                        background: "var(--accent)",
                        flex: "none",
                      }}
                    />
                  )}
                  <span
                    style={{
                      fontSize: 14,
                      color: "var(--ink)",
                      fontWeight: m.unread && !m.draft ? 600 : 400,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {m.from}
                  </span>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    minWidth: 0,
                  }}
                >
                  {m.draft && (
                    <span
                      style={{
                        color: "var(--danger)",
                        fontFamily: "var(--font-mono)",
                        fontSize: 11,
                        letterSpacing: 0.5,
                        textTransform: "uppercase",
                        flex: "none",
                      }}
                    >
                      Draft
                    </span>
                  )}
                  <span
                    style={{
                      fontSize: 14,
                      color: "var(--ink)",
                      fontWeight: m.unread && !m.draft ? 600 : 400,
                      flex: "none",
                      maxWidth: 280,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {m.subject}
                  </span>
                  <span
                    style={{
                      color: "var(--ink-dim)",
                      fontSize: 14,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      minWidth: 0,
                    }}
                  >
                    — {m.preview}
                  </span>
                  {m.tag && (
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 10,
                        color: "var(--ink-dim)",
                        border: "1px solid var(--ink-faint)",
                        borderRadius: 4,
                        padding: "1px 6px",
                        flex: "none",
                      }}
                    >
                      {m.tag}
                    </span>
                  )}
                </div>

                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 12,
                    color: "var(--ink-dim)",
                    textAlign: "right",
                  }}
                >
                  {m.time}
                </span>
              </li>
            );
          })}
        </ul>

        <CommandBar />
      </div>

      <FloatingNav active={activeTab} onChange={setActiveTab} />

      <style>{`
        .mail-row:hover { background: rgba(255,255,255,0.025); }
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

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "./Icon";
import { useTheme } from "./ThemeProvider";
import ViewSwitcher from "./ViewSwitcher";

const NAV_ITEMS = [
  { id: "home", label: "Home", href: "/home" },
  { id: "classes", label: "Classes", href: "/classes" },
  { id: "profile", label: "Profile", href: "/profile" },
  { id: "inbox", label: "Inbox", href: "/inbox" },
  { id: "theme", label: "Theme", href: "#theme" },
];

interface FloatingNavProps {
  active?: string;
  onChange?: (id: string) => void;
}

export default function FloatingNav({ active, onChange }: FloatingNavProps) {
  const pathname = usePathname();
  const { theme, toggle } = useTheme();
  const currentId =
    active ??
    NAV_ITEMS.find((i) =>
      i.href === "/home" ? pathname === "/home" : pathname.startsWith(i.href),
    )?.id ??
    "home";

  return (
    <div
      style={{
        position: "fixed",
        bottom: 28,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        pointerEvents: "none",
        zIndex: 50,
      }}
    >
      <nav
        style={{
          pointerEvents: "auto",
          display: "flex",
          alignItems: "center",
          gap: 4,
          background: "var(--nav-bg)",
          border: "1px solid var(--nav-border)",
          borderRadius: 999,
          padding: 8,
          boxShadow: "var(--nav-shadow)",
        }}
        aria-label="Primary"
      >
        {NAV_ITEMS.map((item) => {
          const isActive = currentId === item.id;
          const isTheme = item.id === "theme";
          const iconName = isTheme ? (theme === "dark" ? "sun" : "moon") : item.id;
          const label = isTheme
            ? theme === "dark"
              ? "Switch to light"
              : "Switch to dark"
            : item.label;
          const sharedStyle = {
            width: 42,
            height: 42,
            borderRadius: 999,
            border: "none",
            background: isActive ? "var(--nav-active)" : "transparent",
            color: isActive ? "var(--ink)" : "var(--ink-dim)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            position: "relative",
            boxShadow: isActive ? "0 0 0 1px var(--nav-active-inset) inset" : "none",
            transition: "background 120ms, color 120ms",
            textDecoration: "none",
          } as const;

          const inner = (
            <>
              <Icon name={iconName} />
              {isActive && (
                <span
                  style={{
                    position: "absolute",
                    bottom: -6,
                    left: "50%",
                    width: 4,
                    height: 4,
                    borderRadius: 999,
                    background: "var(--accent)",
                    transform: "translateX(-50%)",
                  }}
                />
              )}
              <span
                style={{
                  position: "absolute",
                  bottom: 56,
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "var(--nav-bg)",
                  border: "1px solid var(--nav-border)",
                  color: "var(--ink)",
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  padding: "4px 8px",
                  borderRadius: 6,
                  whiteSpace: "nowrap",
                  pointerEvents: "none",
                  opacity: 0,
                  transition: "opacity 120ms",
                }}
                className="nav-tip"
              >
                {label}
              </span>
            </>
          );

          if (isTheme) {
            return (
              <button
                key={item.id}
                onClick={() => {
                  toggle();
                  onChange?.(item.id);
                }}
                aria-label={label}
                style={sharedStyle}
                className="nav-btn"
              >
                {inner}
              </button>
            );
          }

          return (
            <Link
              key={item.id}
              href={item.href}
              onClick={() => onChange?.(item.id)}
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
              style={sharedStyle}
              className="nav-btn"
            >
              {inner}
            </Link>
          );
        })}
        <ViewSwitcher current="STUDENT" />
      </nav>
      <style>{`
        .nav-btn:hover { background: var(--surface-hover) !important; color: var(--ink) !important; }
        .nav-btn:hover .nav-tip { opacity: 1 !important; }
      `}</style>
    </div>
  );
}

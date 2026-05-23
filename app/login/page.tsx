"use client";

import { useState } from "react";
import Link from "next/link";
import Icon from "../components/Icon";

type Mode = "login" | "register";

export default function LoginPage() {
  const [mode, setMode] = useState<Mode>("login");
  const [showPw, setShowPw] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isRegister = mode === "register";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // backend wired later
    console.log({ mode, name, email, password });
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 24px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <Link
            href="/home"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              textDecoration: "none",
              color: "var(--ink)",
              fontSize: 24,
              fontWeight: 600,
              letterSpacing: "-0.3px",
            }}
          >
            <span style={{ color: "var(--accent)", display: "inline-flex" }}>
              <Icon name="spark" size={22} />
            </span>
            Thadar
          </Link>
        </div>

        <div
          style={{
            border: "1px solid var(--ink-faint)",
            borderRadius: 16,
            background: "var(--surface)",
            padding: "28px 28px 24px",
          }}
        >
          <h1
            style={{
              fontSize: 26,
              fontWeight: 600,
              margin: "0 0 6px",
              letterSpacing: "-0.3px",
            }}
          >
            {isRegister ? "Create your account" : "Welcome back"}
          </h1>
          <p
            style={{
              color: "var(--ink-dim)",
              fontSize: 14,
              margin: "0 0 22px",
            }}
          >
            {isRegister
              ? "Start learning at your own pace."
              : "Sign in to continue your learning."}
          </p>

          <button
            type="button"
            style={{
              width: "100%",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              padding: "11px 14px",
              borderRadius: 10,
              border: "1px solid var(--stroke)",
              background: "var(--surface-2)",
              color: "var(--ink)",
              fontSize: 14,
              fontWeight: 500,
              cursor: "pointer",
              transition: "background 140ms",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-hover)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "var(--surface-2)")}
          >
            <Icon name="google" size={18} />
            Continue with Google
          </button>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              margin: "20px 0 18px",
              color: "var(--ink-faint)",
              fontSize: 12,
              letterSpacing: "0.5px",
            }}
          >
            <span style={{ flex: 1, height: 1, background: "var(--hairline)" }} />
            OR
            <span style={{ flex: 1, height: 1, background: "var(--hairline)" }} />
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {isRegister && (
              <Field
                icon="profile"
                type="text"
                placeholder="Full name"
                value={name}
                onChange={setName}
              />
            )}

            <Field
              icon="mail"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={setEmail}
            />

            <Field
              icon="lock"
              type={showPw ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={setPassword}
              trailing={
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  aria-label={showPw ? "Hide password" : "Show password"}
                  style={{
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--ink-dim)",
                    display: "inline-flex",
                    padding: 2,
                  }}
                >
                  <Icon name={showPw ? "eye-off" : "eye"} size={16} />
                </button>
              }
            />

            {!isRegister && (
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: -4 }}>
                <a
                  href="#"
                  style={{
                    color: "var(--ink-dim)",
                    fontSize: 13,
                    textDecoration: "none",
                  }}
                >
                  Forgot password?
                </a>
              </div>
            )}

            <button
              type="submit"
              style={{
                marginTop: 6,
                width: "100%",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                padding: "12px 16px",
                borderRadius: 10,
                border: "1px solid var(--accent-ring)",
                background: "var(--accent)",
                color: "#1a1814",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                letterSpacing: "0.1px",
              }}
            >
              {isRegister ? "Create account" : "Sign in"}
              <Icon name="arrow-right" size={16} />
            </button>
          </form>
        </div>

        <p
          style={{
            textAlign: "center",
            marginTop: 18,
            color: "var(--ink-dim)",
            fontSize: 14,
          }}
        >
          {isRegister ? "Already have an account?" : "New to Thadar?"}{" "}
          <button
            type="button"
            onClick={() => setMode(isRegister ? "login" : "register")}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--accent)",
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 500,
              padding: 0,
            }}
          >
            {isRegister ? "Sign in" : "Create one"}
          </button>
        </p>

        <p
          style={{
            textAlign: "center",
            marginTop: 24,
            color: "var(--ink-faint)",
            fontSize: 12,
            lineHeight: 1.5,
          }}
        >
          By continuing, you agree to our{" "}
          <a href="#" style={{ color: "var(--ink-dim)" }}>
            Terms
          </a>{" "}
          and{" "}
          <a href="#" style={{ color: "var(--ink-dim)" }}>
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
}

interface FieldProps {
  icon: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  trailing?: React.ReactNode;
}

function Field({ icon, type, placeholder, value, onChange, trailing }: FieldProps) {
  return (
    <label
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        border: "1px solid var(--stroke)",
        borderRadius: 10,
        padding: "10px 12px",
        background: "var(--surface-2)",
      }}
    >
      <span style={{ color: "var(--ink-dim)", display: "inline-flex" }}>
        <Icon name={icon} size={16} />
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required
        style={{
          flex: 1,
          background: "transparent",
          border: "none",
          outline: "none",
          color: "var(--ink)",
          fontSize: 14,
          fontFamily: "inherit",
        }}
      />
      {trailing}
    </label>
  );
}

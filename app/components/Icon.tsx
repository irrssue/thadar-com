"use client";

interface IconProps {
  name: string;
  size?: number;
}

const stroke = {
  fill: "none" as const,
  stroke: "currentColor" as const,
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export default function Icon({ name, size = 20 }: IconProps) {
  const s = size;
  switch (name) {
    case "home":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24">
          <path {...stroke} d="M4 11l8-7 8 7v9a1 1 0 0 1-1 1h-4v-6h-6v6H5a1 1 0 0 1-1-1z" />
        </svg>
      );
    case "classes":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24">
          <path {...stroke} d="M3 6h13a2 2 0 0 1 2 2v12H5a2 2 0 0 1-2-2z M3 6a2 2 0 0 1 2-2h11v2 M8 10h6 M8 14h6" />
        </svg>
      );
    case "profile":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24">
          <circle {...stroke} cx="12" cy="9" r="3.4" />
          <path {...stroke} d="M5 20c1.2-3.2 4-5 7-5s5.8 1.8 7 5" />
        </svg>
      );
    case "inbox":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24">
          <path {...stroke} d="M4 7l8 5 8-5 M4 7v10a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V7l-8-4z" />
        </svg>
      );
    case "moon":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24">
          <path {...stroke} d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" />
        </svg>
      );
    case "send":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24">
          <path {...stroke} d="M4 12l16-8-6 16-3-7z" />
        </svg>
      );
    case "search":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24">
          <circle {...stroke} cx="11" cy="11" r="6" />
          <path {...stroke} d="M20 20l-4.5-4.5" />
        </svg>
      );
    case "plus":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24">
          <path {...stroke} d="M12 5v14 M5 12h14" />
        </svg>
      );
    case "spark":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24">
          <path {...stroke} d="M12 4l1.6 4.4L18 10l-4.4 1.6L12 16l-1.6-4.4L6 10l4.4-1.6z" />
        </svg>
      );
    default:
      return null;
  }
}

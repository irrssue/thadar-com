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
    case "flame":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24">
          <path {...stroke} d="M12 3c1 3 4 4.5 4 8a4 4 0 1 1-8 0c0-1.6.7-2.6 1.5-3.5C10.5 6.5 12 5.5 12 3z" />
        </svg>
      );
    case "trophy":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24">
          <path {...stroke} d="M7 4h10v4a5 5 0 0 1-10 0z M5 5h2v2a2 2 0 0 1-2-2z M17 5h2a2 2 0 0 1-2 2z M9 20h6 M12 13v7" />
        </svg>
      );
    case "trend":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24">
          <path {...stroke} d="M4 17l5-5 4 4 7-8 M15 8h5v5" />
        </svg>
      );
    case "target":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24">
          <circle {...stroke} cx="12" cy="12" r="8" />
          <circle {...stroke} cx="12" cy="12" r="4" />
          <circle {...stroke} cx="12" cy="12" r="1" />
        </svg>
      );
    case "book":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24">
          <path {...stroke} d="M5 4h10a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3z M5 17a3 3 0 0 1 3-3h10" />
        </svg>
      );
    case "check":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24">
          <path {...stroke} d="M4 12l5 5L20 6" />
        </svg>
      );
    case "clock":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24">
          <circle {...stroke} cx="12" cy="12" r="8" />
          <path {...stroke} d="M12 7v5l3 2" />
        </svg>
      );
    default:
      return null;
  }
}

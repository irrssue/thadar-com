"use client";

interface ActivityHeatmapProps {
  weeks?: number;
  data: number[];
}

function shade(v: number) {
  if (v <= 0) return "rgba(255,255,255,0.04)";
  if (v < 25) return "rgba(224,185,122,0.25)";
  if (v < 50) return "rgba(224,185,122,0.45)";
  if (v < 75) return "rgba(224,185,122,0.7)";
  return "var(--accent)";
}

export default function ActivityHeatmap({ weeks = 14, data }: ActivityHeatmapProps) {
  const cells = data.slice(0, weeks * 7);
  while (cells.length < weeks * 7) cells.push(0);

  return (
    <div
      style={{
        border: "1px solid var(--ink-faint)",
        borderRadius: 14,
        background: "rgba(255,255,255,0.012)",
        padding: "20px 22px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: 16,
        }}
      >
        <div>
          <div style={{ fontSize: 18, fontWeight: 600, letterSpacing: "-0.2px" }}>
            Activity
          </div>
          <div
            style={{
              fontSize: 12,
              color: "var(--ink-dim)",
              fontFamily: "var(--font-mono)",
              marginTop: 2,
            }}
          >
            study time per day · last {weeks} weeks
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 11,
            fontFamily: "var(--font-mono)",
            color: "var(--ink-dim)",
          }}
        >
          <span>less</span>
          {[0, 24, 49, 74, 100].map((v) => (
            <span
              key={v}
              style={{
                width: 10,
                height: 10,
                borderRadius: 2,
                background: shade(v),
                border: "1px solid rgba(255,255,255,0.04)",
              }}
            />
          ))}
          <span>more</span>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${weeks}, 1fr)`,
          gridAutoFlow: "column",
          gridTemplateRows: "repeat(7, 1fr)",
          gap: 4,
        }}
      >
        {cells.map((v, i) => (
          <div
            key={i}
            title={`${v} min`}
            style={{
              aspectRatio: "1 / 1",
              borderRadius: 3,
              background: shade(v),
              border: "1px solid rgba(255,255,255,0.04)",
            }}
          />
        ))}
      </div>
    </div>
  );
}

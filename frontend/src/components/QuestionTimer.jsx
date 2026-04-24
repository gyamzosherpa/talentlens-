import { Clock } from "lucide-react";

/**
 * Circular timer display for each question.
 * Shows MM:SS countdown with colour shifts at warning/danger thresholds.
 */
export default function QuestionTimer({
  formattedTime,
  timeLeft,
  timeLimitSeconds,
  isWarning,
  isDanger,
}) {
  const pct = timeLimitSeconds > 0 ? timeLeft / timeLimitSeconds : 1;
  const circ = 2 * Math.PI * 26; // r=26
  const color = isDanger
    ? "var(--red)"
    : isWarning
      ? "var(--gold)"
      : "var(--accent)";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        background: isDanger
          ? "rgba(248,113,113,0.1)"
          : isWarning
            ? "rgba(251,191,36,0.1)"
            : "var(--navy-3)",
        border: `1px solid ${
          isDanger
            ? "rgba(248,113,113,0.3)"
            : isWarning
              ? "rgba(251,191,36,0.3)"
              : "var(--border)"
        }`,
        borderRadius: 10,
        padding: "6px 12px",
        transition: "all .5s",
      }}
    >
      {/* SVG ring */}
      <svg width={36} height={36} viewBox="0 0 60 60" style={{ flexShrink: 0 }}>
        {/* Track */}
        <circle
          cx={30}
          cy={30}
          r={26}
          fill="none"
          stroke="rgba(255,255,255,.08)"
          strokeWidth={5}
        />
        {/* Progress */}
        <circle
          cx={30}
          cy={30}
          r={26}
          fill="none"
          stroke={color}
          strokeWidth={5}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - pct)}
          transform="rotate(-90 30 30)"
          style={{ transition: "stroke-dashoffset .9s linear, stroke .5s" }}
        />
      </svg>

      <div>
        <div
          style={{
            fontFamily: "Syne,sans-serif",
            fontWeight: 800,
            fontSize: 16,
            color,
            lineHeight: 1,
            letterSpacing: ".02em",
          }}
        >
          {formattedTime}
        </div>
        <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 1 }}>
          {isDanger
            ? "⚠ Time running out!"
            : isWarning
              ? "Wrap up soon"
              : "Time remaining"}
        </div>
      </div>

      {isDanger && (
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "var(--red)",
            animation: "pulse-ring 1s infinite",
            marginLeft: 2,
          }}
        />
      )}
    </div>
  );
}

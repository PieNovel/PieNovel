import { useTheme, THEME_STYLES } from "../context/ThemeContext";

interface AdSlotProps {
  type?: "leaderboard" | "banner" | "square";
  label?: string;
  className?: string;
}

export function AdSlot({ type = "leaderboard", label, className = "" }: AdSlotProps) {
  const { theme } = useTheme();
  const ts = THEME_STYLES[theme];
  const isLight = theme === "light";
  const isDark = theme === "dark";

  const heights: Record<string, string> = {
    leaderboard: "90px",
    banner: "60px",
    square: "250px",
  };

  return (
    <div
      className={`w-full flex items-center justify-center rounded-xl overflow-hidden relative ${className}`}
      style={{
        minHeight: heights[type],
        background: isDark
          ? "rgba(16,185,129,0.02)"
          : isLight
          ? "rgba(0,0,0,0.02)"
          : "rgba(255,255,255,0.02)",
        border: `1px dashed ${isDark ? "rgba(16,185,129,0.15)" : isLight ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.08)"}`,
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `radial-gradient(circle, ${isDark ? "rgba(16,185,129,0.05)" : isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.03)"} 1px, transparent 1px)`,
          backgroundSize: "20px 20px",
          pointerEvents: "none",
        }}
      />
      <div className="relative flex flex-col items-center gap-1 py-3">
        <span
          style={{
            fontSize: "0.58rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            fontFamily: "'Inter', sans-serif",
            color: isDark ? "#10b981" : ts.muted,
            opacity: 0.45,
          }}
        >
          Advertisement
        </span>
        {label && (
          <span
            style={{
              fontSize: "0.65rem",
              fontFamily: "'Inter', sans-serif",
              color: ts.muted,
              opacity: 0.35,
            }}
          >
            {label}
          </span>
        )}
      </div>
    </div>
  );
}

import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router";
import { useTheme, THEME_STYLES } from "../context/ThemeContext";
import { useState } from "react";

export function SectionHeader({
  icon, label, title, action, onAction,
}: {
  icon: React.ReactNode; label: string; title: string; action?: string; onAction?: () => void;
}) {
  const { theme } = useTheme();
  const ts = THEME_STYLES[theme];
  const isDark = theme !== "light";

  return (
    <div className="flex items-end justify-between mb-6">
      <div className="flex items-start gap-3">
        {/* Emerald accent bar */}
        {isDark && (
          <div
            className="flex-shrink-0 mt-1"
            style={{
              width: "3px",
              height: "36px",
              borderRadius: "2px",
              background: "linear-gradient(180deg, #10b981, rgba(16,185,129,0.2))",
              boxShadow: "0 0 8px rgba(16,185,129,0.4)",
            }}
          />
        )}
        <div>
          <div
            className="flex items-center gap-1.5 mb-1.5"
            style={{
              fontSize: "0.65rem",
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              fontFamily: "'Inter', sans-serif",
              color: ts.sectionLabel,
              textShadow: isDark ? "0 0 12px rgba(16,185,129,0.4)" : "none",
            }}
          >
            {icon}{label}
          </div>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 800,
              fontSize: "1.45rem",
              color: ts.sectionTitle,
              letterSpacing: "-0.01em",
            }}
          >
            {title}
          </h2>
        </div>
      </div>
      {action && (
        <button
          onClick={onAction}
          className="flex items-center gap-1 transition-all"
          style={{
            fontSize: "0.75rem",
            fontFamily: "'Inter', sans-serif",
            color: ts.subtext,
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "#10b981"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = ts.subtext; }}
        >
          {action}<ChevronRight className="size-3.5" />
        </button>
      )}
    </div>
  );
}

export function PageHero({ title, subtitle }: { title: string; subtitle: string }) {
  const { theme } = useTheme();
  const ts = THEME_STYLES[theme];
  const isDark = theme !== "light";
  return (
    <div className="mb-8 flex items-start gap-3">
      {isDark && (
        <div
          className="flex-shrink-0 mt-1"
          style={{
            width: "3px",
            height: "40px",
            borderRadius: "2px",
            background: "linear-gradient(180deg, #10b981, rgba(16,185,129,0.2))",
            boxShadow: "0 0 10px rgba(16,185,129,0.4)",
          }}
        />
      )}
      <div>
        <h1
          style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 800,
            fontSize: "clamp(1.6rem,3vw,2.2rem)",
            color: ts.sectionTitle,
            marginBottom: "6px",
            letterSpacing: "-0.02em",
          }}
        >
          {title}
        </h1>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.88rem", color: ts.muted }}>{subtitle}</p>
      </div>
    </div>
  );
}

export function GenrePill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  const { theme } = useTheme();
  const ts = THEME_STYLES[theme];
  const isDark = theme !== "light";
  return (
    <button
      onClick={onClick}
      className="rounded-full px-4 py-1.5 border transition-all"
      style={{
        fontSize: "0.75rem",
        fontWeight: active ? 600 : 400,
        fontFamily: "'Inter', sans-serif",
        borderColor: active
          ? isDark ? "rgba(16,185,129,0.5)" : ts.sectionLabel
          : ts.pillInactive,
        color: active ? (isDark ? "#34d399" : ts.sectionLabel) : ts.subtext,
        background: active
          ? isDark ? "rgba(16,185,129,0.1)" : "rgba(5,150,105,0.08)"
          : "transparent",
        boxShadow: active && isDark ? "0 0 12px rgba(16,185,129,0.15)" : "none",
        transition: "all 0.2s",
      }}
    >
      {label}
    </button>
  );
}

export function NovelGridCard({ novel }: { novel: import("../data/novels").Novel }) {
  const { theme } = useTheme();
  const ts = THEME_STYLES[theme];
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  const isDark = theme !== "light";

  return (
    <div
      className="group cursor-pointer"
      style={{ fontFamily: "'Inter', sans-serif" }}
      onClick={() => navigate(`/novel/${novel.id}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="relative rounded-xl overflow-hidden mb-2.5 transition-all duration-300"
        style={{
          aspectRatio: "2/3",
          boxShadow: hovered && isDark
            ? "0 0 0 2px rgba(16,185,129,0.4), 0 12px 40px rgba(0,0,0,0.6), 0 0 24px rgba(16,185,129,0.1)"
            : "0 4px 16px rgba(0,0,0,0.4)",
        }}
      >
        <img
          src={novel.coverUrl}
          alt={novel.title}
          className="w-full h-full object-cover transition-transform duration-400"
          style={{ transform: hovered ? "scale(1.07)" : "scale(1)", transition: "transform 0.4s ease" }}
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to top,rgba(0,0,0,0.85) 0%,transparent 55%)" }}
        />
        {/* Synopsis overlay on hover */}
        <div
          className="absolute inset-0 flex flex-col justify-end p-2.5 transition-opacity duration-200"
          style={{
            background: "linear-gradient(to top,rgba(0,0,0,0.95) 0%,rgba(0,0,0,0.5) 60%,rgba(16,185,129,0.05) 100%)",
            opacity: hovered ? 1 : 0,
          }}
        >
          <p className="text-white line-clamp-4 mb-1" style={{ fontSize: "0.68rem", lineHeight: 1.45 }}>{novel.description}</p>
        </div>
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
          <span
            className="rounded-md px-1.5 py-0.5 text-white"
            style={{
              fontSize: "0.6rem",
              fontWeight: 700,
              background: "rgba(16,185,129,0.85)",
              boxShadow: "0 0 8px rgba(16,185,129,0.3)",
            }}
          >
            {novel.genre}
          </span>
          <span
            className="text-white"
            style={{ fontSize: "0.65rem", background: "rgba(0,0,0,0.6)", padding: "2px 6px", borderRadius: "6px" }}
          >
            ⭐ {novel.rating}
          </span>
        </div>
        {novel.status === "completed" && (
          <div
            className="absolute top-2 right-2 rounded px-1.5 py-0.5 text-white"
            style={{ fontSize: "0.55rem", fontWeight: 700, background: "rgba(99,102,241,0.9)", letterSpacing: "0.05em", textTransform: "uppercase" }}
          >
            DONE
          </div>
        )}
        {/* Emerald corner glow on hover */}
        {isDark && (
          <div
            className="absolute top-0 right-0 w-12 h-12 transition-opacity duration-300"
            style={{
              background: "radial-gradient(circle at top right, rgba(16,185,129,0.2), transparent 70%)",
              opacity: hovered ? 1 : 0,
            }}
          />
        )}
      </div>
      <p
        className="truncate transition-colors duration-200"
        style={{
          fontSize: "0.85rem",
          fontWeight: 600,
          color: hovered && isDark ? "#34d399" : ts.text,
          marginBottom: "2px",
        }}
      >
        {novel.title}
      </p>
      <p className="truncate" style={{ fontSize: "0.72rem", color: ts.subtext }}>{novel.author} · {novel.chapters} ch</p>
    </div>
  );
}

export function NovelListCard({ novel }: { novel: import("../data/novels").Novel }) {
  const { theme } = useTheme();
  const ts = THEME_STYLES[theme];
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  const isDark = theme !== "light";

  const statusColor = novel.status === "completed" ? "#6366f1" : novel.status === "hiatus" ? "#f59e0b" : "#10b981";
  const statusLabel = novel.status === "completed" ? "Completed" : novel.status === "hiatus" ? "Hiatus" : "Ongoing";

  return (
    <div
      className="flex gap-4 p-4 rounded-xl border transition-all cursor-pointer group"
      style={{
        background: hovered && isDark ? "rgba(16,185,129,0.03)" : ts.cardBg,
        borderColor: hovered ? (isDark ? "rgba(16,185,129,0.3)" : "rgba(5,150,105,0.3)") : ts.border,
        boxShadow: hovered && isDark
          ? "0 0 0 1px rgba(16,185,129,0.1), 0 8px 32px rgba(0,0,0,0.4), 0 0 20px rgba(16,185,129,0.05)"
          : "none",
        transition: "all 0.25s ease",
      }}
      onClick={() => navigate(`/novel/${novel.id}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="flex-shrink-0 rounded-xl overflow-hidden transition-all duration-300"
        style={{
          width: "64px",
          height: "90px",
          boxShadow: hovered && isDark ? "0 0 16px rgba(16,185,129,0.2)" : "0 4px 12px rgba(0,0,0,0.4)",
        }}
      >
        <img
          src={novel.coverUrl}
          alt={novel.title}
          className="w-full h-full object-cover transition-transform duration-300"
          style={{ transform: hovered ? "scale(1.06)" : "scale(1)" }}
        />
      </div>
      <div className="flex-1 min-w-0" style={{ fontFamily: "'Inter', sans-serif" }}>
        <div className="flex items-start justify-between gap-2 mb-1">
          <p
            className="truncate transition-colors duration-200"
            style={{
              fontSize: "0.9rem",
              fontWeight: 700,
              color: hovered && isDark ? "#34d399" : ts.text,
            }}
          >
            {novel.title}
          </p>
          <span
            className="flex-shrink-0 text-xs px-2 py-0.5 rounded-full"
            style={{ fontSize: "0.65rem", fontWeight: 600, color: statusColor, background: `${statusColor}18` }}
          >
            {statusLabel}
          </span>
        </div>
        <p style={{ fontSize: "0.75rem", color: ts.subtext, marginBottom: "6px" }}>{novel.author}</p>
        <p className="line-clamp-2" style={{ fontSize: "0.78rem", color: ts.muted, lineHeight: 1.5, marginBottom: "8px" }}>{novel.description}</p>
        <div className="flex flex-wrap gap-1.5">
          {novel.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded px-2 py-0.5 transition-all duration-200"
              style={{
                fontSize: "0.65rem",
                color: hovered && isDark ? "#10b981" : ts.subtext,
                background: hovered && isDark ? "rgba(16,185,129,0.1)" : ts.pillInactive,
                border: `1px solid ${hovered && isDark ? "rgba(16,185,129,0.2)" : "transparent"}`,
              }}
            >
              {tag}
            </span>
          ))}
          <span style={{ fontSize: "0.72rem", color: ts.subtext, marginLeft: "auto" }}>
            ⭐ {novel.rating} · {novel.views} views
          </span>
        </div>
      </div>
    </div>
  );
}

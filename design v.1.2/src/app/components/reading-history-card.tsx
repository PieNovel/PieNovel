import { Clock, PlayCircle } from "lucide-react";
import { useNavigate } from "react-router";
import { useState } from "react";

interface ReadingHistoryCardProps {
  id: number;
  title: string;
  chapter: string;
  progress: number;
  timeAgo: string;
  coverUrl: string;
}

export function ReadingHistoryCard({ id, title, chapter, progress, timeAgo, coverUrl }: ReadingHistoryCardProps) {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="group relative overflow-hidden rounded-xl border cursor-pointer transition-all duration-300"
      style={{
        borderColor: hovered ? "rgba(16,185,129,0.35)" : "rgba(255,255,255,0.06)",
        fontFamily: "'Inter', sans-serif",
        boxShadow: hovered
          ? "0 0 0 1px rgba(16,185,129,0.15), 0 12px 40px rgba(0,0,0,0.5), 0 0 30px rgba(16,185,129,0.06)"
          : "0 4px 20px rgba(0,0,0,0.4)",
        transition: "all 0.25s ease",
      }}
      onClick={() => navigate(`/novel/${id}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Background cover art — blurred */}
      <div className="absolute inset-0">
        <img
          src={coverUrl}
          alt=""
          className="w-full h-full object-cover transition-transform duration-700"
          style={{
            filter: "blur(28px) brightness(0.2) saturate(0.7)",
            transform: hovered ? "scale(1.08)" : "scale(1.04)",
          }}
        />
      </div>
      <div
        className="absolute inset-0"
        style={{
          background: hovered
            ? "linear-gradient(135deg, rgba(4,8,12,0.7), rgba(16,185,129,0.04))"
            : "rgba(4,8,12,0.65)",
          transition: "background 0.3s",
        }}
      />

      {/* Content */}
      <div className="relative flex items-center gap-4 p-4">
        {/* Cover thumbnail */}
        <div className="relative flex-shrink-0">
          <div
            className="rounded-lg overflow-hidden transition-all duration-300"
            style={{
              width: "60px",
              height: "84px",
              boxShadow: hovered
                ? "0 0 20px rgba(16,185,129,0.3), 0 0 0 2px rgba(16,185,129,0.3), 0 8px 24px rgba(0,0,0,0.7)"
                : "0 8px 24px rgba(0,0,0,0.6)",
            }}
          >
            <img src={coverUrl} alt={title} className="w-full h-full object-cover" />
          </div>
          {/* Progress ring indicator */}
          <div
            className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
            style={{
              background: "#07090D",
              border: "1.5px solid rgba(16,185,129,0.5)",
              fontSize: "0.5rem",
              fontWeight: 800,
              color: "#10b981",
              boxShadow: "0 0 6px rgba(16,185,129,0.3)",
            }}
          >
            {Math.round(progress / 10)}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h4
            className="line-clamp-1 mb-0.5 transition-colors duration-200"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 600,
              fontSize: "0.95rem",
              color: hovered ? "#34d399" : "#f1f5f9",
              textShadow: hovered ? "0 0 16px rgba(52,211,153,0.3)" : "none",
            }}
          >
            {title}
          </h4>
          <p className="text-xs line-clamp-1 mb-3" style={{ color: "#64748b" }}>{chapter}</p>

          {/* Progress bar with glow */}
          <div className="mb-2">
            <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${progress}%`,
                  background: "linear-gradient(90deg, #059669, #10b981, #34d399)",
                  boxShadow: hovered ? "0 0 8px rgba(16,185,129,0.7)" : "0 0 4px rgba(16,185,129,0.4)",
                }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1" style={{ color: "#475569" }}>
              <Clock className="size-3" />
              <span style={{ fontSize: "0.7rem" }}>{timeAgo}</span>
            </div>
            <span
              style={{
                fontSize: "0.7rem",
                fontWeight: 700,
                color: "#10b981",
                textShadow: hovered ? "0 0 10px rgba(16,185,129,0.5)" : "none",
                transition: "text-shadow 0.2s",
              }}
            >
              {progress}% done
            </span>
          </div>
        </div>

        {/* Play button */}
        <button
          className="flex-shrink-0 rounded-full transition-all"
          style={{
            color: hovered ? "#34d399" : "#10b981",
            filter: hovered ? "drop-shadow(0 0 8px rgba(16,185,129,0.6))" : "none",
            transform: hovered ? "scale(1.1)" : "scale(1)",
            transition: "all 0.2s",
          }}
          onClick={(e) => { e.stopPropagation(); navigate(`/read/${id}/1`); }}
        >
          <PlayCircle className="size-9" strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}

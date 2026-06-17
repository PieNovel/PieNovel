import { Bookmark, Clock, BookOpen } from "lucide-react";
import { useNavigate } from "react-router";
import { useState } from "react";

interface NovelCardProps {
  id?: number;
  title: string;
  author: string;
  genre: string;
  rating: number;
  chapters: number;
  coverUrl: string;
  latestChapter?: string;
}

export function NovelCard({ id, title, author, genre, rating, chapters, coverUrl, latestChapter }: NovelCardProps) {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={() => id != null && navigate(`/novel/${id}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group flex gap-4 p-4 rounded-xl border transition-all duration-300 cursor-pointer"
      style={{
        background: hovered
          ? "rgba(16,185,129,0.04)"
          : "rgba(10,14,20,0.8)",
        borderColor: hovered
          ? "rgba(16,185,129,0.3)"
          : "rgba(255,255,255,0.05)",
        boxShadow: hovered
          ? "0 0 0 1px rgba(16,185,129,0.15), 0 8px 32px rgba(0,0,0,0.4), 0 0 40px rgba(16,185,129,0.06)"
          : "0 2px 12px rgba(0,0,0,0.3)",
        fontFamily: "'Inter', sans-serif",
        transition: "all 0.25s ease",
      }}
    >
      {/* Cover */}
      <div className="relative flex-shrink-0">
        <div
          className="relative overflow-hidden rounded-lg transition-all duration-300"
          style={{
            width: "72px",
            height: "100px",
            boxShadow: hovered
              ? "0 0 20px rgba(16,185,129,0.25), 0 8px 24px rgba(0,0,0,0.6)"
              : "0 4px 16px rgba(0,0,0,0.5)",
          }}
        >
          <img
            src={coverUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {/* Emerald shine overlay on hover */}
          <div
            className="absolute inset-0 transition-opacity duration-300"
            style={{
              background: "linear-gradient(135deg, rgba(16,185,129,0.15) 0%, transparent 60%)",
              opacity: hovered ? 1 : 0,
            }}
          />
        </div>
        <button
          className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full border flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
          style={{
            background: "#07090D",
            borderColor: "rgba(16,185,129,0.4)",
            boxShadow: "0 0 8px rgba(16,185,129,0.2)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <Bookmark className="size-3" style={{ color: "#10b981" }} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3
            className="line-clamp-1 transition-colors duration-200"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 600,
              fontSize: "0.95rem",
              color: hovered ? "#34d399" : "#f1f5f9",
              textShadow: hovered ? "0 0 20px rgba(52,211,153,0.4)" : "none",
            }}
          >
            {title}
          </h3>
          <div className="flex items-center gap-1 flex-shrink-0">
            <span style={{ color: "#f59e0b", fontSize: "0.7rem" }}>★</span>
            <span className="text-xs" style={{ color: "#cbd5e1" }}>{rating.toFixed(1)}</span>
          </div>
        </div>

        <p className="text-xs mb-2" style={{ color: "#64748b" }}>by {author}</p>

        <div className="flex items-center gap-2 mb-3">
          <span
            style={{
              fontSize: "0.6rem",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#10b981",
              border: "1px solid rgba(16,185,129,0.25)",
              borderRadius: "4px",
              padding: "2px 6px",
              background: "rgba(16,185,129,0.08)",
            }}
          >
            {genre}
          </span>
          <span className="flex items-center gap-1 text-xs" style={{ color: "#475569" }}>
            <BookOpen className="size-3" />
            {chapters} ch
          </span>
        </div>

        {latestChapter && (
          <div className="flex items-center gap-1.5 mb-3">
            <Clock className="size-3" style={{ color: "#475569" }} />
            <span className="text-xs line-clamp-1" style={{ color: "#475569" }}>{latestChapter}</span>
          </div>
        )}

        <button
          onClick={(e) => { e.stopPropagation(); id != null && navigate(`/novel/${id}`); }}
          className="rounded-lg px-4 py-1.5 text-white transition-all"
          style={{
            background: hovered
              ? "linear-gradient(135deg, #059669, #10b981)"
              : "rgba(16,185,129,0.15)",
            fontSize: "0.7rem",
            fontWeight: 700,
            letterSpacing: "0.05em",
            border: "1px solid rgba(16,185,129,0.3)",
            boxShadow: hovered ? "0 0 16px rgba(16,185,129,0.35)" : "none",
            color: hovered ? "#fff" : "#10b981",
            transition: "all 0.2s",
          }}
        >
          Read Now
        </button>
      </div>
    </div>
  );
}

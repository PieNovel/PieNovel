import { useNavigate } from "react-router";
import { useState } from "react";

interface TrendingCompactCardProps {
  id?: number;
  rank: number;
  title: string;
  rating: number;
  coverUrl: string;
  genre?: string;
}

export function TrendingCompactCard({ id, rank, title, rating, coverUrl, genre }: TrendingCompactCardProps) {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);

  const isTop = rank === 1;
  const rankColor = rank === 1 ? "#fbbf24" : rank === 2 ? "#94a3b8" : rank === 3 ? "#c4793a" : "#10b981";

  return (
    <div
      onClick={() => id != null && navigate(`/novel/${id}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative cursor-pointer"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <div
        className="relative overflow-hidden rounded-xl aspect-[2/3] transition-all duration-300"
        style={{
          boxShadow: hovered
            ? `0 0 0 2px ${isTop ? "rgba(251,191,36,0.5)" : "rgba(16,185,129,0.4)"}, 0 12px 40px rgba(0,0,0,0.6), 0 0 30px ${isTop ? "rgba(251,191,36,0.1)" : "rgba(16,185,129,0.1)"}`
            : "0 4px 16px rgba(0,0,0,0.5)",
        }}
      >
        <img
          src={coverUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
          style={{ transform: hovered ? "scale(1.07)" : "scale(1)", transition: "transform 0.5s ease" }}
        />

        {/* Base gradient */}
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to top, rgba(4,8,12,0.97) 0%, rgba(4,8,12,0.5) 45%, rgba(0,0,0,0.1) 100%)" }}
        />

        {/* Hover emerald tint */}
        <div
          className="absolute inset-0 transition-opacity duration-300"
          style={{
            background: isTop
              ? "linear-gradient(to bottom, rgba(251,191,36,0.08) 0%, transparent 40%)"
              : "linear-gradient(to bottom, rgba(16,185,129,0.08) 0%, transparent 40%)",
            opacity: hovered ? 1 : 0,
          }}
        />

        {/* Rank number — watermark */}
        <div
          className="absolute top-2 left-1.5 select-none leading-none transition-all duration-300"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(2.5rem, 5vw, 3.5rem)",
            fontWeight: 900,
            color: hovered ? `${rankColor}22` : "rgba(255,255,255,0.08)",
            lineHeight: 1,
            transition: "color 0.3s",
          }}
        >
          {rank.toString().padStart(2, "0")}
        </div>

        {/* Rank badge */}
        <div
          className="absolute top-2.5 right-2.5 w-5 h-5 rounded-md flex items-center justify-center text-white transition-all duration-300"
          style={{
            background: rank <= 3 ? rankColor : "rgba(16,185,129,0.9)",
            fontSize: "0.6rem",
            fontWeight: 800,
            boxShadow: rank <= 3
              ? `0 0 8px ${rankColor}80`
              : "0 0 8px rgba(16,185,129,0.5)",
          }}
        >
          {rank}
        </div>

        {/* Bottom content */}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          {genre && (
            <div
              className="inline-block mb-1.5"
              style={{
                fontSize: "0.6rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#10b981",
                textShadow: "0 0 10px rgba(16,185,129,0.5)",
              }}
            >
              {genre}
            </div>
          )}
          <h4
            className="text-white line-clamp-2 mb-2"
            style={{
              fontSize: "0.8rem",
              fontWeight: 600,
              lineHeight: 1.35,
              textShadow: "0 1px 8px rgba(0,0,0,0.8)",
            }}
          >
            {title}
          </h4>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span style={{ color: "#fbbf24", fontSize: "0.7rem" }}>★</span>
              <span className="text-slate-300" style={{ fontSize: "0.7rem" }}>
                {rating.toFixed(1)}
              </span>
            </div>
            <button
              className="text-white rounded-md px-2 py-0.5 transition-all"
              style={{
                fontSize: "0.6rem",
                fontWeight: 700,
                background: "rgba(16,185,129,0.9)",
                letterSpacing: "0.05em",
                opacity: hovered ? 1 : 0,
                transform: hovered ? "translateY(0)" : "translateY(4px)",
                transition: "all 0.2s",
                boxShadow: "0 0 10px rgba(16,185,129,0.5)",
              }}
            >
              READ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useState } from "react";
import type { ReactElement } from "react";

import type { SiteNovel } from "@/lib/site/mock-novels";
import { useTheme, THEME_STYLES } from "@/lib/site/theme-context";

type NovelCardProps = {
  locale: string;
  novel: SiteNovel;
  compact?: boolean;
  rank?: number;
};

export function NovelCard({
  locale,
  novel,
  compact = false,
  rank,
}: NovelCardProps): ReactElement {
  const { theme } = useTheme();
  const ts = THEME_STYLES[theme];
  const [hovered, setHovered] = useState(false);
  const isDark = theme !== "light";

  if (rank != null || compact) {
    const isTop = rank === 1;
    const rankColor = rank === 1 ? "#fbbf24" : rank === 2 ? "#94a3b8" : rank === 3 ? "#c4793a" : "#10b981";

    return (
      <Link
        href={`/${locale}/novels/${novel.slug}`}
        className="group relative"
        style={{ fontFamily: "'Inter', sans-serif" }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
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
            src={novel.coverUrl}
            alt={novel.title}
            className="w-full h-full object-cover transition-transform duration-500"
            style={{ transform: hovered ? "scale(1.07)" : "scale(1)", transition: "transform 0.5s ease" }}
          />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to top, rgba(4,8,12,0.97) 0%, rgba(4,8,12,0.5) 45%, rgba(0,0,0,0.1) 100%)" }}
          />
          {rank != null && (
            <>
              <div
                className="absolute top-2 left-1.5 select-none leading-none transition-all duration-300"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(2.5rem, 5vw, 3.5rem)",
                  fontWeight: 900,
                  color: hovered ? `${rankColor}22` : "rgba(255,255,255,0.08)",
                  lineHeight: 1,
                }}
              >
                {rank.toString().padStart(2, "0")}
              </div>
              <div
                className="absolute top-2.5 right-2.5 w-5 h-5 rounded-md flex items-center justify-center text-white transition-all duration-300"
                style={{
                  background: rank <= 3 ? rankColor : "rgba(16,185,129,0.9)",
                  fontSize: "0.6rem",
                  fontWeight: 800,
                  boxShadow: rank <= 3 ? `0 0 8px ${rankColor}80` : "0 0 8px rgba(16,185,129,0.5)",
                }}
              >
                {rank}
              </div>
            </>
          )}
          <div className="absolute bottom-0 left-0 right-0 p-3">
            {novel.genre && (
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
                {novel.genre}
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
              {novel.title}
            </h4>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <span style={{ color: "#fbbf24", fontSize: "0.7rem" }}>★</span>
                <span className="text-slate-300" style={{ fontSize: "0.7rem" }}>
                  {novel.rating.toFixed(1)}
                </span>
              </div>
              <span
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
              </span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  const statusColor = novel.status === "COMPLETED" ? "#6366f1" : novel.status === "HIATUS" ? "#f59e0b" : "#10b981";
  const statusLabel = novel.status === "COMPLETED" ? "Completed" : novel.status === "HIATUS" ? "Hiatus" : "Ongoing";

  return (
    <Link
      href={`/${locale}/novels/${novel.slug}`}
      className="flex gap-4 p-4 rounded-xl border transition-all cursor-pointer group"
      style={{
        background: hovered && isDark ? "rgba(16,185,129,0.03)" : ts.cardBg,
        borderColor: hovered ? (isDark ? "rgba(16,185,129,0.3)" : "rgba(5,150,105,0.3)") : ts.border,
        boxShadow: hovered && isDark
          ? "0 0 0 1px rgba(16,185,129,0.1), 0 8px 32px rgba(0,0,0,0.4), 0 0 20px rgba(16,185,129,0.05)"
          : "none",
        transition: "all 0.25s ease",
      }}
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
    </Link>
  );
}

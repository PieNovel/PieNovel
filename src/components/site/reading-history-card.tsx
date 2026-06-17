"use client";

import { Clock, PlayCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { ReactElement } from "react";

type ReadingHistoryCardProps = {
  locale: string;
  novelSlug: string;
  title: string;
  chapter: string;
  progress: number;
  timeAgo: string;
  coverUrl: string;
};

export function ReadingHistoryCard({
  locale,
  novelSlug,
  title,
  chapter,
  progress,
  timeAgo,
  coverUrl,
}: ReadingHistoryCardProps): ReactElement {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={`/${locale}/novels/${novelSlug}`}
      className="group relative overflow-hidden rounded-xl border transition-all duration-300"
      style={{
        borderColor: hovered ? "color-mix(in_srgb, var(--primary) 35%, transparent)" : "color-mix(in_srgb, var(--foreground) 6%, transparent)",
        boxShadow: hovered
          ? "0 0 0 1px color-mix(in_srgb, var(--primary) 15%, transparent), 0 12px 40px rgba(0,0,0,0.5), 0 0 30px color-mix(in_srgb, var(--primary) 6%, transparent)"
          : "0 4px 20px rgba(0,0,0,0.4)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="absolute inset-0">
        <img
          alt=""
          src={coverUrl}
          className="h-full w-full object-cover transition-transform duration-700"
          style={{
            filter: "blur(28px) brightness(0.2) saturate(0.7)",
            transform: hovered ? "scale(1.08)" : "scale(1.04)",
          }}
        />
      </div>
      <div
        className="absolute inset-0 transition-colors duration-300"
        style={{
          background: hovered
            ? "linear-gradient(135deg, rgba(4,8,12,0.7), color-mix(in_srgb, var(--primary) 4%, transparent))"
            : "rgba(4,8,12,0.65)",
        }}
      />

      <div className="relative flex items-center gap-4 p-4">
        <div className="relative shrink-0">
          <div
            className="overflow-hidden rounded-lg transition-all duration-300"
            style={{
              width: "60px",
              height: "84px",
              boxShadow: hovered
                ? "0 0 20px color-mix(in_srgb, var(--primary) 30%, transparent), 0 0 0 2px color-mix(in_srgb, var(--primary) 30%, transparent), 0 8px 24px rgba(0,0,0,0.7)"
                : "0 8px 24px rgba(0,0,0,0.6)",
            }}
          >
            <img src={coverUrl} alt={title} className="h-full w-full object-cover" />
          </div>
          <div
            className="absolute -bottom-1 -right-1 flex size-5 items-center justify-center rounded-full border-2 text-[0.5rem] font-extrabold"
            style={{
              background: "var(--background)",
              borderColor: "color-mix(in_srgb, var(--primary) 50%, transparent)",
              color: "var(--primary)",
              boxShadow: "0 0 6px color-mix(in_srgb, var(--primary) 30%, transparent)",
            }}
          >
            {Math.round(progress / 10)}
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <h4
            className="mb-0.5 line-clamp-1 font-serif font-semibold transition-colors duration-200"
            style={{
              fontSize: "0.95rem",
              color: hovered ? "var(--primary)" : "var(--foreground)",
              textShadow: hovered ? "0 0 16px color-mix(in_srgb, var(--primary) 30%, transparent)" : "none",
            }}
          >
            {title}
          </h4>
          <p className="mb-3 line-clamp-1 text-xs" style={{ color: "var(--muted-foreground)" }}>{chapter}</p>

          <div className="mb-2">
            <div className="h-1 overflow-hidden rounded-full" style={{ background: "color-mix(in_srgb, var(--foreground) 7%, transparent)" }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${progress}%`,
                  background: "linear-gradient(90deg, var(--primary), color-mix(in_srgb, var(--primary) 70%, white))",
                  boxShadow: hovered ? "0 0 8px color-mix(in_srgb, var(--primary) 70%, transparent)" : "0 0 4px color-mix(in_srgb, var(--primary) 40%, transparent)",
                }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-xs" style={{ color: "var(--muted-foreground)" }}>
              <Clock className="size-3" />
              <span style={{ fontSize: "0.7rem" }}>{timeAgo}</span>
            </div>
            <span
              className="text-[0.7rem] font-bold transition-all"
              style={{
                color: "var(--primary)",
                textShadow: hovered ? "0 0 10px color-mix(in_srgb, var(--primary) 50%, transparent)" : "none",
              }}
            >
              {progress}% done
            </span>
          </div>
        </div>

        <div
          className="shrink-0 transition-all"
          style={{
            color: hovered ? "color-mix(in_srgb, var(--primary) 80%, white)" : "var(--primary)",
            filter: hovered ? "drop-shadow(0 0 8px color-mix(in_srgb, var(--primary) 60%, transparent))" : "none",
            transform: hovered ? "scale(1.1)" : "scale(1)",
          }}
        >
          <PlayCircle className="size-9" strokeWidth={1.5} />
        </div>
      </div>
    </Link>
  );
}

"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { ReactElement } from "react";

import { AdSlot } from "@/components/site/ad-slot";
import { GENRES, GENRE_META, catalogNovels } from "@/lib/site/mock-novels";

type GenresPageProps = {
  locale: string;
};

export function GenresPage({ locale }: GenresPageProps): ReactElement {
  const [hoveredGenre, setHoveredGenre] = useState<string | null>(null);

  const displayGenres = GENRES.filter((g) => g !== "All");
  const allGenreKeys = [
    ...displayGenres,
    ...Object.keys(GENRE_META).filter((k) => !displayGenres.includes(k)),
  ];

  const mid = Math.ceil(allGenreKeys.length / 2);

  function renderRow(genre: string, isLastOverall: boolean) {
    const data = GENRE_META[genre];
    const count = catalogNovels.filter(
      (n) => n.genre === genre || n.tags.includes(genre),
    ).length;
    const isHovered = hoveredGenre === genre;

    return (
      <Link
        key={genre}
        href={`/${locale}/browse?genre=${encodeURIComponent(genre)}`}
        className="flex items-start justify-between gap-3 px-4 py-3.5 transition-colors"
        style={{
          borderBottom: isLastOverall ? "none" : "1px solid color-mix(in_srgb, var(--foreground) 8%, transparent)",
          background: isHovered ? "color-mix(in_srgb, var(--foreground) 3%, transparent)" : "transparent",
        }}
        onMouseEnter={() => setHoveredGenre(genre)}
        onMouseLeave={() => setHoveredGenre(null)}
      >
        <div className="min-w-0 flex-1">
          <p
            className="text-[0.95rem] font-bold transition-colors"
            style={{ color: isHovered ? "var(--primary)" : "var(--foreground)" }}
          >
            {genre}
          </p>
          {data && (
            <p className="mt-1 text-[0.78rem] leading-relaxed text-[var(--muted-foreground)]">
              {data.desc}
            </p>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-1.5 pt-0.5">
          {count > 0 && (
            <span className="whitespace-nowrap text-[0.72rem] text-[var(--muted-foreground)]">
              {count} novels
            </span>
          )}
          <ChevronRight
            className="size-3.5 shrink-0 transition-colors"
            style={{ color: isHovered ? "var(--primary)" : "var(--muted-foreground)" }}
          />
        </div>
      </Link>
    );
  }

  return (
    <main className="min-h-screen" style={{ background: "var(--background)" }}>
      <div className="mx-auto max-w-3xl px-4 py-6 sm:py-10">
        <div className="mb-6">
          <h1 className="font-serif text-[clamp(1.4rem,3vw,1.9rem)] font-extrabold text-[var(--foreground)]">
            Genres
          </h1>
          <p className="text-[0.82rem] text-[var(--muted-foreground)]">
            {allGenreKeys.length} genres available
          </p>
        </div>

        <AdSlot className="mb-6" />

        <div
          className="mb-6 overflow-hidden rounded-lg"
          style={{ border: "1px solid color-mix(in_srgb, var(--foreground) 8%, transparent)" }}
        >
          {allGenreKeys.slice(0, mid).map((genre) => renderRow(genre, false))}
        </div>

        <AdSlot className="mb-6" />

        <div
          className="overflow-hidden rounded-lg"
          style={{ border: "1px solid color-mix(in_srgb, var(--foreground) 8%, transparent)" }}
        >
          {allGenreKeys.slice(mid).map((genre, i, arr) => renderRow(genre, i === arr.length - 1))}
        </div>

        <AdSlot className="mt-6" />
      </div>
    </main>
  );
}

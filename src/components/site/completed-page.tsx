"use client";

import { CheckCircle2 } from "lucide-react";
import { useState } from "react";
import type { ReactElement } from "react";

import { AdSlot } from "@/components/site/ad-slot";
import { GenrePill } from "@/components/site/genre-pill";
import { NovelCard } from "@/components/site/novel-card";
import { GENRES, catalogNovels } from "@/lib/site/mock-novels";

const SORT_OPTIONS = ["Most Popular", "Highest Rated", "Most Chapters", "Recently Completed"];

type CompletedPageProps = {
  locale: string;
};

export function CompletedPage({ locale }: CompletedPageProps): ReactElement {
  const [genre, setGenre] = useState("All");
  const [sort, setSort] = useState("Most Popular");
  const [view, setView] = useState<"grid" | "list">("list");

  const completed = catalogNovels
    .filter((n) => n.status === "COMPLETED")
    .filter((n) => genre === "All" || n.genre === genre || n.tags.includes(genre))
    .sort((a, b) => {
      if (sort === "Highest Rated") return b.rating - a.rating;
      if (sort === "Most Chapters") return b.chapters - a.chapters;
      return b.rating - a.rating;
    });

  const stats = [
    {
      label: "Total Completed",
      value: catalogNovels.filter((n) => n.status === "COMPLETED").length.toString(),
    },
    {
      label: "Avg. Chapters",
      value: Math.round(
        catalogNovels
          .filter((n) => n.status === "COMPLETED")
          .reduce((s, n) => s + n.chapters, 0) /
          catalogNovels.filter((n) => n.status === "COMPLETED").length,
      ).toString(),
    },
    {
      label: "Avg. Rating",
      value: (
        catalogNovels
          .filter((n) => n.status === "COMPLETED")
          .reduce((s, n) => s + n.rating, 0) /
        catalogNovels.filter((n) => n.status === "COMPLETED").length
      ).toFixed(1),
    },
  ];

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="mb-8">
        <h1 className="font-serif text-[clamp(1.6rem,3vw,2.2rem)] font-extrabold tracking-tight text-[var(--foreground)]">
          Completed
        </h1>
        <p className="text-[0.85rem] text-[var(--muted-foreground)]">
          Finished stories &mdash; no waiting for new chapters
        </p>
      </div>

      <AdSlot className="mb-8" />

      <div className="mb-8 grid grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border p-4 text-center"
            style={{ background: "var(--card)", borderColor: "var(--border)" }}
          >
            <p className="font-serif text-[1.6rem] font-extrabold text-[var(--primary)]">
              {stat.value}
            </p>
            <p className="text-[0.72rem] text-[var(--muted-foreground)]">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {GENRES.map((g) => (
            <GenrePill key={g} label={g} active={genre === g} onClick={() => setGenre(g)} />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-xl border px-3 py-2 text-[0.8rem] text-[var(--foreground)] outline-none"
            style={{ background: "var(--card)", borderColor: "var(--border)", cursor: "pointer" }}
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
          <div
            className="flex items-center gap-0.5 rounded-xl border p-1"
            style={{ background: "var(--card)", borderColor: "var(--border)" }}
          >
            {(["list", "grid"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className="rounded-lg px-2.5 py-1 text-[0.72rem] font-medium transition-all"
                style={{
                  background: view === v ? "color-mix(in_srgb, var(--primary) 12%, transparent)" : "transparent",
                  color: view === v ? "var(--primary)" : "var(--muted-foreground)",
                }}
              >
                {v === "list" ? "\u2261 List" : "\u229E Grid"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <AdSlot className="mb-6" />

      <div className="mb-5 flex items-center gap-2">
        <CheckCircle2 className="size-4" style={{ color: "#6366f1" }} />
        <p className="text-[0.8rem] text-[var(--muted-foreground)]">
          {completed.length} fully completed novels
        </p>
      </div>

      {view === "list" ? (
        <div className="grid gap-3">
          {completed.map((n) => (
            <NovelCard key={n.id} locale={locale} novel={n} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {completed.map((n) => (
            <NovelCard key={n.id} compact locale={locale} novel={n} />
          ))}
        </div>
      )}

      <AdSlot className="mt-8" />

      {completed.length === 0 && (
        <div className="py-24 text-center">
          <h2 className="font-serif text-[1.4rem] font-bold text-[var(--muted-foreground)]">
            No completed novels here yet
          </h2>
          <p className="mt-2 text-[0.85rem] text-[var(--muted-foreground)]">
            Try a different genre filter.
          </p>
        </div>
      )}
    </main>
  );
}
